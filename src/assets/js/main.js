/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ts/classes/Building/Building.ts":
/*!*********************************************!*\
  !*** ./src/ts/classes/Building/Building.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const global_1 = __webpack_require__(/*! ../../global */ "./src/ts/global.ts");
const Projectile_1 = __importDefault(__webpack_require__(/*! ../Projectile/Projectile */ "./src/ts/classes/Projectile/Projectile.ts"));
const Sprite_1 = __importDefault(__webpack_require__(/*! ../Sprite/Sprite */ "./src/ts/classes/Sprite/Sprite.ts"));
class Building extends Sprite_1.default {
    constructor({ position }) {
        super({
            position,
            imageSrc: './assets/img/tower.png',
            framesMax: 19,
            offset: { x: 0, y: -80 },
        });
        this.width = 128;
        this.height = 64;
        this.projectiles = [];
        this.radius = 250;
        this.target = null;
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2,
        };
    }
    drawBlocks() {
        global_1.ctx.fillStyle = 'green';
        global_1.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        global_1.ctx.beginPath();
        global_1.ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
        global_1.ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
        global_1.ctx.fill();
        global_1.ctx.closePath();
    }
    update() {
        this.draw();
        if (this.target || (!this.target && this.frames.current !== 0))
            super.updateFrame();
        if (this.target &&
            this.frames.current === 6 &&
            this.frames.elapsed % this.frames.buffer === 0) {
            this.shoot();
        }
    }
    shoot() {
        this.projectiles.push(new Projectile_1.default({
            position: {
                x: this.center.x - 20,
                y: this.center.y - 110,
            },
            enemy: this.target,
        }));
    }
}
exports["default"] = Building;


/***/ }),

/***/ "./src/ts/classes/Enemy/Enemy.ts":
/*!***************************************!*\
  !*** ./src/ts/classes/Enemy/Enemy.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const global_1 = __webpack_require__(/*! ../../global */ "./src/ts/global.ts");
const Sprite_1 = __importDefault(__webpack_require__(/*! ../Sprite/Sprite */ "./src/ts/classes/Sprite/Sprite.ts"));
const waypoints_1 = __webpack_require__(/*! ../../data/waypoints */ "./src/ts/data/waypoints.ts");
class Enemy extends Sprite_1.default {
    constructor({ position }) {
        super({ position, imageSrc: './assets/img/orc.png', framesMax: 7 });
        this.waypointIndex = 0;
        this.center = {
            x: 0,
            y: 0,
        };
        this.radius = 50;
        this.health = 100;
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.speed = 2;
        this.position = position;
    }
    drawBlocks() {
        global_1.ctx.beginPath();
        global_1.ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
        global_1.ctx.fillStyle = 'red';
        global_1.ctx.fill();
        global_1.ctx.closePath();
    }
    drawHealthbar() {
        global_1.ctx.fillStyle = 'red';
        global_1.ctx.fillRect(this.position.x, this.position.y - 15, this.width, 10);
        global_1.ctx.fillStyle = 'green';
        global_1.ctx.fillRect(this.position.x, this.position.y - 15, this.width * (this.health / 100), 10);
    }
    update() {
        this.draw();
        this.drawHealthbar();
        super.updateFrame();
        const waypoint = waypoints_1.waypoints[this.waypointIndex];
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
        if (Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) <
            Math.abs(this.velocity.x) &&
            Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) <
                Math.abs(this.velocity.y) &&
            this.waypointIndex < waypoints_1.waypoints.length - 1) {
            this.waypointIndex++;
        }
    }
}
exports["default"] = Enemy;


/***/ }),

/***/ "./src/ts/classes/PlacementTile/PlacementTile.ts":
/*!*******************************************************!*\
  !*** ./src/ts/classes/PlacementTile/PlacementTile.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const global_1 = __webpack_require__(/*! ../../global */ "./src/ts/global.ts");
class PlacementTile {
    constructor({ position }) {
        this.color = 'rgba(255, 255, 255, 0.1)';
        this.occupied = false;
        this.position = position;
    }
    draw() {
        global_1.ctx.fillStyle = this.color;
        global_1.ctx.fillRect(this.position.x, this.position.y, PlacementTile.size, PlacementTile.size);
    }
    update(mouse) {
        this.draw();
        if (mouse.x &&
            mouse.y &&
            mouse.x > this.position.x &&
            mouse.x < this.position.x + PlacementTile.size &&
            mouse.y > this.position.y &&
            mouse.y < this.position.y + PlacementTile.size) {
            this.color = 'white';
        }
        else
            this.color = 'rgba(255, 255, 255, 0.1)';
    }
}
PlacementTile.size = 64;
exports["default"] = PlacementTile;


/***/ }),

/***/ "./src/ts/classes/Projectile/Projectile.ts":
/*!*************************************************!*\
  !*** ./src/ts/classes/Projectile/Projectile.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const global_1 = __webpack_require__(/*! ../../global */ "./src/ts/global.ts");
const Sprite_1 = __importDefault(__webpack_require__(/*! ../Sprite/Sprite */ "./src/ts/classes/Sprite/Sprite.ts"));
class Projectile extends Sprite_1.default {
    constructor({ position, enemy }) {
        super({ position, imageSrc: './assets/img/projectile.png' });
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.radius = 10;
        this.position = position;
        this.enemy = enemy;
    }
    drawBlocks() {
        global_1.ctx.beginPath();
        global_1.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        global_1.ctx.fillStyle = 'orange';
        global_1.ctx.fill();
        global_1.ctx.closePath();
    }
    update() {
        this.draw();
        const angle = Math.atan2(this.enemy.center.y - this.position.y, this.enemy.center.x - this.position.x);
        this.velocity.x = Math.cos(angle) * 4;
        this.velocity.y = Math.sin(angle) * 4;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
exports["default"] = Projectile;


/***/ }),

/***/ "./src/ts/classes/Sprite/Sprite.ts":
/*!*****************************************!*\
  !*** ./src/ts/classes/Sprite/Sprite.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const global_1 = __webpack_require__(/*! ../../global */ "./src/ts/global.ts");
class Sprite {
    constructor({ position, imageSrc, framesMax = 1, offset = { x: 0, y: 0 }, }) {
        this.frames = {
            max: 1,
            current: 0,
            elapsed: 0,
            buffer: 3,
        };
        this.image = new Image();
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
        if (!this.image.complete)
            return;
        const cropBox = {
            position: {
                x: this.width * this.frames.current,
                y: 0,
            },
            width: this.width,
            height: this.height,
        };
        global_1.ctx.drawImage(this.image, cropBox.position.x, cropBox.position.y, cropBox.width, cropBox.height, this.position.x + this.offset.x, this.position.y + this.offset.y, this.width, this.height);
    }
    updateFrame() {
        if (this.frames.max < 2)
            return;
        this.frames.elapsed++;
        if (this.frames.elapsed % this.frames.buffer === 0) {
            if (this.frames.current < this.frames.max - 1) {
                this.frames.current++;
            }
            else
                this.frames.current = 0;
        }
    }
}
exports["default"] = Sprite;


/***/ }),

/***/ "./src/ts/classes/index.ts":
/*!*********************************!*\
  !*** ./src/ts/classes/index.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Sprite = exports.Building = exports.PlacementTile = exports.Enemy = void 0;
var Enemy_1 = __webpack_require__(/*! ./Enemy/Enemy */ "./src/ts/classes/Enemy/Enemy.ts");
Object.defineProperty(exports, "Enemy", ({ enumerable: true, get: function () { return __importDefault(Enemy_1).default; } }));
var PlacementTile_1 = __webpack_require__(/*! ./PlacementTile/PlacementTile */ "./src/ts/classes/PlacementTile/PlacementTile.ts");
Object.defineProperty(exports, "PlacementTile", ({ enumerable: true, get: function () { return __importDefault(PlacementTile_1).default; } }));
var Building_1 = __webpack_require__(/*! ./Building/Building */ "./src/ts/classes/Building/Building.ts");
Object.defineProperty(exports, "Building", ({ enumerable: true, get: function () { return __importDefault(Building_1).default; } }));
var Sprite_1 = __webpack_require__(/*! ./Sprite/Sprite */ "./src/ts/classes/Sprite/Sprite.ts");
Object.defineProperty(exports, "Sprite", ({ enumerable: true, get: function () { return __importDefault(Sprite_1).default; } }));


/***/ }),

/***/ "./src/ts/data/placementTilesData.ts":
/*!*******************************************!*\
  !*** ./src/ts/data/placementTilesData.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.placementTilesData = void 0;
exports.placementTilesData = [
    0, 14, 0, 14, 0, 14, 0, 14, 0, 14, 0, 14, 0, 14, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0,
    0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 14, 0, 14, 0,
    0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0,
    0, 14, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 14, 0, 0, 0,
    14, 0, 14, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 14, 0, 14, 0, 14, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 14, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];


/***/ }),

/***/ "./src/ts/data/waypoints.ts":
/*!**********************************!*\
  !*** ./src/ts/data/waypoints.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.waypoints = void 0;
exports.waypoints = [
    {
        x: -124.21331566744,
        y: 475.322954620735,
    },
    {
        x: 276.581649552832,
        y: 472.01059953627,
    },
    {
        x: 276.581649552832,
        y: 157.33686651209,
    },
    {
        x: 735.342828751242,
        y: 158.993044054323,
    },
    {
        x: 735.342828751242,
        y: 405.763497846969,
    },
    {
        x: 606.160980457105,
        y: 407.419675389202,
    },
    {
        x: 606.160980457105,
        y: 669.095727061941,
    },
    {
        x: 1046.70420669096,
        y: 665.783371977476,
    },
    {
        x: 1050.01656177542,
        y: 288.17489234846,
    },
    {
        x: 1407.75091089765,
        y: 286.518714806227,
    },
];


/***/ }),

/***/ "./src/ts/global.ts":
/*!**************************!*\
  !*** ./src/ts/global.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.coinsBlock = exports.heartsBlock = exports.gameOverBlock = exports.ctx = exports.canvas = void 0;
exports.canvas = document.querySelector('canvas');
exports.ctx = exports.canvas.getContext('2d');
exports.gameOverBlock = document.querySelector('#gameOver');
exports.heartsBlock = document.querySelector('#hearts');
exports.coinsBlock = document.querySelector('#coins');


/***/ }),

/***/ "./src/ts/index.ts":
/*!*************************!*\
  !*** ./src/ts/index.ts ***!
  \*************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const global_1 = __webpack_require__(/*! ./global */ "./src/ts/global.ts");
const classes_1 = __webpack_require__(/*! ./classes */ "./src/ts/classes/index.ts");
const waypoints_1 = __webpack_require__(/*! ./data/waypoints */ "./src/ts/data/waypoints.ts");
const placementTilesData_1 = __webpack_require__(/*! ./data/placementTilesData */ "./src/ts/data/placementTilesData.ts");
const transformPlacementDataTo2D_1 = __importDefault(__webpack_require__(/*! ./utils/transformPlacementDataTo2D */ "./src/ts/utils/transformPlacementDataTo2D.ts"));
global_1.canvas.width = 1280;
global_1.canvas.height = 768;
const mouse = {
    x: undefined,
    y: undefined,
};
const placementTilesData2D = (0, transformPlacementDataTo2D_1.default)(placementTilesData_1.placementTilesData);
const placementTiles = [];
let activeTile = null;
placementTilesData2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 14) {
            placementTiles.push(new classes_1.PlacementTile({
                position: {
                    x: x * classes_1.PlacementTile.size,
                    y: y * classes_1.PlacementTile.size,
                },
            }));
        }
    });
});
const enemies = [];
let enemyCount = 3;
function spawnEnemies(spawnCount) {
    for (let i = 1; i < spawnCount + 1; i++) {
        const xOffset = i * 150;
        enemies.push(new classes_1.Enemy({
            position: {
                x: waypoints_1.waypoints[0].x - xOffset,
                y: waypoints_1.waypoints[0].y,
            },
        }));
    }
}
spawnEnemies(enemyCount);
const buildings = [];
const image = new Image();
image.src = './assets/img/gameMap.png';
image.onload = () => {
    animate();
};
let hearts = 10;
let coins = 100;
const explosions = [];
let animationId;
global_1.coinsBlock.innerHTML = coins.toString();
function animate() {
    animationId = requestAnimationFrame(animate);
    global_1.ctx.drawImage(image, 0, 0, global_1.canvas.width, global_1.canvas.height);
    global_1.heartsBlock.innerHTML = hearts.toString();
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.update();
        if (enemy.position.x > global_1.canvas.width) {
            hearts -= 1;
            enemies.splice(i, 1);
            if (hearts === 0) {
                cancelAnimationFrame(animationId);
                global_1.heartsBlock.innerHTML = hearts.toString();
                global_1.gameOverBlock.style.display = 'flex';
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
                        global_1.coinsBlock.innerHTML = coins.toString();
                    }
                }
                explosions.push(new classes_1.Sprite({
                    position: {
                        x: projectile.position.x,
                        y: projectile.position.y,
                    },
                    framesMax: 4,
                    imageSrc: './assets/img/explosion.png',
                }));
                building.projectiles.splice(i, 1);
            }
        }
    });
}
global_1.canvas.addEventListener('click', () => {
    if (activeTile && !activeTile.occupied && coins - 50 >= 0) {
        coins -= 50;
        global_1.coinsBlock.innerHTML = coins.toString();
        buildings.push(new classes_1.Building({
            position: {
                x: activeTile.position.x,
                y: activeTile.position.y,
            },
        }));
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
        if (mouse.x > placementTile.position.x &&
            mouse.x < placementTile.position.x + classes_1.PlacementTile.size &&
            mouse.y > placementTile.position.y &&
            mouse.y < placementTile.position.y + classes_1.PlacementTile.size) {
            activeTile = placementTile;
            break;
        }
    }
});


/***/ }),

/***/ "./src/ts/utils/transformPlacementDataTo2D.ts":
/*!****************************************************!*\
  !*** ./src/ts/utils/transformPlacementDataTo2D.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function transformPlacementDataTo2D(data) {
    const arr = [];
    for (let i = 0; i < data.length; i += 20) {
        arr.push(data.slice(i, i + 20));
    }
    return arr;
}
exports["default"] = transformPlacementDataTo2D;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/ts/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map