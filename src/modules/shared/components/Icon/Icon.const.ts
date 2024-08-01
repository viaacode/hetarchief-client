import { capitalize, lowerCase } from 'lodash-es';

import { AlertIconNames, IconNamesLight, IconNamesSolid } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';

import { type IconName } from './Icon.types';

export const GET_ICON_LIST_CONFIG = (): { value: IconName; label: string }[] => {
	return [...Object.values(IconNamesLight), ...Object.values(IconNamesSolid)].map(
		(IconName: IconName) => ({
			value: IconName,
			label: capitalize(lowerCase(IconName)),
		})
	);
};

const GET_ALERT_ICON_LABELS = (): Record<keyof typeof AlertIconNames, string> => {
	return {
		Notification: tText('modules/shared/components/icon/icon___notificatie'),
		User: tText('modules/shared/components/icon/icon___gebruiker'),
		Question: tText('modules/shared/components/icon/icon___vraagteken'),
		Info: tText('modules/shared/components/icon/icon___info'),
		Exclamation: tText('modules/shared/components/icon/icon___uitroepteken'),
		Key: tText('modules/shared/components/icon/icon___sleutel'),
		Calendar: tText('modules/shared/components/icon/icon___kalender'),
		Book: tText('modules/shared/components/icon/icon___boek'),
		AngleRight: tText('modules/shared/components/icon/icon___chevron-rechts'),
	};
};

export const GET_ALERT_ICON_LIST_CONFIG = (): {
	key: keyof typeof AlertIconNames;
	value: AlertIconNames;
	label: string;
}[] => {
	return Object.keys(AlertIconNames).map((key: string) => ({
		key: key as keyof typeof AlertIconNames,
		value: AlertIconNames[key as keyof typeof AlertIconNames],
		label: GET_ALERT_ICON_LABELS()[key as keyof typeof AlertIconNames],
	}));
};
