import { UserSchema } from '@auth/store/user';
import { ComponentLink } from '@shared/types';

import { ReadingRoom } from '../ReadingRoomCard';

export interface HeroProps {
	title: string;
	description: string;
	link: ComponentLink;
	image: HeroImage;
	user?: UserSchema;
	requests?: HeroRequest[];
}

export interface HeroImage {
	src: string;
	alt?: string;
}

export interface HeroRequest extends ReadingRoom {
	status: 'access' | 'planned' | 'requested';
}
