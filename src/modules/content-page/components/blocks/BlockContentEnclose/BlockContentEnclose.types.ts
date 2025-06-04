import type { ButtonAction, ButtonType, IconName } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import type { ContentPickerTypeSchema } from '@viaa/avo2-types/types/core';

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
		mediaItem: Avo.Core.PickerItem;
	}[];
};

export type MappedElement = {
	value: string;
	type: ContentPickerTypeSchema;
};
