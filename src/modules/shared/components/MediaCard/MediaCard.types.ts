import { ReactNode } from 'react';

import { IeObjectLicense } from '@ie-objects/types';
import { IeObjectTypes } from '@shared/types';

import { IconName } from '../Icon';

export type MediaCardViewMode = 'list' | 'grid';

export interface MediaCardProps {
	actions?: ReactNode;
	buttons?: ReactNode;
	description?: ReactNode;
	duration?: string;
	keywords?: string[];
	name?: string;
	id?: string;
	preview?: string;
	publishedAt?: Date;
	publishedBy?: string;
	title?: string | ReactNode;
	type: IeObjectTypes;
	view?: MediaCardViewMode;
	hasRelated?: boolean;
	icon?: IconName;
	isKeyUser?: boolean;
	meemooIdentifier?: string;
	showLocallyAvailable?: boolean;
	link?: string;
	maintainerSlug?: string;
	hasTempAccess?: boolean;
}

export type IdentifiableMediaCard = MediaCardProps & {
	schemaIdentifier: string;
	maintainerSlug: string;
	licenses?: IeObjectLicense[];
};
