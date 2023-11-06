import { DefaultComponentProps } from '@shared/types';

import { HetArchiefLogoType } from './HetArchiefLogo.const';

export interface HetArchiefLogoProps extends DefaultComponentProps {
	children?: React.ReactNode;
	type?: HetArchiefLogoType;
}
