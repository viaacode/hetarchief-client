import { type ReactNode } from 'react';

import { type DefaultComponentProps } from '@shared/types';

import { type HetArchiefLogoType } from './HetArchiefLogo.const';

export interface HetArchiefLogoProps extends DefaultComponentProps {
	children?: ReactNode;
	type?: HetArchiefLogoType;
}
