import { VisitorSpaceInfo } from '@reading-room/types';
import { DefaultComponentProps } from '@shared/types';

export interface SiteSettingsFormProps extends DefaultComponentProps {
	room: Pick<VisitorSpaceInfo, 'color' | 'image' | 'logo' | 'id' | 'name' | 'slug'>;
	renderCancelSaveButtons: (onCancel: () => void, onSave: () => void) => void;
	onSubmit?: (values: SiteSettingsFormState, afterSubmit?: () => void) => void;
	onUpdate?: (values: SiteSettingsFormState) => void;
	disableDropdown?: boolean;
}

export interface SiteSettingsFormState {
	name?: string;
	slug?: string;
}
