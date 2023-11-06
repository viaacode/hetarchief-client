import { UseFormTrigger } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types/fields';

import { DefaultComponentProps } from '@shared/types';
import { VisitorSpaceInfo } from '@visitor-space/types';

export interface VisitorSpaceSettingsProps extends DefaultComponentProps {
	children?: React.ReactNode;
	room: Pick<
		VisitorSpaceInfo,
		'id' | 'color' | 'image' | 'description' | 'serviceDescription' | 'logo' | 'name' | 'slug'
	>;
	refetch?: () => void;
	action?: 'edit' | 'create';
}

export type ValidationRef<T extends FieldValues> = { validate: UseFormTrigger<T> } | undefined;
