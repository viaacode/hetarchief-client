import { DefaultComponentProps } from '@shared/types';

import { ICON_LIGHT, ICON_SOLID } from './Icon.const';

export type IconProps = DefaultComponentProps & IconTypes;

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
