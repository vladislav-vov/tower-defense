import { ctx } from '../../global';

import { IPlacementTileConstructor } from './placementTile.interface';
import { IMouse } from '../../interfaces/IMouse';

export default class PlacementTile {
	position: { x: number; y: number };
	static size = 64;
	private color = 'rgba(255, 255, 255, 0.1)';
	occupied = false;

	constructor({ position }: IPlacementTileConstructor) {
		this.position = position;
	}

	draw() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.position.x, this.position.y, PlacementTile.size, PlacementTile.size);
	}

	update(mouse: IMouse) {
		this.draw();

		if (
			mouse.x &&
			mouse.y &&
			mouse.x > this.position.x &&
			mouse.x < this.position.x + PlacementTile.size &&
			mouse.y > this.position.y &&
			mouse.y < this.position.y + PlacementTile.size
		) {
			this.color = 'white';
		} else this.color = 'rgba(255, 255, 255, 0.1)';
	}
}
