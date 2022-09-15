import { mixed, object, SchemaOf, string } from 'yup';

import { tText } from '@shared/helpers/translate';

import { VisitorSpaceImageFormState } from './VisitorSpaceImageForm.types';
import { checkFileSize, checkFileType } from './VisitorSpaceImageForm.utils';

export const VISITOR_SPACE_IMAGE_SCHEMA = (): SchemaOf<VisitorSpaceImageFormState> => {
	return object({
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
