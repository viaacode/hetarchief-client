import { Button, ColorPicker, FormControl, RichEditorState } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { CardImage, Icon } from '@shared/components';

import {
	ReadingRoomFormState,
	ReadingRoomSettingsFormProps,
} from './ReadingRoomSettingsForm.types';

const RichTextForm: FC<ReadingRoomSettingsFormProps> = ({ onSubmit }) => {
	const { t } = useTranslation();

	const { control, handleSubmit, setValue, watch } = useForm<ReadingRoomFormState>();
	const color = watch('color');

	const [savedState, setSavedState] = useState<ReadingRoomFormState>();

	const onFormSubmit = (state: ReadingRoomFormState) => {
		// onSubmit?.(state);
		setSavedState(state);
	};

	// dupe?
	const renderCancelSaveButtons = (onCancel: () => void, onSave: () => void) => (
		<div className="p-cp-settings__cancel-save">
			<Button label={t('Annuleer')} variants="text" onClick={onCancel} />
			<Button label={t('Bewaar wijzigingen')} variants="black" onClick={onSave} />
		</div>
	);

	const minWidth = 400;
	const minHeight = 320;

	return (
		<>
			<CardImage
				className="p-cp-settings__leeszaal-image"
				color={color}
				logo="/images/logo-shd--small.svg"
				id="placeholder id"
				name={'placeholder name' || ''}
				// image="/images/bg-shd.png"
				size="short"
			/>
			<FormControl>
				<Controller
					name="color"
					control={control}
					render={() => {
						return (
							<div className="p-cp-settings__leeszaal-color-picker">
								<p className="p-cp-settings__subtitle">{t('Achtergrondkleur')}</p>
								<ColorPicker
									color={color ?? ''}
									onChange={(color) => {
										if (!savedState) {
											setSavedState({
												color,
											});
										}
										setValue('color', color);
									}}
								/>
							</div>
						);
					}}
				/>
				<div className="p-cp-settings__leeszaal-image-controls">
					<p className="p-cp-settings__subtitle">
						{t('Achtergrond afbeelding')}
						<span className="p-cp-settings__hint">
							(
							{t('Minimum {{minWidth}}px x {{minHeight}}px, max 500kb.', {
								minWidth,
								minHeight,
							})}
							)
						</span>
					</p>
					<div className="p-cp-settings__leeszaal-image-buttons">
						<Button label={t('Upload nieuwe afbeelding')} variants="outline" />
						<Button
							label={t('Verwijderen')}
							iconStart={<Icon name="trash" />}
							variants="text"
						/>
					</div>
				</div>
				{renderCancelSaveButtons(
					() => setValue('color', savedState?.color),
					handleSubmit(onFormSubmit)
				)}
			</FormControl>
		</>
	);
};

export default RichTextForm;
