import { capitalize, lowerCase } from 'lodash-es';

import { AlertIconNames, IconNamesLight, IconNamesSolid } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';

import { type IconName } from './Icon.types';

export const ICON_LIST_CONFIG = (): { value: IconName; label: string }[] => {
	return [...Object.values(IconNamesLight), ...Object.values(IconNamesSolid)].map(
		(IconName: IconName) => ({
			value: IconName,
			label: capitalize(lowerCase(IconName)),
		})
	);
};

export const ALERT_ICON_LIST_CONFIG = (): {
	key: string;
	value: AlertIconNames;
	label: string;
}[] => {
	const alertIcons = Object.keys(AlertIconNames).map((key: string) => ({
		key,
		value: AlertIconNames[key as keyof typeof AlertIconNames],
		label: tText(`modules/admin/icons/${key}`),
	}));

	return [...alertIcons];
};
