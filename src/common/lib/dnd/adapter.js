import Rx from 'rx';
import Hammer from 'hammerjs';
import { isEqual, getElementParentNodes } from './utils';

export default class HammerAdapter {
	context = null;
	dragInfo = null;
	draggable = [];
	droppable = [];

	constructor() {
		this.dragStart$ = new Rx.Subject();
		this.dragMove$ = new Rx.Subject();
		this.dragEnd$ = new Rx.Subject();
	}
	initialize(root, { touchAction, threshold, pointers }) {
		if (this.context) {
			this.destroy();
		}
		const ctx = new Hammer.Manager(root);
		this.context = ctx;
		ctx.set({
			touchAction
		});
		ctx.add(new Hammer.Pan({
			threshold,
			pointers
		}));
		ctx.on('panstart', this::onPanStart);
		ctx.on('panend', this::onPanEnd);
		ctx.on('panmove', this::onPanMove);

	}
	destroy() {
		this.context.destroy();
	}
	createHook(start, move, end) {
		const observers = [];
		if (start) observers.push(this.dragStart$.subscribe(start));
		if (move) observers.push(this.dragMove$.throttle(1000 / 60).subscribe(move));
		if (end) observers.push(this.dragEnd$.subscribe(end));
		return () => observers.forEach(o => o.dispose());
	}

	registerDraggable(descriptor) {
		const idx = this.draggable.findIndex(isEqual(descriptor));
		if (idx === -1) {
			this.draggable.push(descriptor);
		}
	}
	registerDroppable(descriptor) {
		const idx = this.droppable.findIndex(isEqual(descriptor));
		if (idx === -1) {
			this.droppable.push(descriptor);
		}
	}

	unregisterDraggable(descriptor) {
		const idx = this.draggable.findIndex(isEqual(descriptor));
		if (idx !== -1) this.draggable.splice(idx, 1);
	}
	unregisterDroppable(descriptor) {
		const idx = this.droppable.findIndex(isEqual(descriptor));
		if (idx !== -1) this.droppable.splice(idx, 1);
	}
}

function onPanStart(e) {
	const targets = getElementParentNodes(e.target);
	const idx = this.draggable.findIndex(descriptor => {
		return targets.indexOf(descriptor.element) !== -1;
	});
	if (idx === -1) return;

	this.dragInfo = { ...this.draggable[idx] };
	this.dragStart$.onNext({
		descriptor: this.dragInfo,
		event: e,
		target: targets[idx],
	});
	e.preventDefault();
}

function onPanMove(e) {
	if (this.dragInfo === null) return;
	e.preventDefault();

	const pointing = document.elementFromPoint(e.pointers[0].clientX, e.pointers[0].clientY);
	const targets = getElementParentNodes(pointing);

	let idx = -1;
	for (const target of targets) {
		const testIdx = this.droppable.findIndex(droppable => {
			return droppable.element === target;
		});
		if (testIdx > -1) {
			idx = testIdx;
			break;
		}
	}

	this.dragMove$.onNext({
		descriptor: this.dragInfo,
		event: e,
		target: idx > -1 ? this.droppable[idx].element : null,
	});
}

function onPanEnd(e) {
	if (this.dragInfo === null) return;
	e.preventDefault();

	this.dragEnd$.onNext({
		descriptor: this.dragInfo,
		event: e
	});
	this.dragInfo = null;
}
