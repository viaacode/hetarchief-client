import { CollapsableBladeProps } from '@ie-objects/components';
import { Icon, IconNamesLight } from '@shared/components';

export const collapsableBladeMock: CollapsableBladeProps = {
	icon: <Icon className="u-font-size-24" name={IconNamesLight.RelatedObjects} />,
	title: '3 gerelateerde objecten',
	isOpen: true,
	setIsOpen: () => {},
	renderContent: () => <div>content</div>,
};
