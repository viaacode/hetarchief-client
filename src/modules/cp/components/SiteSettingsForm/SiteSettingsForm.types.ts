import { DefaultComponentProps } from '@shared/types';
import { VisitorSpaceInfo } from '@visitor-space/types';

export interface SiteSettingsFormProps extends DefaultComponentProps {
	room: Pick<VisitorSpaceInfo, 'color' | 'image' | 'logo' | 'id' | 'name' | 'slug'>;
	renderCancelSaveButtons: (onCancel: () => void, onSave: () => void) => void;
	onSubmit?: (values: SiteSettingsFormState, afterSubmit?: () => void) => void;
	onUpdate?: (values: SiteSettingsFormState) => void;
	disableDropdown?: boolean;
}

export interface SiteSettingsFormState {
	orId?: string;
	slug?: string;
}
