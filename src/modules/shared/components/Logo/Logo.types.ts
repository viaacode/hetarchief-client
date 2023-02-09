import { DefaultComponentProps } from '@shared/types';

import { LogoType } from './Logo.const';

export interface LogoProps extends DefaultComponentProps {
	type?: LogoType;
}
