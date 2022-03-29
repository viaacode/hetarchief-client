import { yupResolver } from '@hookform/resolvers/yup';
import { Button, ColorPicker, FormControl } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

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
	room,
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
			color: '',
			file: undefined,
			image: '',
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
			color: room.color ?? '',
			image: room.image ?? '',
		});
		setValue('color', room.color ?? '');
		setValue('image', room.image ?? '');

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [room]);

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

	const resetFileInput = () => {
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const resetValues = () => {
		reset({
			color: savedState.color,
			file: undefined,
			image: savedState.image,
		});

		resetFileInput();
	};

	const onFormSubmit = (state: ReadingRoomFormState) => {
		onSubmit?.(state);
		setSavedState(state);
		resetFileInput();
	};

	return (
		<div className={className}>
			<CardImage
				className={clsx(
					styles['c-reading-room-settings-form__image'],
					currentState.image && styles['c-reading-room-settings-form__image--no-border']
				)}
				color=""
				logo={room.logo}
				id={room.id}
				name={room.name}
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
										hasFile={!!fileInputRef.current?.value}
										ref={fileInputRef}
										onChange={(e) => {
											e.currentTarget.files &&
												setValue(
													'file',
													e.currentTarget.files[0] ?? undefined
												);
											setValue(
												'image',
												e.currentTarget.files &&
													e.currentTarget.files.length
													? URL.createObjectURL(e.currentTarget.files[0])
													: savedState.image
											);
										}}
									/>
									{savedState.image && (
										<Button
											label={t('Verwijderen')}
											iconStart={<Icon name="trash" />}
											variants="text"
											onClick={() => {
												setValue('image', '');
											}}
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
