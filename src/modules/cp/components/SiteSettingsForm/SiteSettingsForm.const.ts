import { object, SchemaOf, string } from 'yup';

import { tText } from '@shared/helpers/translate';

import { SiteSettingsFormState } from './SiteSettingsForm.types';

export const SITE_SETTINGS_SCHEMA = (): SchemaOf<SiteSettingsFormState> => {
	return object({
		orId: string().required(
			tText('modules/cp/components/site-settings-form/site-settings-form___naam-is-verplicht')
		),
		slug: string()
			.strict()
			.lowercase(
				tText(
					'modules/cp/components/site-settings-form/site-settings-form___slug-mag-geen-hoofdletters-bevatten'
				)
			)
			.matches(/^\S*$/i, {
				message: tText(
					'modules/cp/components/site-settings-form/site-settings-form___slug-mag-geen-spatie-bevatten'
				),
			})
			.required(
				tText(
					'modules/cp/components/site-settings-form/site-settings-form___slug-is-verplicht'
				)
			),
	});
};
