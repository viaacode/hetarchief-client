import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface RelatedObjectsBladeProps extends DefaultComponentProps {
	icon?: ReactNode;
	title: string;
	renderContent: (hidden: boolean) => ReactNode;
}
