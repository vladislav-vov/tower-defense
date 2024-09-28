import { canvas, ctx, gameOverBlock, heartsBlock, coinsBlock } from './global';

import { Enemy, PlacementTile, Building, Sprite } from './classes';

import { waypoints } from './data/waypoints';
import { placementTilesData } from './data/placementTilesData';

import transformPlacementDataTo2D from './utils/transformPlacementDataTo2D';

import { IMouse } from './interfaces/IMouse';

canvas.width = 1280;
canvas.height = 768;

const mouse: IMouse = {
	x: undefined,
	y: undefined,
};

const placementTilesData2D = transformPlacementDataTo2D(placementTilesData);
const placementTiles: PlacementTile[] = [];

let activeTile: PlacementTile | null = null;

placementTilesData2D.forEach((row, y) => {
	row.forEach((symbol, x) => {
		if (symbol === 14) {
			placementTiles.push(
				new PlacementTile({
					position: {
						x: x * PlacementTile.size,
						y: y * PlacementTile.size,
					},
				})
			);
		}
	});
});

const enemies: Enemy[] = [];
let enemyCount = 3;

function spawnEnemies(spawnCount: number) {
	for (let i = 1; i < spawnCount + 1; i++) {
		const xOffset = i * 150;

		enemies.push(
			new Enemy({
				position: {
					x: waypoints[0].x - xOffset,
					y: waypoints[0].y,
				},
			})
		);
	}
}

spawnEnemies(enemyCount);

const buildings: Building[] = [];

const image = new Image();
image.src = './assets/img/gameMap.png';
image.onload = () => {
	animate();
};

let hearts = 10;
let coins = 100;

const explosions: Sprite[] = [];

let animationId: number;

coinsBlock.innerHTML = coins.toString();

function animate() {
	animationId = requestAnimationFrame(animate);

	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

	heartsBlock.innerHTML = hearts.toString();

	for (let i = enemies.length - 1; i >= 0; i--) {
		const enemy = enemies[i];

		enemy.update();

		if (enemy.position.x > canvas.width) {
			hearts -= 1;
			enemies.splice(i, 1);

			if (hearts === 0) {
				cancelAnimationFrame(animationId);
				heartsBlock.innerHTML = hearts.toString();
				gameOverBlock.style.display = 'flex';
			}
		}
	}

	for (let i = explosions.length - 1; i >= 0; i--) {
		const explosion = explosions[i];

		explosion.draw();
		explosion.updateFrame();

		if (explosion.frames.current === explosion.frames.max - 1) {
			explosions.splice(i, 1);
		}
	}

	if (enemies.length === 0) {
		enemyCount += 2;
		spawnEnemies(enemyCount);
	}

	placementTiles.forEach((placementTile) => {
		placementTile.update(mouse);
	});

	buildings.forEach((building) => {
		building.update();
		building.target = null;

		const validEnemies = enemies.filter((enemy) => {
			const xDistance = enemy.center.x - building.center.x;
			const yDistance = enemy.center.y - building.center.y;
			const distance = Math.hypot(xDistance, yDistance);

			return distance < enemy.radius + building.radius;
		});

		building.target = validEnemies[0];

		for (let i = building.projectiles.length - 1; i >= 0; i--) {
			const projectile = building.projectiles[i];

			projectile.update();

			const xDistance = projectile.enemy.center.x - projectile.position.x;
			const yDistance = projectile.enemy.center.y - projectile.position.y;
			const distance = Math.hypot(xDistance, yDistance);

			if (distance < projectile.enemy.radius + projectile.radius) {
				projectile.enemy.health -= 15;

				if (projectile.enemy.health <= 0) {
					const enemyIndex = enemies.findIndex((enemy) => projectile.enemy === enemy);

					if (enemyIndex > -1) {
						enemies.splice(enemyIndex, 1);

						coins += 25;
						coinsBlock.innerHTML = coins.toString();
					}
				}

				explosions.push(
					new Sprite({
						position: {
							x: projectile.position.x,
							y: projectile.position.y,
						},
						framesMax: 4,
						imageSrc: './assets/img/explosion.png',
					})
				);

				building.projectiles.splice(i, 1);
			}
		}
	});
}

canvas.addEventListener('click', () => {
	if (activeTile && !activeTile.occupied && coins - 50 >= 0) {
		coins -= 50;

		coinsBlock.innerHTML = coins.toString();

		buildings.push(
			new Building({
				position: {
					x: activeTile.position.x,
					y: activeTile.position.y,
				},
			})
		);
		activeTile.occupied = true;

		buildings.sort((a, b) => {
			return a.position.y - b.position.y;
		});
	}
});

window.addEventListener('mousemove', (e) => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;

	activeTile = null;

	for (let i = 0; i < placementTiles.length; i++) {
		const placementTile = placementTiles[i];

		if (
			mouse.x > placementTile.position.x &&
			mouse.x < placementTile.position.x + PlacementTile.size &&
			mouse.y > placementTile.position.y &&
			mouse.y < placementTile.position.y + PlacementTile.size
		) {
			activeTile = placementTile;
			break;
		}
	}
});
