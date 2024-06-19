import { type CollapsableBladeProps } from '@ie-objects/components/CollapsableBlade';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';

export const collapsableBladeMock: CollapsableBladeProps = {
	icon: <Icon className="u-font-size-24" name={IconNamesLight.RelatedObjects} />,
	title: '3 gerelateerde objecten',
	isOpen: true,
	setIsOpen: () => {},
	renderContent: () => <div>content</div>,
};
