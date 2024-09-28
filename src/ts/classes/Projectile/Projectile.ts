import { ctx } from '../../global';

import Enemy from '../Enemy/Enemy';
import Sprite from '../Sprite/Sprite';

import { IPosition } from '../../interfaces/IPosition';
import { IProjectileConstructor } from './projectile.interface';

export default class Projectile extends Sprite {
	velocity: IPosition = {
		x: 0,
		y: 0,
	};
	enemy: Enemy;
	radius = 10;

	constructor({ position, enemy }: IProjectileConstructor) {
		super({ position, imageSrc: './assets/img/projectile.png' });
		this.position = position;
		this.enemy = enemy;
	}

	private drawBlocks() {
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = 'orange';
		ctx.fill();
		ctx.closePath();
	}

	update() {
		this.draw();

		const angle = Math.atan2(
			this.enemy.center.y - this.position.y,
			this.enemy.center.x - this.position.x
		);

		this.velocity.x = Math.cos(angle) * 4;
		this.velocity.y = Math.sin(angle) * 4;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}
