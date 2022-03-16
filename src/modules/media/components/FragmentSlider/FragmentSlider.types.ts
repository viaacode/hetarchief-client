import { MediaRepresentation } from '@media/types';
import { DefaultComponentProps } from '@shared/types';

export interface FragmentSliderProps extends DefaultComponentProps {
	fragments: MediaRepresentation[];
	onChangeFragment?: (index: number) => void;
}
