import { FC } from 'react';

import { DefaultFilterFormProps } from '@reading-room/types';
import { DefaultComponentProps } from '@shared/types';

export interface FilterFormProps extends DefaultComponentProps {
	form: FC<DefaultFilterFormProps> | null;
	id: string;
	title: string;
}
