export class AppObject {
	position;
	isVisible = true;

	constructor(position) {
		this.position = position;
	}

	moveTo(position) {
		this.position = position;
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

	draw(context, camera) {
	}

}
