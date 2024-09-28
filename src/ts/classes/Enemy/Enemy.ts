import { ctx } from '../../global';

import Sprite from '../Sprite/Sprite';

import { waypoints } from '../../data/waypoints';

import { IEnemyConstructor } from './enemy.interface';
import { IPosition } from '../../interfaces/IPosition';

export default class Enemy extends Sprite {
	waypointIndex = 0;
	center: IPosition = {
		x: 0,
		y: 0,
	};
	radius = 50;
	health = 100;
	velocity: IPosition = {
		x: 0,
		y: 0,
	};
	private speed = 2;

	constructor({ position }: IEnemyConstructor) {
		super({ position, imageSrc: './assets/img/orc.png', framesMax: 7 });
		this.position = position;
	}

	private drawBlocks() {
		ctx.beginPath();
		ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = 'red';
		ctx.fill();
		ctx.closePath();
	}

	private drawHealthbar() {
		ctx.fillStyle = 'red';
		ctx.fillRect(this.position.x, this.position.y - 15, this.width, 10);

		ctx.fillStyle = 'green';
		ctx.fillRect(this.position.x, this.position.y - 15, this.width * (this.health / 100), 10);
	}

	update() {
		this.draw();
		this.drawHealthbar();
		super.updateFrame();

		const waypoint = waypoints[this.waypointIndex];
		const xDistance = waypoint.x - this.center.x;
		const yDistance = waypoint.y - this.center.y;
		const angle = Math.atan2(yDistance, xDistance);

		this.velocity.x = Math.cos(angle) * this.speed;
		this.velocity.y = Math.sin(angle) * this.speed;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		this.center = {
			x: this.position.x + this.width / 2,
			y: this.position.y + this.height / 2,
		};

		if (
			Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) <
				Math.abs(this.velocity.x) &&
			Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) <
				Math.abs(this.velocity.y) &&
			this.waypointIndex < waypoints.length - 1
		) {
			this.waypointIndex++;
		}
	}
}
