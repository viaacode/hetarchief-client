import { i18n } from 'next-i18next';
import { mixed, object, SchemaOf, string } from 'yup';

import { ReadingRoomFormState } from './ReadingRoomSettingsForm.types';
import { checkFileSize, checkFileType } from './ReadingRoomSettingsForm.utils';

export const READING_ROOM_SETTINGS_SCHEMA = (): SchemaOf<ReadingRoomFormState> => {
	return object({
		color: string().matches(/^$|^#([0-9A-F]{3}){1,2}$/i, {
			message:
				i18n?.t(
					'modules/cp/components/reading-room-settings-form/reading-room-settings-form___kleur-moet-een-geldige-hex-code-zijn'
				) ?? 'Invalid color',
		}),
		file: mixed()
			.nullable()
			.test(
				'file-size',
				i18n?.t(
					'modules/cp/components/reading-room-settings-form/reading-room-settings-form___het-bestand-is-groter-dan-500-kb'
				) ?? 'Too large',
				checkFileSize
			)
			.test(
				'file-format',
				i18n?.t(
					'modules/cp/components/reading-room-settings-form/reading-room-settings-form___dit-formaat-wordt-niet-ondersteund'
				) ?? 'Format not supported',
				checkFileType
			),
		image: string(),
	});
};
