import { IeObjectRepresentation } from '@ie-objects/types';
import { DefaultComponentProps } from '@shared/types';

export interface FragmentSliderProps extends DefaultComponentProps {
	thumbnail?: string;
	fragments: IeObjectRepresentation[];
	onChangeFragment?: (index: number) => void;
}
