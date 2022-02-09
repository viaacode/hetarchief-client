import { IconLightNames } from '@shared/components';
import { DefaultComponentProps } from '@shared/types';

export interface DynamicActionMenuProps extends DefaultComponentProps {
	actions: ActionItem[];
	limit?: number;
	onClickAction: (id: string) => void;
}

export interface ActionItem {
	label: string;
	iconName: IconLightNames;
	id: string;
}
