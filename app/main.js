import {MouseData} from './modules/class/MouseData.js';
import {Vector} from './modules/class/Vector.js';
import {MovingObject} from './modules/class/MovingObject.js';
import {Camera} from './modules/class/Camera.js';
import {KeyData} from './modules/class/KeyData.js';
import {CrossHair} from './modules/class/CrossHair.js';
import {View} from './modules/class/View.js';
import {JsonModelParser} from './modules/class/JsonModelParser.js';
import {GhostCelestialBody} from './modules/class/GhostCelestialBody.js';
import {ViewPosition} from './modules/class/ViewPosition.js';
import {CanvasPosition} from './modules/class/CanvasPosition.js';
import {CelestialBody} from './modules/class/CelestialBody.js';

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
 * In meters cubed
 * @param radius
 * @returns {number}
 */
export function getVolume(radius) {
	return 4/3 * Math.PI * radius;
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

async function getSolarSystemModelJson() {
	return await fetch('app/models/SolarSystem.json').then(response => {
		return response.json();
	});
}

(function(canvas, context) {
	// VIEW
	let activeView;

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

	let ghostObject;

	function mouseListener(e) {
		switch (e.type) {
			case 'mousedown':
				mouseData.events[e.button] = true;
				if (e.button === 0) {
					console.log('mb 1 down at: x:' + mouseData.position.x + ', y:' + mouseData.position.y);
					ghostObject = new GhostCelestialBody(mouseData.position.getViewPosition(camera));
				}
				break;
			case 'mouseup':
				mouseData.events[e.button] = false;
				if (e.button === 0) {
					console.log('mb 1 up at: x:' + mouseData.position.x + ', y:' + mouseData.position.y);
					let newObject = ghostObject.createReal();
					ghostObject = null;
					activeView.addObject(newObject);
				}
				if (e.button === 2) {
					spawnLots(8e25, 400000);
				}
				break;
			case 'mousemove':
				mouseData.position = new CanvasPosition(e.clientX, e.clientY);
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

	function checkCollision(obj1, obj2) {
		return getDistance(obj1, obj2) <= obj1.radius + obj2.radius;
	}

	function placeApart(obj1, obj2) {
		let intendedDistance = obj1.radius + obj2.radius;
		let connectionVector = new Vector(obj2.position.x - obj1.position.x, obj2.position.y - obj1.position.y);
		let actualDistance = connectionVector.getLength();
		let diff = intendedDistance - actualDistance;
		let normalized = connectionVector.normalize();
		obj1.position = obj1.position.add(normalized.multiply(- diff / 2));
		obj2.position = obj2.position.add(normalized.multiply(diff / 2));
	}

	function spawnLots(mass, radius, amount = 12, distance = 5000000) {
		let center = mouseData.position.getViewPosition(camera);
		for (let i = 0; i < amount; i++) {
			let angle = i * 360 / amount;
			let randomizedDistance = getRandomInt(distance - 1000000, distance + 1000000);
			let vector = new Vector(randomizedDistance * Math.sin(angle * Math.PI / 180), randomizedDistance * Math.cos(angle * Math.PI / 180), center);
			let newPosition = center.add(vector);
			let newObject = new CelestialBody(newPosition, mass, radius, new Vector(0, 0), '#fff');
			activeView.addObject(newObject);
		}
	}

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
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

	let camera;

	// APP LOOP AND SETUP

	let frames = 0;
	let updates = 0;
	let started = new Date();

	function logicLoop() {
		updates++;
		// UPDATE ALL
		for (let i = 0; i < activeView.objectList.length; i++) {
			let cur = activeView.objectList[i];
			cur.update(mouseData);
		}

		if (ghostObject) {
			ghostObject.update(mouseData);
			let mousePosition = mouseData.position.getViewPosition(camera);
			let initialPosition = ghostObject.initialPosition;
			ghostObject.projectedVelocity = new Vector(mousePosition.x - initialPosition.x, mousePosition.y - initialPosition.y, ghostObject.position).multiply(- 1 / 1000);
		}

		for (let i = 0; i < activeView.objectList.length - 1; i++) {
			let obj1 = activeView.objectList[i];
			for (let j = i + 1; j < activeView.objectList.length; j++) {
				let obj2 = activeView.objectList[j];
				if (obj1 instanceof MovingObject && obj2 instanceof MovingObject) {
					if (checkCollision(obj1, obj2)) {
						placeApart(obj1, obj2);
						let newVelocity = obj1.velocity.multiply(obj1.mass).add(obj2.velocity.multiply(obj2.mass)).multiply(1 / (obj1.mass + obj2.mass));
						//obj1.setVelocity(newVelocity.x, newVelocity.y);
						//obj2.setVelocity(newVelocity.x, newVelocity.y);
					} else {
						applyGravity(obj1, obj2);
					}
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
		if (keyData.events['+']) {
			camera.scaleScale(1 / scalingScale)
		}
		if (keyData.events['-']) {
			camera.scaleScale(scalingScale);
		}

		if (mouseData.events[0]) {
			ghostObject.increaseRadius();
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
		let objectList = activeView.objectList;

		// DRAW ALL
		for (let i = 0; i < activeView.objectList.length; i++) {
			let cur = activeView.objectList[i];
			cur.draw(context, camera);
		}

		if (ghostObject) ghostObject.draw(context, camera);

		requestAnimationFrame(appLoop);
	}

	let solarSystemView;

	async function setup() {
		// CANVAS SETUP
		window.addEventListener("resize", function() {
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
			context.imageSmoothingEnabled = false;
		});
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		context.imageSmoothingEnabled = false;

		// VIEW SETUP
		solarSystemView = new View(canvas, context);

		// MODEL PARSER SETUP
		let parser = new JsonModelParser(solarSystemView);

		solarSystemView.setObjectList(parser.run(await getSolarSystemModelJson()));
		activeView = solarSystemView;

		// CAMERA SETUP
		camera = new Camera(new ViewPosition(0, 0), activeView.getCanvasCenterPosition(), INITIAL_CAMERA_SCALE, MIN_CAMERA_SCALE, MAX_CAMERA_SCALE);

		// OBJECT SETUP
		let crossHair = new CrossHair(camera);
		activeView.addObject(crossHair);

		// LISTENER SETUP
		addEventListener('mousedown', mouseListener);
		addEventListener('mouseup', mouseListener);
		addEventListener('contextmenu', function(e) {
			e.preventDefault();
		}, false);
		addEventListener('mousemove', mouseListener);
		addEventListener('keydown', keyListener);
		addEventListener('keyup', keyListener);

		// GAME START
		logicLoop();
		appLoop();
	}

	// Entry point
	setup().catch(console.error);
}(document.querySelector('canvas'), document.querySelector('canvas').getContext('2d')));