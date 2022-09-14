import { object, SchemaOf, string } from 'yup';

import { i18n } from '@shared/helpers/i18n';

import { SiteSettingsFormState } from './SiteSettingsForm.types';

export const SITE_SETTINGS_SCHEMA = (): SchemaOf<SiteSettingsFormState> => {
	return object({
		orId: string().required(
			i18n.t(
				'modules/cp/components/site-settings-form/site-settings-form___naam-is-verplicht'
			)
		),
		slug: string()
			.strict()
			.lowercase(
				i18n.t(
					'modules/cp/components/site-settings-form/site-settings-form___slug-mag-geen-hoofdletters-bevatten'
				)
			)
			.matches(/^\S*$/i, {
				message: i18n.t(
					'modules/cp/components/site-settings-form/site-settings-form___slug-mag-geen-spatie-bevatten'
				),
			})
			.required(
				i18n.t(
					'modules/cp/components/site-settings-form/site-settings-form___slug-is-verplicht'
				)
			),
	});
};
