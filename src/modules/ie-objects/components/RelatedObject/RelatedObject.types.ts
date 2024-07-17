import { type ReactNode } from 'react';

import { type DefaultComponentProps, type IeObjectType } from '@shared/types';

export interface MediaObject {
	type: IeObjectType | null;
	title: string;
	subtitle: string;
	description: string;
	thumbnail?: string | ReactNode;
	id: string;
	maintainer_id?: string;
}

export interface RelatedObjectProps extends DefaultComponentProps {
	children?: ReactNode;
	object: MediaObject;
}
