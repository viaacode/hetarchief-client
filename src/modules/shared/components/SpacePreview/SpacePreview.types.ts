import { DefaultComponentProps } from '@shared/types';
import { VisitorSpaceInfo } from '@visitor-space/types';

export interface SpacePreviewProps extends DefaultComponentProps {
	children?: React.ReactNode;
	space: SpacePreviewSpace;
}

export type SpacePreviewSpace = Pick<
	VisitorSpaceInfo,
	'id' | 'image' | 'logo' | 'name' | 'color' | 'serviceDescription'
>;
