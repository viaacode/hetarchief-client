import { DetailedHTMLProps, HTMLAttributes } from 'react';

import { DefaultComponentProps } from '@shared/types';

import { ICON_LIGHT, ICON_SOLID } from './Icon.const';

export type IconProps = DefaultComponentProps &
	IconTypes &
	DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

export type IconTypes =
	| {
			name: IconLightNames;
			type?: 'light';
	  }
	| {
			name: IconSolidNames;
			type?: 'solid';
	  };

export type IconLightNames = typeof ICON_LIGHT[number];

export type IconSolidNames = typeof ICON_SOLID[number];

export type IconName = IconLightNames & IconSolidNames;
