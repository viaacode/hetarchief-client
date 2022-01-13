import { DefaultComponentProps } from '@shared/types';

import { IconLightNames, IconTypes } from '../Icon';

export type PlaceholderProps = DefaultComponentProps &
	PlaceholderCommonProps &
	PlaceholderVisualProps;

export type PlaceholderIcon = IconLightNames | IconTypes;

interface PlaceholderCommonProps {
	description: string;
	title: string;
}

type PlaceholderVisualProps =
	| { icon?: never; img?: string; imgAlt?: string }
	| {
			icon?: PlaceholderIcon;
			img?: never;
			imgAlt?: never;
	  };
