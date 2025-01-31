import type { ButtonAction, ButtonType } from '@viaa/avo2-components';
import type { IconNameSchema } from '@viaa/avo2-components/dist/components/Icon/Icon.types';
import type { Avo } from '@viaa/avo2-types';
import type { ContentPickerTypeSchema } from '@viaa/avo2-types/types/core';

export type BlockContentEncloseProps = {
	title: string;
	titleType: 'h1' | 'h2' | 'h3' | 'h4';
	description: string;
	buttonLabel: string;
	buttonAction: ButtonAction;
	buttonType: ButtonType;
	buttonIcon: IconNameSchema;
	buttonAltTitle: string;
	elements: {
		mediaItem: Avo.Core.PickerItem;
	}[];
};

export type MappedElement = {
	value: string;
	type: ContentPickerTypeSchema;
};
