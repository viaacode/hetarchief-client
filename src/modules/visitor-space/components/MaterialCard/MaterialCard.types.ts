import type { IconName } from '@shared/components/Icon';
import type { IeObjectType } from '@shared/types/ie-objects';
import type { ReactNode } from 'react';

export interface MaterialCardProps {
	className?: string;
	objectSchemaIdentifier?: string;
	title?: string | ReactNode;
	thumbnail?: string;
	/**
	 * Whether the current user may see/play this object's essence, as reported by the proxy.
	 * Defaults to true so cards for things that aren't ie-objects keep rendering their image.
	 */
	hasAccessToEssence?: boolean;
	hideThumbnail?: boolean;
	link: string;
	type: IeObjectType | null;
	publishedBy?: string;
	publishedOrCreatedDate?: string;
	icon: IconName | null;
	withBorder?: boolean;
	orientation: 'horizontal' | 'vertical';
	children?: ReactNode;
	renderAdditionalCaption?: (caption: string) => ReactNode;
	openInNewTab?: boolean;
}
