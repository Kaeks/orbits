import {CanvasPosition} from './CanvasPosition.js';

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

	removeObject(object) {
		this.objectList.find(element => {
			return element === object;
		});
	}

	setObjectList(objectList) {
		this.objectList = objectList;
	}

	/**
	 * Get the center position of the canvas
	 * @returns {CanvasPosition}
	 */
	getCanvasCenterPosition() {
		return new CanvasPosition(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2);
	}
}