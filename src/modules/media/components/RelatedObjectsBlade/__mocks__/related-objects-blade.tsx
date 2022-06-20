import { Icon } from '@shared/components';

import { RelatedObjectsBladeProps } from '../RelatedObjectsBlade.types';

export const relatedObjectsBladeMock: RelatedObjectsBladeProps = {
	icon: <Icon className="u-font-size-24" name="related-objects" />,
	title: '3 gerelateerde objecten',
	renderContent: () => <div>content</div>,
};
