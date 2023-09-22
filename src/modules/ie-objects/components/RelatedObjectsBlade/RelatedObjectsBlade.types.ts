import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface RelatedObjectsBladeProps extends DefaultComponentProps {
	children?: React.ReactNode;
	icon?: ReactNode;
	title: string | ReactNode;
	renderContent: (hidden: boolean) => ReactNode;
}
