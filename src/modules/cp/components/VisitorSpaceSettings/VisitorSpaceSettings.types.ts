import type { CreateVisitorSpaceSettings } from '@visitor-space/services/visitor-space/visitor-space.service.types';

export interface VisitorSpaceSettingsProps {
	visitorSpaceSlug: string | null;
	action: 'edit' | 'create';
}

export type VisitorSpaceSettingsFormValues = Partial<
	CreateVisitorSpaceSettings & {
		id: string | null;
		name: string;
		logo: string | null;
	}
>;
