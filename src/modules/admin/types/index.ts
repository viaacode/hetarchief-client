import { VisitorSpaceInfo } from '@reading-room/types';

export type AdminReadingRoomInfoRow = { row: { original: VisitorSpaceInfo } };

export interface TranslationsOverviewRef {
	onSave: () => void;
}
