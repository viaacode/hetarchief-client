import { object, SchemaOf, string } from 'yup';

import { i18n } from '@shared/helpers/i18n';

import { SiteSettingsFormState } from './SiteSettingsForm.types';

export const SITE_SETTINGS_SCHEMA = (): SchemaOf<SiteSettingsFormState> => {
	return object({
		name: string().required(
			i18n.t(
				'modules/cp/components/site-settings-form/site-settings-form___naam-is-verplicht'
			)
		),
		slug: string().required(
			i18n.t(
				'modules/cp/components/site-settings-form/site-settings-form___slug-is-verplicht'
			)
		),
	});
};
