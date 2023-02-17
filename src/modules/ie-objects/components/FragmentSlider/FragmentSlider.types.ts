import { DefaultComponentProps } from '@shared/types';

import { IeObjectRepresentation } from 'modules/ie-objects/types';

export interface FragmentSliderProps extends DefaultComponentProps {
	thumbnail?: string;
	fragments: IeObjectRepresentation[];
	onChangeFragment?: (index: number) => void;
}
