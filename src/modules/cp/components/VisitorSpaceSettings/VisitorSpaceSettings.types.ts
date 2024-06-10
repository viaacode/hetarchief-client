import { UseFormTrigger } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types/fields';

import { CreateVisitorSpaceSettings } from '@visitor-space/services/visitor-space/visitor-space.service.types';

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
