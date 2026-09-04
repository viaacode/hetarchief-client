import type { IeObjectsSearchTermObject } from '@shared/types/api';
import type { IeObjectType } from '@shared/types/ie-objects';
import type { HetArchiefIeObjectLicense } from '@viaa/avo2-types';
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
	/**
	 * Whether the current user may see/play this object's essence, as reported by the proxy.
	 * Decides between the real image and the struck-through placeholder. Defaults to true so
	 * cards for things that aren't ie-objects keep rendering their image.
	 */
	hasAccessToEssence?: boolean;
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
	className?: string;
}

export type IdentifiableMediaCard = MediaCardProps & {
	schemaIdentifier: string;
	maintainerSlug: string;
	licenses?: HetArchiefIeObjectLicense[];
};
