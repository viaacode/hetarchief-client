import type { IeObjectLicense } from '@ie-objects/ie-objects.types';
import type { IeObjectsSearchTermObject } from '@shared/types/api';
import type { IeObjectType } from '@shared/types/ie-objects';
import type { ReactNode } from 'react';

import type { IconName } from '../Icon';

export type MediaCardViewMode = 'list' | 'grid' | 'blade';

export interface MediaCardProps {
	children?: ReactNode;
	actions?: ReactNode;
	buttons?: ReactNode;
	description?: ReactNode;
	duration?: string;
	keywords?: IeObjectsSearchTermObject[];
	name?: string;
	id?: string;
	objectId?: string;
	thumbnail?: string;
	publishedOrCreatedDate?: string;
	publishedBy?: string;
	title?: string | ReactNode;
	type: IeObjectType | null;
	view?: MediaCardViewMode;
	hasRelated?: boolean;
	icon: IconName | null;
	showKeyUserLabel?: boolean;
	showLocallyAvailable?: boolean;
	showPlanVisitButtons?: boolean;
	link: string | undefined;
	maintainerSlug?: string;
	hasTempAccess?: boolean;
	previousPage?: string;
	numOfChildren?: number;
	isPartOfOtherItem?: boolean;
	className?: string;
}

export type IdentifiableMediaCard = MediaCardProps & {
	schemaIdentifier: string;
	maintainerSlug: string;
	licenses?: IeObjectLicense[];
};
