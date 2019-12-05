import {Position} from './modules/class/Position.js';
import {MouseData} from './modules/class/MouseData.js';
import {MovingObject} from './modules/class/MovingObject.js';
import {CelestialBody} from './modules/class/CelestialBody.js';
import {Vector} from './modules/class/Vector.js';

const GRAVITATION_CONSTANT = 6.67430e-11; //m^3 / kg*s^2

(function(canvas, context) {
	// LIST OF ALL OBJECTS
	let appObjectList = [];

	// METHODS

	/**
	 * Get the center position of the canvas
	 *
	 * @returns {Position}
	 */
	function getCanvasCenterPosition() {
		return new Position(canvas.clientWidth / 2, canvas.clientHeight / 2);
	}

	// INPUT LISTENERS

	let mouseData = new MouseData();

	function mouseListener(e) {
		switch (e.type) {
			case 'mousedown':
				mouseData.events[e.button] = true;
				break;
			case 'mouseup':
				mouseData.events[e.button] = false;
				break;
			case 'mousemove':
				mouseData.position = new Position(e.clientX, e.clientY);
				break;
		}
	}

	function getVectorFromTo(obj1, obj2) {
		return new Vector(obj2.position.x - obj1.position.x, obj2.position.y - obj1.position.y, obj1.position);
	}

	function getDistance(obj1, obj2) {
		return getVectorFromTo(obj1, obj2).getLength();
	}

	function applyGravity(obj1, obj2) {
		let f = GRAVITATION_CONSTANT * ((obj1.mass * obj2.mass) / getDistance(obj1, obj2) ** 2);
		obj1.applyForce(f, getVectorFromTo(obj1, obj2));
		obj2.applyForce(f, getVectorFromTo(obj2, obj1));
	}

	// APP LOOP AND SETUP

	function appLoop() {
		// necessary for chrome devtools
		appObjectList = appObjectList;
		// UPDATE ALL
		for (let i = 0; i < appObjectList.length; i++) {
			let cur = appObjectList[i];
			cur.update(mouseData);
		}

		for (let i = 0; i < appObjectList.length - 1; i++) {
			let obj1 = appObjectList[i];
			for (let j = i + 1; j < appObjectList.length; j++) {
				let obj2 = appObjectList[j];
				applyGravity(obj1, obj2);
			}
		}

		// CLEAR FRAME
		context.clearRect(0, 0, canvas.width, canvas.height);

		// DRAW ALL
		for (let i = 0; i < appObjectList.length; i++) {
			let cur = appObjectList[i];
			cur.draw(context);
		}

		requestAnimationFrame(appLoop);
	}

	function setup() {
		// CANVAS SETUP
		window.addEventListener("resize", function() {
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
			context.imageSmoothingEnabled = false;
		});
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		context.imageSmoothingEnabled = false;

		// OBJECT SETUP
		let sun1Position = getCanvasCenterPosition().add(new Vector(-30, 0));
		let sun2Position = getCanvasCenterPosition().add(new Vector(30, 0));
		let sun1 = new CelestialBody(sun1Position, 1e11, 20, new Vector(0, 2, sun1Position));
		let sun2 = new CelestialBody(sun2Position, 1e11, 20, new Vector(0, -2, sun2Position));
		let binaryCenter = sun1.position.add(getVectorFromTo(sun1, sun2).multiply(0.5));
		//let planetPosition = new Position(400, 300);
		let planetPosition = binaryCenter.add(new Vector(-400, 0));
		let planet = new CelestialBody(planetPosition, 1e8, 10, new Vector(0, 2.5, planetPosition));
		let moonPosition = planet.position.add(new Vector(-50, 0));
		let moon = new CelestialBody(moonPosition, 1e3, 5, new Vector(0, 2, moonPosition));

		appObjectList.push(sun1);
		appObjectList.push(sun2);
		appObjectList.push(planet);
		appObjectList.push(moon);

		// LISTENER SETUP
		addEventListener('mousedown', mouseListener);
		addEventListener('mouseup', mouseListener);
		addEventListener('mousemove', mouseListener);
		addEventListener('contextmenu', function(e) {
			e.preventDefault();
		}, false);

		// GAME START
		appLoop();
	}

	// Entry point
	setup();
}(document.querySelector('canvas'), document.querySelector('canvas').getContext('2d')));