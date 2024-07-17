import { type ReactNode } from 'react';

import { type IeObjectLicense } from '@ie-objects/ie-objects.types';
import { type IeObjectType } from '@shared/types';

import { type IconName } from '../Icon';

export type MediaCardViewMode = 'list' | 'grid';

export interface MediaCardProps {
	children?: ReactNode;
	actions?: ReactNode;
	buttons?: ReactNode;
	description?: ReactNode;
	duration?: string;
	keywords?: string[];
	name?: string;
	id?: string;
	objectId?: string;
	preview?: string;
	publishedOrCreatedDate?: Date;
	publishedBy?: string;
	title?: string | ReactNode;
	type: IeObjectType | null;
	view?: MediaCardViewMode;
	hasRelated?: boolean;
	icon?: IconName;
	showKeyUserLabel?: boolean;
	showLocallyAvailable?: boolean;
	showPlanVisitButtons?: boolean;
	link: string | undefined;
	maintainerSlug?: string;
	hasTempAccess?: boolean;
	previousPage?: string;
}

export type IdentifiableMediaCard = MediaCardProps & {
	schemaIdentifier: string;
	maintainerSlug: string;
	licenses?: IeObjectLicense[];
};
