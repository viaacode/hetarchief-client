import { number, object, type Schema, string } from 'yup';

import { tText } from '@shared/helpers/translate';
import { type CreateVisitorSpaceSettings } from '@visitor-space/services/visitor-space/visitor-space.service.types';

import { checkFileSize, checkFileType } from './VisitorSpaceSettings.utils';

export const YUP_FILE_SCHEMA = object({
	lastModified: number().required(),
	name: string().required(),
	webkitRelativePath: string().required(),
	size: number().required(),
	type: string().required(),
	// Methods like arrayBuffer, slice, stream, and text are not represented in the schema
	// because yup is used for validation of static data structures, not functions or methods.
});

export const VISITOR_SPACE_VALIDATION_SCHEMA = (): Schema<
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
		file: YUP_FILE_SCHEMA.nullable()
			.optional()
			.test(
				'file-size',
				tText(
					'modules/cp/components/visitor-space-image-form/visitor-space-image-form___het-bestand-is-groter-dan-500-kb'
				),
				(value) => checkFileSize(value as File | undefined)
			)
			.test(
				'file-format',
				tText(
					'modules/cp/components/visitor-space-image-form/visitor-space-image-form___dit-formaat-wordt-niet-ondersteund'
				),
				(value) => checkFileType(value as File | undefined)
			),
		image: string(),
	}) as Schema<
		Pick<Partial<CreateVisitorSpaceSettings>, 'orId' | 'slug' | 'color' | 'file' | 'image'>
	>;
};
