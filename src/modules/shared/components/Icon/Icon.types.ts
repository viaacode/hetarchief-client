import { DetailedHTMLProps, HTMLAttributes } from 'react';

import { DefaultComponentProps } from '@shared/types';

import { IconNamesLight, IconNamesSolid } from './Icon.const';

export type IconProps = DefaultComponentProps &
	IconTypes &
	DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

export type IconTypes = { name: IconName };

export type IconName = IconNamesLight | IconNamesSolid;
