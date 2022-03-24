import { yupResolver } from '@hookform/resolvers/yup';
import { Button, ColorPicker, FormControl } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { CardImage, Icon } from '@shared/components';

import { READING_ROOM_SETTINGS_SCHEMA } from './ReadingRoomSettingsForm.const';
import styles from './ReadingRoomSettingsForm.module.scss';
import {
	ReadingRoomFormState,
	ReadingRoomSettingsFormProps,
} from './ReadingRoomSettingsForm.types';

const RichTextForm: FC<ReadingRoomSettingsFormProps> = ({
	className,
	initialColor,
	onSubmit,
	renderCancelSaveButtons,
}) => {
	const { t } = useTranslation();

	const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
		watch,
	} = useForm<ReadingRoomFormState>({
		resolver: yupResolver(READING_ROOM_SETTINGS_SCHEMA()),
		defaultValues: {
			color: initialColor ?? '',
		},
	});
	const currentState = watch();

	const [savedState, setSavedState] = useState<ReadingRoomFormState>({
		color: initialColor ?? '',
	});

	useEffect(() => {
		setSavedState({
			color: initialColor ?? '',
		});
		setValue('color', initialColor ?? '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialColor]);

	const isStateUpdated = (): boolean => {
		return currentState.color !== savedState.color || currentState.image !== savedState.image;
	};

	const onFormSubmit = (state: ReadingRoomFormState) => {
		onSubmit?.(state);
		setSavedState(state);
	};

	const minWidth = 400;
	const minHeight = 320;

	return (
		<div className={className}>
			<CardImage
				className={styles['c-reading-room-settings-form__image']}
				color={currentState.color}
				logo="/images/logo-shd--small.svg"
				id="placeholder id"
				name={'placeholder name' || ''}
				// image="/images/bg-shd.png"
				size="short"
			/>
			<FormControl errors={[errors.color?.message]}>
				<Controller
					name="color"
					control={control}
					render={() => {
						return (
							<div className={styles['c-reading-room-settings-form__color-picker']}>
								<p className={styles['c-reading-room-settings-form__label']}>
									{t('Achtergrondkleur')}
								</p>
								<ColorPicker
									color={currentState.color ?? ''}
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
			</FormControl>
			<FormControl>
				<Controller
					name="image"
					control={control}
					render={() => {
						return (
							<>
								<p className={styles['c-reading-room-settings-form__label']}>
									{t('Achtergrond afbeelding')}
									<span className={styles['c-reading-room-settings-form__hint']}>
										(
										{t('Minimum {{minWidth}}px x {{minHeight}}px, max 500kb.', {
											minWidth,
											minHeight,
										})}
										)
									</span>
								</p>
								<div
									className={
										styles['c-reading-room-settings-form__image-buttons']
									}
								>
									<Button
										label={t('Upload nieuwe afbeelding')}
										variants="outline"
									/>
									<Button
										label={t('Verwijderen')}
										iconStart={<Icon name="trash" />}
										variants="text"
									/>
								</div>
							</>
						);
					}}
				/>
			</FormControl>
			{isStateUpdated() &&
				renderCancelSaveButtons(
					() => setValue('color', savedState?.color),
					handleSubmit(onFormSubmit)
				)}
		</div>
	);
};

export default RichTextForm;
