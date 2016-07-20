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
		ctx.add(new Hammer.Press());
		ctx.on('panstart', this::onPanStart);
		ctx.on('panend', this::onPanEnd);
		ctx.on('panmove', this::onPanMove);
		ctx.on('press', this::onPress);
		ctx.on('pressup', this::onPressUp);
	}
	destroy() {
		this.context.destroy();
	}
	createHook(start, move, end) {
		const observers = [];
		if (start) observers.push(this.createStartHook(start));
		if (move) observers.push(this.createMoveHook(move));
		if (end) observers.push(this.createEndHook(end));
		return () => observers.forEach(o => o.dispose());
	}
	createStartHook(hook) {
		return this.dragStart$.subscribe(hook);
	}
	createMoveHook(hook, throttle = 1000 / 60) {
		return this.dragMove$.throttle(throttle).subscribe(hook);
	}
	createEndHook(hook) {
		return this.dragEnd$.subscribe(hook);
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
	if (this.dragInfo) return;

	const targets = getElementParentNodes(e.target);
	const idx = this.draggable.findIndex(descriptor => {
		return targets.indexOf(descriptor.element) !== -1;
	});
	if (idx === -1) return;

	const descriptor = this.draggable[idx];
	if (descriptor.press) return;

	this.dragInfo = { ...descriptor };
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
	return this::drop(e);
}

function onPress(e) {
	const targets = getElementParentNodes(e.target);
	const idx = this.draggable.findIndex(descriptor => {
		return targets.indexOf(descriptor.element) !== -1;
	});
	if (idx === -1) return;

	const descriptor = this.draggable[idx];
	if (!descriptor.press) return;

	this.dragInfo = { ...descriptor };
	this.dragStart$.onNext({
		descriptor: this.dragInfo,
		event: e,
		target: targets[idx],
	});
}

function onPressUp(e) {
	return this::drop(e);
}

function drop(e) {
	if (this.dragInfo === null) return;
	e.preventDefault();

	this.dragEnd$.onNext({
		descriptor: this.dragInfo,
		event: e
	});
	this.dragInfo = null;
}
