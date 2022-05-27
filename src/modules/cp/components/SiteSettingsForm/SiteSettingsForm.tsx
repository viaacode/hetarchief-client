import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, ReactSelect, SelectOption, TextInput } from '@meemoo/react-components';
import { kebabCase } from 'lodash-es';
import { useTranslation } from 'next-i18next';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { SingleValue } from 'react-select';

import { useGetContentPartners } from '@cp/hooks/get-content-partners';
import { toastService } from '@shared/services/toast-service';
import { getSelectValue } from '@visitor-space/utils/select';

import { ValidationRef } from '../VisitorSpaceSettings/VisitorSpaceSettings.types';

import { SITE_SETTINGS_SCHEMA } from './SiteSettingsForm.const';
import styles from './SiteSettingsForm.module.scss';
import { SiteSettingsFormProps, SiteSettingsFormState } from './SiteSettingsForm.types';

const SiteSettingsForm = forwardRef<ValidationRef<SiteSettingsFormState>, SiteSettingsFormProps>(
	(
		{ className, room, onSubmit, onUpdate, renderCancelSaveButtons, disableDropdown = false },
		ref
	) => {
		/**
		 * Hooks
		 */
		const { t } = useTranslation();
		const { data: contentPartners, isError: isErrorContentPartners } = useGetContentPartners(
			false,
			!disableDropdown
		);

		const [cpOptions, setCpOptions] = useState<SelectOption[] | undefined>(undefined);

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
		} = useForm<SiteSettingsFormState>({
			resolver: yupResolver(SITE_SETTINGS_SCHEMA()),
		});
		const currentState = watch();

		// Save original form state
		const [savedState, setSavedState] = useState<SiteSettingsFormState>({
			orId: '',
			slug: '',
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
				orId: room.id || '',
				slug: room.slug || '',
			});
			setValue('orId', room.id || '');
			setValue('slug', room.slug || '');

			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [room]);

		useEffect(() => {
			contentPartners &&
				setCpOptions(
					contentPartners.items.map((cp) => ({
						label: cp.name,
						value: cp.id,
					}))
				);

			isErrorContentPartners &&
				toastService.notify({
					maxLines: 3,
					title: t('modules/cp/components/site-settings-form/site-settings-form___error'),
					description: t(
						'modules/cp/components/site-settings-form/site-settings-form___er-ging-iets-mis-bij-het-ophalen-van-de-content-partners'
					),
				});
		}, [contentPartners, isErrorContentPartners, t]);

		/**
		 * Callbacks
		 */

		const isStateUpdated = (): boolean => {
			return currentState.orId !== savedState.orId || currentState.slug !== savedState.slug;
		};

		const resetFileInput = () => {
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		};

		const resetValues = () => {
			reset({
				orId: savedState.orId,
				slug: savedState.slug,
			});

			onUpdate?.({
				orId: savedState.orId,
				slug: savedState.slug,
			});

			resetFileInput();
		};

		const onFormSubmit = (state: SiteSettingsFormState) => {
			onSubmit?.(state, () => setSavedState(state));
			resetFileInput();
		};

		/**
		 * Render
		 */

		return (
			<div className={className}>
				<FormControl errors={[errors.orId?.message]}>
					<Controller
						name="orId"
						control={control}
						render={(field) => {
							return (
								<div className={styles['c-cp-settings__site-settings-input']}>
									<label>
										{t(
											'modules/cp/components/site-settings-form/site-settings-form___content-partner'
										)}
									</label>
									<ReactSelect
										{...field}
										isDisabled={disableDropdown}
										components={{ IndicatorSeparator: () => null }}
										options={cpOptions}
										value={
											disableDropdown
												? { label: room.name, value: room.id }
												: getSelectValue(
														cpOptions ?? [],
														kebabCase(currentState.orId)
												  )
										}
										onChange={(newValue) => {
											const value = (newValue as SingleValue<SelectOption>)
												?.value as string;
											const slug = kebabCase(
												(newValue as SingleValue<SelectOption>)
													?.label as string
											);

											if (value !== currentState.orId || '') {
												setValue('orId', value);
												setValue('slug', slug);
												onUpdate?.({ orId: value, slug: slug });
											}
										}}
									/>
								</div>
							);
						}}
					/>
				</FormControl>
				<FormControl errors={[errors.slug?.message]}>
					<Controller
						name="slug"
						control={control}
						render={(field) => {
							return (
								<div className={styles['c-cp-settings__site-settings-input']}>
									<label>
										{t(
											'modules/cp/components/site-settings-form/site-settings-form___slug'
										)}
									</label>
									<TextInput
										{...field}
										value={currentState?.slug}
										onChange={(e) => {
											const value = e.currentTarget.value;
											setValue('slug', value);
											onUpdate?.({ slug: value });
										}}
									/>
								</div>
							);
						}}
					/>
				</FormControl>
				{isStateUpdated() &&
					renderCancelSaveButtons(() => resetValues(), handleSubmit(onFormSubmit))}
			</div>
		);
	}
);

SiteSettingsForm.displayName = 'SiteSettingsForm';

export default SiteSettingsForm;
