import { MediaActions } from '@ie-objects/ie-objects.types';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';

import type { DynamicActionMenuProps } from '../DynamicActionMenu.types';

export const dynamicActionMenuMock: DynamicActionMenuProps = {
	actions: [
		{
			label: 'Toevoegen aan aanvraaglijst',
			icon: <Icon name={IconNamesLight.Request} aria-hidden />,
			id: MediaActions.RequestMaterial,
			ariaLabel: 'Toevoegen aan aanvraaglijst',
			isPrimary: true,
		},
		{
			label: 'Sla dit item op',
			icon: <Icon name={IconNamesLight.Bookmark} aria-hidden />,
			id: MediaActions.Bookmark,
			ariaLabel: 'Sla dit item op',
			tooltip: 'Sla dit item op',
		},
		{
			label: 'Meld een probleem',
			icon: <Icon name={IconNamesLight.Flag} aria-hidden />,
			id: MediaActions.Report,
			ariaLabel: 'Meld een probleem',
			tooltip: 'Meld een probleem',
		},
		{
			label: 'Contacteer de leeszaal',
			icon: <Icon name={IconNamesLight.Contact} aria-hidden />,
			id: MediaActions.Contact,
			ariaLabel: 'Contacteer de leeszaal',
			tooltip: 'Contacteer de leeszaal',
		},
		{
			label: 'Kopieer de datum',
			icon: <Icon name={IconNamesLight.Calendar} aria-hidden />,
			id: MediaActions.Calendar,
			ariaLabel: 'Kopieer de datum',
			tooltip: 'Kopieer de datum',
		},
		{
			label: 'Bekijk gerelateerde objecten',
			icon: <Icon name={IconNamesLight.RelatedObjects} aria-hidden />,
			id: MediaActions.RelatedObjects,
			ariaLabel: 'Bekijk gerelateerde objecten',
			tooltip: 'Bekijk gerelateerde objecten',
		},
	],
	onClickAction: (id) => console.info(id),
	id: 'dynamic-action-menu',
};
