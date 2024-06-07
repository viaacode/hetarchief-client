import { UseFormTrigger } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types/fields';

export interface VisitorSpaceSettingsProps {
	visitorSpaceSlug: string | null;
	action: 'edit' | 'create';
}

export type ValidationRef<T extends FieldValues> = { validate: UseFormTrigger<T> } | undefined;
