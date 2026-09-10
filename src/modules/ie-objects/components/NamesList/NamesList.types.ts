import type { DefaultComponentProps } from '@shared/types';
import type { HetArchiefMention } from '@viaa/avo2-types';

export interface NamesListProps extends DefaultComponentProps {
	mentions: HetArchiefMention[];
	onZoomToMention: (mention: HetArchiefMention) => void;
}

export const ROW_HEIGHT = 82;
