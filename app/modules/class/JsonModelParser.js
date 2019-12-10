import * as JsonModelType from '../enum/JsonModelType.js';
import * as JsonModelPositionType from '../enum/JsonModelPositionType.js';
import {Position} from './Position.js';
import {CelestialBody} from './CelestialBody.js';
import {Vector} from './Vector.js';
import {Orbit} from './Orbit.js';
import {getOrbitalVelocity} from '../../main.js';

export class JsonModelParser {
	view;

	constructor(view) {
		this.view = view;
	}

	run(jsonModel) {
		switch (jsonModel.type) {
			case JsonModelType.RAW:
				return this.parseRaw(jsonModel);
			case JsonModelType.MODEL:
				return this.parseModel(jsonModel);
		}
	}

	parseRaw(jsonModel) {

	}

	parseModel(jsonModel) {
		let bodies = jsonModel['bodies'];
		let objects = [];
		for (let item of bodies) {
			objects = objects.concat(this.parseModelItem(item));
		}
		return objects;
	}

	parseModelItem(item) {
		let list = [],
			mass = item['mass'],
			radius = item['radius'],
			color = item['color'],
			velocity = this.parseModelItemVelocity(item['velocity']),
			position = this.parseModelItemPosition(item['position']),
			satellites = item['satellites'];

		let createdItem = new CelestialBody(position, mass, radius, velocity, color);
		list.push(createdItem);

		for (let satellite of satellites) {
			list = list.concat(this.parseModelItemSatellite(satellite, createdItem));
		}

		return list;
	}


	parseModelItemSatellite(satellite, parentBody) {
		let list = [],
			mass = satellite['mass'],
			radius = satellite['radius'],
			color = satellite['color'],
			satellites = satellite['satellites'],
			orbit = satellite['orbit'],
			distance = orbit['distance'],
			period = orbit['period'];

		let position = parentBody.position.add(new Vector(distance, 0));
		let velocity = parentBody.velocity.add(new Vector(0, getOrbitalVelocity(distance, period)));

		let createdItem = new CelestialBody(position, mass, radius, velocity, color);
		list.push(createdItem);
		let createdOrbit = new Orbit(parentBody, distance, color);
		list.push(createdOrbit);

		if (satellites) {
			for (let subSatellite of satellites) {
				list = list.concat(this.parseModelItemSatellite(subSatellite, createdItem));
			}
		}

		return list;
	}

	parseModelItemVelocity(velocity) {
		if (!velocity) return;
		return new Vector(velocity[0], velocity[1])
	}

	parseModelItemPosition(position) {
		if (!position) return;
		switch(position.type) {
			case JsonModelPositionType.CENTERED:
				return this.view.getCanvasCenterPosition();
			case JsonModelPositionType.PRECISE:
				return new Position(position.value[0], position.value[1]);
		}
	}
}
