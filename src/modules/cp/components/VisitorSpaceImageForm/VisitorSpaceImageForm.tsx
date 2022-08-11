import { yupResolver } from '@hookform/resolvers/yup';
import { Button, ColorPicker, FormControl } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { CardImage, Icon } from '@shared/components';
import FileInput from '@shared/components/FileInput/FileInput';
import { DEFAULT_VISITOR_SPACE_COLOR } from '@visitor-space/const';

import { ValidationRef } from '../VisitorSpaceSettings/VisitorSpaceSettings.types';

import { VISITOR_SPACE_IMAGE_SCHEMA } from './VisitorSpaceImageForm.const';
import styles from './VisitorSpaceImageForm.module.scss';
import {
	VisitorSpaceImageFormProps,
	VisitorSpaceImageFormState,
} from './VisitorSpaceImageForm.types';

const labelKeys: Record<keyof VisitorSpaceImageFormState, string> = {
	color: 'VisitorSpaceImageForm__color',
	file: 'VisitorSpaceImageForm__file',
	image: 'VisitorSpaceImageForm__image',
};

const VisitorSpaceImageForm = forwardRef<
	ValidationRef<VisitorSpaceImageFormState>,
	VisitorSpaceImageFormProps
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
	} = useForm<VisitorSpaceImageFormState>({
		resolver: yupResolver(VISITOR_SPACE_IMAGE_SCHEMA()),
		defaultValues: {
			color: DEFAULT_VISITOR_SPACE_COLOR,
			file: undefined,
			image: '',
		},
	});
	const currentState = watch();

	// Save original form state
	const [savedState, setSavedState] = useState<VisitorSpaceImageFormState>({
		color: DEFAULT_VISITOR_SPACE_COLOR,
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
			color: room.color || DEFAULT_VISITOR_SPACE_COLOR,
			image: room.image || '',
		});
		setValue('color', room.color || DEFAULT_VISITOR_SPACE_COLOR);
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

	const onFormSubmit = (state: VisitorSpaceImageFormState) => {
		// Default color if color picker is empty
		if (!state.color) {
			setValue('color', DEFAULT_VISITOR_SPACE_COLOR);
			state.color = DEFAULT_VISITOR_SPACE_COLOR;
		}
		onSubmit?.(state, () => setSavedState(state));
		resetFileInput();
	};

	return (
		<div className={className}>
			<CardImage
				className={clsx(
					styles['c-visitor-space-image-form__image'],
					(currentState.image || currentState.color) &&
						styles['c-visitor-space-image-form__image--no-border']
				)}
				color={currentState.color}
				logo={room.logo}
				id={room.id}
				name={room.name}
				image={currentState.image}
				size="short"
			/>

			<FormControl
				className={styles['c-visitor-space-image-form__color-control']}
				errors={[errors.color?.message]}
				id={labelKeys.color}
				label={t(
					'modules/cp/components/visitor-space-image-form/visitor-space-image-form___achtergrondkleur'
				)}
			>
				<Controller
					name="color"
					control={control}
					render={() => (
						<ColorPicker
							input={{
								id: labelKeys.color,
							}}
							color={currentState.color ?? ''}
							onChange={(color) => {
								setValue('color', color);
								onUpdate?.({ color: color });
							}}
						/>
					)}
				/>
			</FormControl>

			<FormControl
				errors={[errors.file?.message]}
				id={labelKeys.file}
				label={t(
					'modules/cp/components/visitor-space-image-form/visitor-space-image-form___achtergrond-afbeelding'
				)}
				suffix={
					<span className={styles['c-visitor-space-image-form__hint']}>
						{`(${t(
							'modules/cp/components/visitor-space-image-form/visitor-space-image-form___max-500-kb'
						)})`}
					</span>
				}
			>
				<Controller
					name="file"
					control={control}
					render={(field) => (
						<FileInput
							{...field}
							hasFile={
								(!!savedState.image || !!fileInputRef.current?.value) &&
								!!currentState.image
							}
							id={labelKeys.file}
							onChange={async (e) => {
								e.currentTarget.files &&
									setValue('file', e.currentTarget.files[0] ?? undefined);
								const newImage =
									e.currentTarget.files && e.currentTarget.files.length
										? URL.createObjectURL(e.currentTarget.files[0])
										: savedState.image;
								setValue('image', newImage);
								onUpdate?.({ image: newImage });
								onUpdate?.({
									file: e.currentTarget.files?.[0] ?? undefined,
								});

								await trigger('file');
							}}
							ref={fileInputRef}
						/>
					)}
				/>

				{currentState.image && (
					<Button
						label={t(
							'modules/cp/components/visitor-space-image-form/visitor-space-image-form___verwijder-afbeelding'
						)}
						iconStart={<Icon name="trash" />}
						variants="text"
						onClick={async () => {
							setValue('image', '');
							setValue('file', undefined);
							onUpdate?.({ image: '', file: undefined });
							await trigger('file');
						}}
					/>
				)}
			</FormControl>

			{isStateUpdated() &&
				renderCancelSaveButtons(() => resetValues(), handleSubmit(onFormSubmit))}
		</div>
	);
});

VisitorSpaceImageForm.displayName = 'VisitorSpaceImageForm';

export default VisitorSpaceImageForm;
