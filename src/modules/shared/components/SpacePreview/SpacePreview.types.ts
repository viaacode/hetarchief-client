import type { DefaultComponentProps } from '@shared/types';
import type { VisitorSpaceInfo } from '@visitor-space/types';
import type { ReactNode } from 'react';

export interface SpacePreviewHeaderProps extends DefaultComponentProps {
	children?: ReactNode;
	visitorSpace: SpacePreviewSpace;
}

export interface SpacePreviewProps extends SpacePreviewHeaderProps {
	showLogoAndName?: boolean;
}

export type SpacePreviewSpace = Pick<
	VisitorSpaceInfo,
	'id' | 'image' | 'logo' | 'name' | 'color' | 'serviceDescriptionNl' | 'serviceDescriptionEn'
>;
