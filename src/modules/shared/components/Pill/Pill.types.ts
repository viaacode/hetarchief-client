import { DefaultComponentProps } from '@shared/types';

import { IconName } from '..';

export interface PillProps extends DefaultComponentProps {
	children?: React.ReactNode;
	icon: IconName;
	label: string;
	isExpanded?: boolean;
}
