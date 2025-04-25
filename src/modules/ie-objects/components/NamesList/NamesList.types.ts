import type { Mention, MentionHighlight } from '@ie-objects/ie-objects.types';
import type { DefaultComponentProps } from '@shared/types';

export interface NamesListProps extends DefaultComponentProps {
	mentions: Mention[];
	onZoomToHighlight: (mention: Mention, highlight: MentionHighlight) => void;
}
