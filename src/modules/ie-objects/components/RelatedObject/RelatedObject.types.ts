import { ReactNode } from 'react';

import { DefaultComponentProps, IeObjectTypes } from '@shared/types';

export interface MediaObject {
	type: IeObjectTypes;
	title: string;
	subtitle: string;
	description: string;
	thumbnail?: string | ReactNode;
	id: string;
	maintainer_id?: string;
}

export interface RelatedObjectProps extends DefaultComponentProps {
	object: MediaObject;
}
