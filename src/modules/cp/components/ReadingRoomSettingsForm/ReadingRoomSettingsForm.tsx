import { yupResolver } from '@hookform/resolvers/yup';
import { Button, ColorPicker, FormControl } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { DEFAULT_READING_ROOM_COLOR } from '@reading-room/const';
import { CardImage, Icon } from '@shared/components';
import FileInput from '@shared/components/FileInput/FileInput';

import { READING_ROOM_SETTINGS_SCHEMA } from './ReadingRoomSettingsForm.const';
import styles from './ReadingRoomSettingsForm.module.scss';
import {
	ReadingRoomFormState,
	ReadingRoomSettingsFormProps,
} from './ReadingRoomSettingsForm.types';

const RichTextForm: FC<ReadingRoomSettingsFormProps> = ({
	className,
	initialColor,
	initialImage,
	onSubmit,
	renderCancelSaveButtons,
}) => {
	/**
	 * Hooks
	 */
	const { t } = useTranslation();

	/**
	 * Refs
	 */
	const fileInputRef = useRef<HTMLInputElement>(null);

	/**
	 * Formstate
	 */
	const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
		watch,
		reset,
	} = useForm<ReadingRoomFormState>({
		resolver: yupResolver(READING_ROOM_SETTINGS_SCHEMA()),
		defaultValues: {
			color: initialColor ?? '',
			file: undefined,
			image: initialImage ?? '',
		},
	});
	const currentState = watch();

	// Save original form state
	const [savedState, setSavedState] = useState<ReadingRoomFormState>({
		color: '',
		image: '',
		file: undefined,
	});

	/**
	 * Effects
	 */

	useEffect(() => {
		setSavedState({
			...savedState,
			color: initialColor ?? '',
			image: initialImage ?? '',
		});
		setValue('color', initialColor ?? '');
		setValue('image', initialImage ?? '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialColor, initialImage]);

	/**
	 * Callbacks
	 */

	const isStateUpdated = (): boolean => {
		return (
			currentState.color !== savedState.color ||
			currentState.file !== savedState.file ||
			currentState.image !== savedState.image
		);
	};

	const resetValues = () => {
		reset({
			color: savedState.color,
			file: undefined,
			image: savedState.image,
		});

		// Reset file input
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const onFormSubmit = (state: ReadingRoomFormState) => {
		onSubmit?.(state);
		setSavedState(state);
	};

	return (
		<div className={className}>
			<CardImage
				className={styles['c-reading-room-settings-form__image']}
				color={currentState.color ? currentState.color : DEFAULT_READING_ROOM_COLOR}
				logo="/images/logo-shd--small.svg"
				id="placeholder id"
				name={'placeholder name' || ''}
				image={currentState.image}
				size="short"
			/>
			<FormControl
				className={styles['c-reading-room-settings-form__color-control']}
				errors={[errors.color?.message]}
			>
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
										setValue('color', color);
									}}
								/>
							</div>
						);
					}}
				/>
			</FormControl>
			<FormControl errors={[errors.file?.message]}>
				<Controller
					name="file"
					control={control}
					render={(field) => {
						return (
							<>
								<p className={styles['c-reading-room-settings-form__label']}>
									{t('Achtergrond afbeelding')}
									<span className={styles['c-reading-room-settings-form__hint']}>
										({t('Max 500kb.')})
									</span>
								</p>
								<div
									className={
										styles['c-reading-room-settings-form__image-buttons']
									}
								>
									<FileInput
										{...field}
										ref={fileInputRef}
										onChange={(e) => {
											e.currentTarget.files?.[0] &&
												setValue(
													'file',
													e.currentTarget.files[0] ?? undefined
												);
										}}
									/>
									{currentState.image && (
										<Button
											label={t('Verwijderen')}
											iconStart={<Icon name="trash" />}
											variants="text"
											onClick={() => setValue('image', '')}
										/>
									)}
								</div>
							</>
						);
					}}
				/>
			</FormControl>
			{isStateUpdated() &&
				renderCancelSaveButtons(() => resetValues(), handleSubmit(onFormSubmit))}
		</div>
	);
};

export default RichTextForm;
