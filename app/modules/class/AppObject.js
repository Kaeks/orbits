export class AppObject {
	position;
	isVisible = true;

	constructor(position, mass) {
		this.position = position;
	}

	moveTo(position) {
		this.position = position;
		//console.log('Moved to x:' + position.x + ', y:' + position.y);
	}

	setVisible(newVal) {
		this.isVisible = newVal;
	}

	show() {
		this.setVisible(true);
	}

	hide() {
		this.setVisible(false);
	}

	click(mouseData) {
	}

	update(mouseData) {
	}

	draw(context) {
	}

}
