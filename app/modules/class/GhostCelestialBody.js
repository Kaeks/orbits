import {GhostObject} from './GhostObject.js';
import {Vector} from './Vector.js';
import {CelestialBody} from './CelestialBody.js';
import {getVolume} from '../../main.js';
import {ViewPosition} from './ViewPosition.js';

const RADIUS_GROWTH_RATE = 100000;
/**
 * In g/cm^3
 * @type {number}
 */
const DENSITY = 50000000000000000.51;

export class GhostCelestialBody extends GhostObject {

	initialPosition;
	radius;
	projectedVelocity;

	/**
	 * @param {ViewPosition} position
	 */
	constructor(position) {
		super(position);
		this.initialPosition = position;
		this.radius = 1;
		this.projectedVelocity = new Vector(0, 0, this.position);
	}

	increaseRadius() {
		this.radius += RADIUS_GROWTH_RATE;
	}

	createReal() {
		let position = this.position;
		let mass = getVolume(this.radius) * 1000 * DENSITY;
		let radius = this.radius;
		let velocity = this.projectedVelocity;
		let color = '#fff';
		console.log('Created new celestial body at x:' + position.x + ', y:' + position.y + ' with mass:' + mass + ', radius:' + radius + ', velocity: x:' + velocity.x + ', y:' + velocity.y);
		return new CelestialBody(position, mass, radius, velocity, color);
	}

	update(mouseData) {
		super.update(mouseData);
	}

	draw(context, camera) {
		super.draw(context, camera);
		let realPosition = this.position.getCanvasPosition(camera);
		context.fillStyle = 'rgba(255,255,255,0.5)';
		context.beginPath();
		let adjustedRadius = this.radius / camera.scale;
		let radius = adjustedRadius > 0.5 ? adjustedRadius : 0.5;
		context.arc(realPosition.x, realPosition.y, radius, 0, 2 * Math.PI);
		context.fill();

		context.strokeStyle = 'rgba(255,0,0,0.5)';

		let adjustedProjectedVelocity = this.projectedVelocity.multiply(1000);

		let adjustedStart = Object.assign(new ViewPosition(), adjustedProjectedVelocity.start);
		let canvasStart = adjustedStart.getCanvasPosition(camera);
		context.beginPath();
		context.moveTo(canvasStart.x, canvasStart.y);
		let adjustedEnd = Object.assign(new ViewPosition(), adjustedProjectedVelocity.getEnd());
		let canvasEnd = adjustedEnd.getCanvasPosition(camera);
		context.lineTo(canvasEnd.x, canvasEnd.y);
		context.stroke();
	}
}