import { ctx } from '../../global';

import { IBuildingConstructor } from './building.interface';

import Projectile from '../Projectile/Projectile';
import Enemy from '../Enemy/Enemy';
import Sprite from '../Sprite/Sprite';

export default class Building extends Sprite {
	position: { x: number; y: number };
	width = 128;
	height = 64;
	center: { x: number; y: number };
	projectiles: Projectile[] = [];
	radius = 250;
	target: null | Enemy = null;

	constructor({ position }: IBuildingConstructor) {
		super({
			position,
			imageSrc: './assets/img/tower.png',
			framesMax: 19,
			offset: { x: 0, y: -80 },
		});

		this.center = {
			x: this.position.x + this.width / 2,
			y: this.position.y + this.height / 2,
		};
	}

	drawBlocks() {
		ctx.fillStyle = 'green';
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

		ctx.beginPath();
		ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
		ctx.fill();
		ctx.closePath();
	}

	update() {
		this.draw();

		if (this.target || (!this.target && this.frames.current !== 0)) super.updateFrame();

		if (
			this.target &&
			this.frames.current === 6 &&
			this.frames.elapsed % this.frames.buffer === 0
		) {
			this.shoot();
		}
	}

	shoot() {
		this.projectiles.push(
			new Projectile({
				position: {
					x: this.center.x - 20,
					y: this.center.y - 110,
				},
				enemy: this.target as Enemy,
			})
		);
	}
}
