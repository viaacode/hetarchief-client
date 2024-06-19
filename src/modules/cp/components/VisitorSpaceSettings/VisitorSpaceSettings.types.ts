import { type UseFormTrigger } from 'react-hook-form';
import { type FieldValues } from 'react-hook-form/dist/types/fields';

import { type CreateVisitorSpaceSettings } from '@visitor-space/services/visitor-space/visitor-space.service.types';

export interface VisitorSpaceSettingsProps {
	visitorSpaceSlug: string | null;
	action: 'edit' | 'create';
}

export type ValidationRef<T extends FieldValues> = { validate: UseFormTrigger<T> } | undefined;

export type VisitorSpaceSettingsFormValues = Partial<
	CreateVisitorSpaceSettings & {
		id: string | null;
		name: string;
		logo: string | null;
	}
>;
