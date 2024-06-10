import { mixed, object, SchemaOf, string } from 'yup';

import { tText } from '@shared/helpers/translate';
import { CreateVisitorSpaceSettings } from '@visitor-space/services/visitor-space/visitor-space.service.types';

import { checkFileSize, checkFileType } from './VisitorSpaceSettings.utils';

export const VISITOR_SPACE_VALIDATION_SCHEMA = (): SchemaOf<
	Pick<Partial<CreateVisitorSpaceSettings>, 'orId' | 'slug' | 'color' | 'file' | 'image'>
> => {
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
		color: string().matches(/^$|^#([0-9A-F]{3}){1,2}$/i, {
			message: tText(
				'modules/cp/components/visitor-space-image-form/visitor-space-image-form___kleur-moet-een-geldige-hex-code-zijn'
			),
		}),
		file: mixed()
			.nullable()
			.test(
				'file-size',
				tText(
					'modules/cp/components/visitor-space-image-form/visitor-space-image-form___het-bestand-is-groter-dan-500-kb'
				),
				checkFileSize
			)
			.test(
				'file-format',
				tText(
					'modules/cp/components/visitor-space-image-form/visitor-space-image-form___dit-formaat-wordt-niet-ondersteund'
				),
				checkFileType
			),
		image: string(),
	});
};
