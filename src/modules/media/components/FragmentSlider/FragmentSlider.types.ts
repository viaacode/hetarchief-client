import { MediaRepresentation } from '@media/types';
import { DefaultComponentProps } from '@shared/types';

export interface FragmentSliderProps extends DefaultComponentProps {
	thumbnail?: string;
	fragments: MediaRepresentation[];
	onChangeFragment?: (index: number) => void;
}
