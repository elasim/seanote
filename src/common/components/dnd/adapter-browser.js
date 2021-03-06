import Rx from 'rx';
import { isEqual, getElementParentNodes } from './utils';
import Hammer from 'hammerjs';

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

function selectContainer(origin, list) {
	const targets = getElementParentNodes(origin);
	let idx = -1;
	for (const target of targets) {
		const testIdx = list.findIndex(item => {
			return item.element === target;
		});
		if (testIdx > -1) {
			idx = testIdx;
			break;
		}
	}
	return (idx > -1) ? list[idx] : null;
}

function onPanStart(e) {
	if (this.dragInfo) return;

	const descriptor = selectContainer(e.target, this.draggable);
	if (!descriptor || descriptor.press) return;

	this.dragInfo = { ...descriptor };
	this.dragStart$.onNext({
		descriptor: this.dragInfo,
		event: e,
		target: descriptor.element,
	});
	e.preventDefault();
}

function onPanMove(e) {
	if (this.dragInfo === null) return;
	e.preventDefault();

	const pointing = document.elementFromPoint(e.pointers[0].clientX, e.pointers[0].clientY);
	const descriptor = selectContainer(pointing, this.droppable);

	this.dragMove$.onNext({
		descriptor: this.dragInfo,
		event: e,
		target: descriptor ? descriptor.element : null,
	});
}

function onPanEnd(e) {
	return this::drop(e);
}

function onPress(e) {
	const descriptor = selectContainer(e.target,  this.draggable);

	if (!descriptor || !descriptor.press) return;

	this.dragInfo = { ...descriptor };
	this.dragStart$.onNext({
		descriptor: this.dragInfo,
		event: e,
		target: descriptor.element,
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
