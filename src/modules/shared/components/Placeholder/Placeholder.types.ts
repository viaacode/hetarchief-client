import type { ReactNode } from 'react';

import type { DefaultComponentProps } from '@shared/types';

import type { IconName, IconTypes } from '../Icon';

export type PlaceholderProps = DefaultComponentProps &
	PlaceholderCommonProps &
	PlaceholderVisualProps;

export type PlaceholderIcon = IconName | IconTypes;

interface PlaceholderCommonProps {
	description: string | ReactNode;
	title: string | ReactNode;
}

type PlaceholderVisualProps =
	| { icon?: never; img?: string; imgAlt?: string }
	| {
			icon?: PlaceholderIcon;
			img?: never;
			imgAlt?: never;
	  };
