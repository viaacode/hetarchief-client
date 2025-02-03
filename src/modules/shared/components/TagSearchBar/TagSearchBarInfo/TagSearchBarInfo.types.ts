import type { ReactNode } from 'react';

import type { IconName } from '@shared/components/Icon';
import type { DefaultComponentProps } from '@shared/types';

export interface TagSearchBarInfoProps extends DefaultComponentProps {
	children?: ReactNode;
	icon: IconName;
	content: string | ReactNode;
}
