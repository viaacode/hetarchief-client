import type { DefaultComponentProps } from '@shared/types';
import type { IeObjectType } from '@shared/types/ie-objects';
import type { ReactNode } from 'react';

export interface MediaObject {
	type: IeObjectType | null;
	title: string;
	subtitle: string;
	description: string;
	thumbnail?: string | ReactNode;
	/**
	 * Whether the current user may see/play this object's essence, as reported by the proxy.
	 * Defaults to false so an omitted value never opens up a thumbnail by accident.
	 */
	hasAccessToEssence?: boolean;
	id: string;
	maintainer_id?: string;
}

export interface RelatedObjectProps extends DefaultComponentProps {
	children?: ReactNode;
	object: MediaObject;
}
