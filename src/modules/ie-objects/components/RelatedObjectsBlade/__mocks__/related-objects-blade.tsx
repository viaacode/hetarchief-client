import { Icon, IconNamesLight } from '@shared/components';

import { RelatedObjectsBladeProps } from '../RelatedObjectsBlade.types';

export const relatedObjectsBladeMock: RelatedObjectsBladeProps = {
	icon: <Icon className="u-font-size-24" name={IconNamesLight.RelatedObjects} />,
	title: '3 gerelateerde objecten',
	renderContent: () => <div>content</div>,
};
