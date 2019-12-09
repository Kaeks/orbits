import {Position} from './modules/class/Position.js';
import {MouseData} from './modules/class/MouseData.js';
import {Vector} from './modules/class/Vector.js';
import {MovingObject} from './modules/class/MovingObject.js';
import {Camera} from './modules/class/Camera.js';
import {KeyData} from './modules/class/KeyData.js';
import {CrossHair} from './modules/class/CrossHair.js';

/**
 * In m^3 / kg*s^2
 * @type {number}
 */
export const GRAVITATION_CONSTANT = 6.67430e-11; //m^3 / kg*s^2

export const INITIAL_CAMERA_SCALE = 5e7;
export const MIN_CAMERA_SCALE = 1e3;
export const MAX_CAMERA_SCALE = 5e10;

/**
 * In meters
 * @type {number}
 */
export const ASTRONOMICAL_UNIT = 1.496e11;

/**
 * In meters
 * @param distance
 * @returns {number}
 */
export function getCircumference(distance) {
	return 2 * Math.PI * distance;
}

/**
 * In meters per second
 * @param distance
 * @param period
 */
export function getOrbitalVelocity(distance, period) {
	let periodInSeconds = period * 24 * 60 * 60;
	return getCircumference(distance) / periodInSeconds;
}

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

	let keyData = new KeyData();

	function keyListener(e) {
		switch (e.type) {
			case 'keydown':
				keyData.events[e.key] = true;
				break;
			case 'keyup':
				keyData.events[e.key] = false;
				break;
		}
	}

	let mouseData = new MouseData();
	let lastMousePos = getCanvasCenterPosition();

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
				let vector = new Vector(mouseData.position.x - lastMousePos.x, mouseData.position.y - lastMousePos.y).multiply(2);
				camera.position = camera.position.add(vector);
				lastMousePos = mouseData.position;
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
		obj1.applyForce(f, getVectorFromTo(obj1, obj2).normalize());
		obj2.applyForce(f, getVectorFromTo(obj2, obj1).normalize());
	}

	function displayFPS(amt) {
		context.fillStyle = '#fff';
		context.font = '24px Arial';
		context.fillText(amt, 50, 50);
	}

	function displayUpdates(amt) {
		context.fillStyle = '#fff';
		context.font = '24px Arial';
		context.fillText(amt, 50, 70);
	}

	let camera = new Camera(getCanvasCenterPosition(), getCanvasCenterPosition(), INITIAL_CAMERA_SCALE, MIN_CAMERA_SCALE, MAX_CAMERA_SCALE);

	// APP LOOP AND SETUP

	let frames = 0;
	let updates = 0;
	let started = new Date();

	function logicLoop() {
		updates++;
		// UPDATE ALL
		for (let i = 0; i < appObjectList.length; i++) {
			let cur = appObjectList[i];
			cur.update(mouseData);
		}

		for (let i = 0; i < appObjectList.length - 1; i++) {
			let obj1 = appObjectList[i];
			for (let j = i + 1; j < appObjectList.length; j++) {
				let obj2 = appObjectList[j];
				if (obj1 instanceof MovingObject && obj2 instanceof MovingObject) {
					applyGravity(obj1, obj2);
				}
			}
		}
		setTimeout(logicLoop, 0);
	}

	function appLoop() {
		// CLEAR FRAME
		context.clearRect(0, 0, canvas.width, canvas.height);

		frames++;

		let scalingScale = 1.1;
		let moveBy = 5;

		if (keyData.events['ArrowLeft']) {
			camera.move(- moveBy, 0);
		}
		if (keyData.events['ArrowRight']) {
			camera.move(moveBy, 0);
		}
		if (keyData.events['ArrowUp']) {
			camera.move(0, - moveBy);
		}
		if (keyData.events['ArrowDown']) {
			camera.move(0, moveBy);
		}

		if (mouseData.events[0]) {
			camera.scaleScale(1 / scalingScale);
		}

		if (mouseData.events[2]) {
			camera.scaleScale(scalingScale);
		}

		let now = new Date();
		let diff = now.valueOf() - started.valueOf();
		displayFPS(Math.floor(frames / (diff / 1000)));
		displayUpdates(Math.floor(updates / (diff / 1000)));
		if (now.valueOf() >= started.valueOf() + 500) {
			frames = 0;
			updates = 0;
			started = new Date();
		}

		// necessary for chrome devtools
		appObjectList = appObjectList;

		// DRAW ALL
		for (let i = 0; i < appObjectList.length; i++) {
			let cur = appObjectList[i];
			cur.draw(context, camera);
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
		let crossHair = new CrossHair(camera);

		appObjectList.push(crossHair);

		// LISTENER SETUP
		addEventListener('mousedown', mouseListener);
		addEventListener('mouseup', mouseListener);
		addEventListener('mousemove', mouseListener);
		addEventListener('contextmenu', function(e) {
			e.preventDefault();
		}, false);
		addEventListener('keydown', keyListener);
		addEventListener('keyup', keyListener);

		// GAME START
		logicLoop();
		appLoop();
	}

	// Entry point
	setup();
}(document.querySelector('canvas'), document.querySelector('canvas').getContext('2d')));