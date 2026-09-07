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
	 * Defaults to false so an omitted prop never opens up a thumbnail by accident; callers
	 * rendering something that isn't essence-gated have to say so explicitly.
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
