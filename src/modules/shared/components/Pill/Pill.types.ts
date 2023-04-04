import { DefaultComponentProps } from '@shared/types';

import { IconName } from '..';

export interface PillProps extends DefaultComponentProps {
	icon: IconName;
	label: string;
	isExpanded?: boolean;
}
