import { MediaActions } from '@ie-objects/ie-objects.types';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';

import type { DynamicActionMenuProps } from '../DynamicActionMenu.types';

export const dynamicActionMenuMock: DynamicActionMenuProps = {
	actions: [
		{
			label: tText('Toevoegen aan aanvraaglijst'),
			icon: <Icon name={IconNamesLight.Request} aria-hidden />,
			id: MediaActions.RequestMaterial,
			ariaLabel: tText('Toevoegen aan aanvraaglijst'),
			isPrimary: true,
		},
		{
			label: tText('Sla dit item op'),
			icon: <Icon name={IconNamesLight.Bookmark} aria-hidden />,
			id: MediaActions.Bookmark,
			ariaLabel: tText('Sla dit item op'),
			tooltip: tText('Sla dit item op'),
		},
		{
			label: tText('Meld een probleem'),
			icon: <Icon name={IconNamesLight.Flag} aria-hidden />,
			id: MediaActions.Report,
			ariaLabel: tText('Meld een probleem'),
			tooltip: tText('Meld een probleem'),
		},
		{
			label: tText('Contacteer de leeszaal'),
			icon: <Icon name={IconNamesLight.Contact} aria-hidden />,
			id: MediaActions.Contact,
			ariaLabel: tText('Contacteer de leeszaal'),
			tooltip: tText('Contacteer de leeszaal'),
		},
		{
			label: tText('Kopieer de datum'),
			icon: <Icon name={IconNamesLight.Calendar} aria-hidden />,
			id: MediaActions.Calendar,
			ariaLabel: tText('Kopieer de datum'),
			tooltip: tText('Kopieer de datum'),
		},
		{
			label: tText('Bekijk gerelateerde objecten'),
			icon: <Icon name={IconNamesLight.RelatedObjects} aria-hidden />,
			id: MediaActions.RelatedObjects,
			ariaLabel: tText('Bekijk gerelateerde objecten'),
			tooltip: tText('Bekijk gerelateerde objecten'),
		},
	],
	onClickAction: (id) => console.info(id),
	id: 'dynamic-action-menu',
};
