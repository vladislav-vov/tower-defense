import { ctx } from '../../global';

import { IPosition } from '../../interfaces/IPosition';
import { ISpriteConstructor } from './sprite.interface';

export default class Sprite {
	position: IPosition;
	offset: IPosition;
	protected width: number;
	protected height: number;
	frames = {
		max: 1,
		current: 0,
		elapsed: 0,
		buffer: 3,
	};
	private image = new Image();

	constructor({
		position,
		imageSrc,
		framesMax = 1,
		offset = { x: 0, y: 0 },
	}: ISpriteConstructor) {
		this.position = position;
		this.image.src = imageSrc;
		this.image.onload = () => {
			this.width = this.image.width / this.frames.max;
			this.height = this.image.height;
		};
		this.frames.max = framesMax;
		this.offset = offset;
	}

	draw() {
		if (!this.image.complete) return;

		const cropBox = {
			position: {
				x: this.width * this.frames.current,
				y: 0,
			},
			width: this.width,
			height: this.height,
		};

		ctx.drawImage(
			this.image,
			cropBox.position.x,
			cropBox.position.y,
			cropBox.width,
			cropBox.height,
			this.position.x + this.offset.x,
			this.position.y + this.offset.y,
			this.width,
			this.height
		);
	}

	updateFrame() {
		if (this.frames.max < 2) return;

		this.frames.elapsed++;

		if (this.frames.elapsed % this.frames.buffer === 0) {
			if (this.frames.current < this.frames.max - 1) {
				this.frames.current++;
			} else this.frames.current = 0;
		}
	}
}
