import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';
import { VisitorSpaceInfo } from '@visitor-space/types';

export interface SpacePreviewProps extends DefaultComponentProps {
	children?: ReactNode;
	visitorSpace: SpacePreviewSpace;
}

export type SpacePreviewSpace = Pick<
	VisitorSpaceInfo,
	'id' | 'image' | 'logo' | 'name' | 'color' | 'serviceDescriptionNl' | 'serviceDescriptionEn'
>;
