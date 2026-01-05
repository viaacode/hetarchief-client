import type { ButtonAction, ButtonType, IconName } from '@viaa/avo2-components';
import type { AvoCoreContentPickerType, AvoCorePickerItem } from '@viaa/avo2-types';

export type BlockContentEncloseProps = {
	title: string;
	titleType: 'h1' | 'h2' | 'h3' | 'h4';
	description: string;
	buttonLabel: string;
	buttonAction: ButtonAction;
	buttonType: ButtonType;
	buttonIcon: IconName;
	buttonAltTitle: string;
	elements: {
		mediaItem: AvoCorePickerItem;
	}[];
};

export type MappedElement = {
	value: string;
	type: AvoCoreContentPickerType;
};
