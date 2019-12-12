import {CanvasPosition} from './CanvasPosition.js';
import {ListenerData} from './ListenerData.js';

export class MouseData extends ListenerData {
	/** @type {CanvasPosition} */
	position;

	constructor() {
		super();
		this.position = new CanvasPosition(0,0);
	}
}
