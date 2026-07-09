import type { IconNamesLight, IconNamesSolid } from '@shared/components/Icon/Icon.enums';
import type { DefaultComponentProps } from '@shared/types';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

export type IconProps = DefaultComponentProps &
	IconTypes &
	DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

export type IconTypes = { name: IconName };

export type IconName = IconNamesLight | IconNamesSolid;
