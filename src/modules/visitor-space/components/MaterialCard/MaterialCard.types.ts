import type { IconName } from '@shared/components/Icon';
import type { IeObjectType } from '@shared/types/ie-objects';
import type { ReactNode } from 'react';

export interface MaterialCardProps {
	className?: string;
	objectId?: string;
	title?: string | ReactNode;
	thumbnail?: string;
	link: string;
	type: IeObjectType | null;
	publishedBy?: string;
	publishedOrCreatedDate?: string;
	icon?: IconName;
}
