import { DefaultComponentProps } from '@shared/types';

export interface SpacePreviewProps extends DefaultComponentProps {
	spaceId?: string;
	spaceImage?: string;
	spaceLogo?: string;
	spaceName?: string;
	spaceColor?: string;
	spaceServiceDescription?: string;
}
