import { IPosition } from '../../interfaces/IPosition';

export interface ISpriteConstructor {
	position: IPosition;
	imageSrc: string;
	framesMax?: number;
	offset?: IPosition;
}
