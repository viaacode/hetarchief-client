import { yupResolver } from '@hookform/resolvers/yup';
import { Button, ColorPicker, FormControl } from '@meemoo/react-components';
import clsx from 'clsx';
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
			color: DEFAULT_READING_ROOM_COLOR,
			file: undefined,
			image: '',
		},
	});
	const currentState = watch();

	// Save original form state
	const [savedState, setSavedState] = useState<ReadingRoomFormState>({
		color: DEFAULT_READING_ROOM_COLOR,
		image: '',
		file: undefined,
	});

	/**
	 * Effects
	 */

	useEffect(() => {
		setSavedState({
			...savedState,
			color: room.color || DEFAULT_READING_ROOM_COLOR,
			image: room.image || '',
		});
		setValue('color', room.color || DEFAULT_READING_ROOM_COLOR);
		setValue('image', room.image || '');

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
		// Default color if color picker is empty
		if (!state.color) {
			setValue('color', DEFAULT_READING_ROOM_COLOR);
			state.color = DEFAULT_READING_ROOM_COLOR;
		}
		onSubmit?.(state, () => setSavedState(state));
		resetFileInput();
	};

	return (
		<div className={className}>
			<CardImage
				className={clsx(
					styles['c-reading-room-settings-form__image'],
					(currentState.image || currentState.color) &&
						styles['c-reading-room-settings-form__image--no-border']
				)}
				color={currentState.color}
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
									{t(
										'modules/cp/components/reading-room-settings-form/reading-room-settings-form___achtergrondkleur'
									)}
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
									{t(
										'modules/cp/components/reading-room-settings-form/reading-room-settings-form___achtergrond-afbeelding'
									)}
									<span className={styles['c-reading-room-settings-form__hint']}>
										(
										{t(
											'modules/cp/components/reading-room-settings-form/reading-room-settings-form___max-500-kb'
										)}
										)
									</span>
								</p>
								<div
									className={
										styles['c-reading-room-settings-form__image-buttons']
									}
								>
									<FileInput
										{...field}
										hasFile={
											(!!savedState.image || !!fileInputRef.current?.value) &&
											!!currentState.image
										}
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
									{currentState.image && (
										<Button
											label={t(
												'modules/cp/components/reading-room-settings-form/reading-room-settings-form___verwijder-afbeelding'
											)}
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
