import { ReactNode } from 'react';

import { IconName } from '@shared/components/Icon';
import { DefaultComponentProps } from '@shared/types';

export interface TagSearchBarInfoProps extends DefaultComponentProps {
	children?: React.ReactNode;
	icon: IconName;
	content: string | ReactNode;
}
