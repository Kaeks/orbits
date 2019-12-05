import {Position} from './Position.js';

export class MouseData {
	position;
	events;

	constructor() {
		this.position = new Position(0,0);
		this.events = [];
	}
}
