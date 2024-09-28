import { IPosition } from '../../interfaces/IPosition';

import Enemy from '../Enemy/Enemy';

export interface IProjectileConstructor {
	position: IPosition;
	enemy: Enemy;
}
