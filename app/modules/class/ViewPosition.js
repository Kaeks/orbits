import {Position} from './Position.js';
import {Vector} from './Vector.js';
import {CanvasPosition} from './CanvasPosition.js';

export class ViewPosition extends Position {

	constructor(x, y) {
		super(x, y);
	}

	getCanvasPosition(camera) {
		let cameraPosition = camera.position;
		let cameraCenter = camera.center;

		let position = super
			.add(new Vector(cameraPosition.x, cameraPosition.y).multiply(-1))
			.scale(1 / camera.scale)
			.add(new Vector(cameraCenter.x, cameraCenter.y));

		return Object.assign(new CanvasPosition(), position);
	}

}