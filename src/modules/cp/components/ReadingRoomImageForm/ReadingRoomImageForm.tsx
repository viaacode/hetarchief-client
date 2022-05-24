import { yupResolver } from '@hookform/resolvers/yup';
import { Button, ColorPicker, FormControl } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { FC, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { DEFAULT_READING_ROOM_COLOR } from '@reading-room/const';
import { CardImage, Icon } from '@shared/components';
import FileInput from '@shared/components/FileInput/FileInput';

import { ValidationRef } from '../ReadingRoomSettings/ReadingRoomSettings.types';

import { READING_ROOM_IMAGE_SCHEMA } from './ReadingRoomImageForm.const';
import styles from './ReadingRoomImageForm.module.scss';
import { ReadingRoomImageFormProps, ReadingRoomImageFormState } from './ReadingRoomImageForm.types';

const ReadingRoomImageForm = forwardRef<
	ValidationRef<ReadingRoomImageFormState>,
	ReadingRoomImageFormProps
>(({ className, room, onSubmit, onUpdate, renderCancelSaveButtons }, ref) => {
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
		trigger,
	} = useForm<ReadingRoomImageFormState>({
		resolver: yupResolver(READING_ROOM_IMAGE_SCHEMA()),
		defaultValues: {
			color: DEFAULT_READING_ROOM_COLOR,
			file: undefined,
			image: '',
		},
	});
	const currentState = watch();

	// Save original form state
	const [savedState, setSavedState] = useState<ReadingRoomImageFormState>({
		color: DEFAULT_READING_ROOM_COLOR,
		image: '',
		file: undefined,
	});

	// Trigger from outside
	useImperativeHandle(ref, () => ({
		validate: trigger,
	}));

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

		onUpdate?.({
			color: savedState.color,
			file: undefined,
			image: savedState.image,
		});

		resetFileInput();
	};

	const onFormSubmit = (state: ReadingRoomImageFormState) => {
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
					styles['c-reading-room-image-form__image'],
					(currentState.image || currentState.color) &&
						styles['c-reading-room-image-form__image--no-border']
				)}
				color={currentState.color}
				logo={room.logo}
				id={room.id}
				name={room.name}
				image={currentState.image}
				size="short"
			/>
			<FormControl
				className={styles['c-reading-room-image-form__color-control']}
				errors={[errors.color?.message]}
			>
				<Controller
					name="color"
					control={control}
					render={() => {
						return (
							<div className={styles['c-reading-room-image-form__color-picker']}>
								<p className={styles['c-reading-room-image-form__label']}>
									{t(
										'modules/cp/components/reading-room-image-form/reading-room-image-form___achtergrondkleur'
									)}
								</p>
								<ColorPicker
									color={currentState.color ?? ''}
									onChange={(color) => {
										setValue('color', color);
										onUpdate?.({ color: color });
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
								<p className={styles['c-reading-room-image-form__label']}>
									{t(
										'modules/cp/components/reading-room-image-form/reading-room-image-form___achtergrond-afbeelding'
									)}
									<span className={styles['c-reading-room-image-form__hint']}>
										{`(${t(
											'modules/cp/components/reading-room-image-form/reading-room-image-form___max-500-kb'
										)})`}
									</span>
								</p>
								<div className={styles['c-reading-room-image-form__image-buttons']}>
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
											const newImage =
												e.currentTarget.files &&
												e.currentTarget.files.length
													? URL.createObjectURL(e.currentTarget.files[0])
													: savedState.image;
											setValue('image', newImage);
											onUpdate?.({ image: newImage });
											onUpdate?.({
												file: e.currentTarget.files?.[0] ?? undefined,
											});
										}}
									/>
									{currentState.image && (
										<Button
											label={t(
												'modules/cp/components/reading-room-image-form/reading-room-image-form___verwijder-afbeelding'
											)}
											iconStart={<Icon name="trash" />}
											variants="text"
											onClick={() => {
												setValue('image', '');
												onUpdate?.({ image: '', file: undefined });
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
});

ReadingRoomImageForm.displayName = 'ReadingRoomImageForm';

export default ReadingRoomImageForm;
