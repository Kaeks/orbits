import {Position} from './Position.js';

export class View {
	canvas;
	context;
	objectList;

	constructor(canvas, context) {
		this.canvas = canvas;
		this.context = context;
		this.objectList = {};
	}

	addObject(object) {
		this.objectList.push(object);
	}

	setObjectList(objectList) {
		this.objectList = objectList;
	}

	/**
	 * Get the center position of the canvas
	 * @returns {Position}
	 */
	getCanvasCenterPosition() {
		return new Position(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2);
	}
}