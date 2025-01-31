import type { ReactNode } from 'react';

import type { DefaultComponentProps } from '@shared/types';
import type { VisitorSpaceInfo } from '@visitor-space/types';

export interface SpacePreviewProps extends DefaultComponentProps {
	children?: ReactNode;
	visitorSpace: SpacePreviewSpace;
}

export type SpacePreviewSpace = Pick<
	VisitorSpaceInfo,
	'id' | 'image' | 'logo' | 'name' | 'color' | 'serviceDescriptionNl' | 'serviceDescriptionEn'
>;
