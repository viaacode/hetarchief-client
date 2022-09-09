import { object, SchemaOf, string } from 'yup';

import { TranslationService } from '@shared/services/translation-service/translation-service';

import { SiteSettingsFormState } from './SiteSettingsForm.types';

export const SITE_SETTINGS_SCHEMA = (): SchemaOf<SiteSettingsFormState> => {
	return object({
		orId: string().required(
			TranslationService.getTranslation(
				'modules/cp/components/site-settings-form/site-settings-form___naam-is-verplicht'
			)
		),
		slug: string()
			.strict()
			.lowercase(
				TranslationService.getTranslation(
					'modules/cp/components/site-settings-form/site-settings-form___slug-mag-geen-hoofdletters-bevatten'
				)
			)
			.matches(/^\S*$/i, {
				message: TranslationService.getTranslation(
					'modules/cp/components/site-settings-form/site-settings-form___slug-mag-geen-spatie-bevatten'
				),
			})
			.required(
				TranslationService.getTranslation(
					'modules/cp/components/site-settings-form/site-settings-form___slug-is-verplicht'
				)
			),
	});
};
