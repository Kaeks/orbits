import {Position} from './Position.js';
import {ListenerData} from './ListenerData.js';

export class MouseData extends ListenerData {
	position;

	constructor() {
		super();
		this.position = new Position(0,0);
	}
}
