import { UseFormTrigger } from 'react-hook-form';

import { DefaultComponentProps } from '@shared/types';
import { VisitorSpaceInfo } from '@visitor-space/types';

export interface VisitorSpaceSettingsProps extends DefaultComponentProps {
	room: Pick<
		VisitorSpaceInfo,
		'id' | 'color' | 'image' | 'description' | 'serviceDescription' | 'logo' | 'name' | 'slug'
	>;
	refetch?: () => void;
	action?: 'edit' | 'create';
}

export type ValidationRef<T> = { validate: UseFormTrigger<T> } | undefined;
