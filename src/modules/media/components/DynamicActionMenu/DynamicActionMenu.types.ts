import { MediaActions } from '@media/types';
import { IconLightNames } from '@shared/components';
import { DefaultComponentProps } from '@shared/types';

export interface DynamicActionMenuProps extends DefaultComponentProps {
	actions: ActionItem[];
	limit?: number;
	onClickAction: (id: MediaActions) => void;
}

export interface ActionItem {
	label: string;
	iconName: IconLightNames;
	id: MediaActions;
	ariaLabel: string;
	tooltip?: string;
}
