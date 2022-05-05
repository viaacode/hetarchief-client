import { VisitorSpaceInfo } from '@reading-room/types';
import { DefaultComponentProps } from '@shared/types';

export interface SpacePreviewProps extends DefaultComponentProps {
	space: SpacePreviewSpace;
}

export type SpacePreviewSpace = Pick<
	VisitorSpaceInfo,
	'id' | 'image' | 'logo' | 'name' | 'color' | 'serviceDescription'
>;
