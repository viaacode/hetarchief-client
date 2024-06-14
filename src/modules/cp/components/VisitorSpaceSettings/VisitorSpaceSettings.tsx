import {
	Box,
	Button,
	ColorPicker,
	FormControl,
	ReactSelect,
	RichTextEditorWithInternalState,
	SelectOption,
	TextInput,
} from '@meemoo/react-components';
import clsx from 'clsx';
import { isEqual, kebabCase } from 'lodash-es';
import { useRouter } from 'next/router';
import React, { FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SingleValue } from 'react-select';
import { ValidationError } from 'yup';

import { Permission } from '@account/const';
import { VISITOR_SPACE_VALIDATION_SCHEMA } from '@cp/components/VisitorSpaceSettings/VisitorSpaceSettings.const';
import { IconNamesLight, Loading } from '@shared/components';
import CardImage from '@shared/components/CardImage/CardImage';
import FileInput from '@shared/components/FileInput/FileInput';
import Icon from '@shared/components/Icon/Icon';
import { globalLabelKeys, ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';
import { Locale } from '@shared/utils';
import { NoServerSideRendering } from '@visitor-space/components/NoServerSideRendering/NoServerSideRendering';
import { DEFAULT_VISITOR_SPACE_COLOR } from '@visitor-space/const';
import { useGetContentPartners } from '@visitor-space/hooks/get-content-partner';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';
import { VisitorSpaceService } from '@visitor-space/services';
import {
	CreateVisitorSpaceSettings,
	UpdateVisitorSpaceSettings,
} from '@visitor-space/services/visitor-space/visitor-space.service.types';
import { VisitorSpaceStatus } from '@visitor-space/types';

import adminLayoutStyles from '../../../admin/layouts/AdminLayout/AdminLayout.module.scss';

import styles from './VisitorSpaceSettings.module.scss';
import {
	VisitorSpaceSettingsFormValues,
	VisitorSpaceSettingsProps,
} from './VisitorSpaceSettings.types';

const labelKeys: Record<keyof CreateVisitorSpaceSettings, string> = {
	color: 'VisitorSpaceSettings__color',
	file: 'VisitorSpaceSettings__file',
	image: 'VisitorSpaceSettings__image',
	orId: 'VisitorSpaceSettings__orId',
	descriptionNl: 'VisitorSpaceSettings__descriptionNl',
	serviceDescriptionNl: 'VisitorSpaceSettings__serviceDescriptionNl',
	descriptionEn: 'VisitorSpaceSettings__descriptionEn',
	serviceDescriptionEn: 'VisitorSpaceSettings__serviceDescriptionEn',
	slug: 'VisitorSpaceSettings__slug',
	status: 'VisitorSpaceSettings__status',
};

const VisitorSpaceSettings: FC<VisitorSpaceSettingsProps> = ({ action, visitorSpaceSlug }) => {
	const { tText, tHtml } = useTranslation();
	const router = useRouter();
	const locale = useLocale();
	const [descriptionEditLanguage, setDescriptionEditLanguage] = useState<Locale>(Locale.nl);
	const [serviceDescriptionEditLanguage, setServiceDescriptionEditLanguage] = useState<Locale>(
		Locale.nl
	);
	const [formErrors, setFormErrors] = useState<
		Partial<Record<keyof CreateVisitorSpaceSettings, string | undefined>>
	>({});
	const { data: contentPartners, isError: isErrorContentPartners } = useGetContentPartners(
		{
			hasSpace: false,
		},
		{ enabled: action === 'create' }
	);
	const { data: maintainer } = useGetVisitorSpace(visitorSpaceSlug, false, {
		enabled: action === 'create',
	});
	const maintainerOptions = (contentPartners || []).map((maintainer) => ({
		label: maintainer?.name,
		value: maintainer?.id,
	}));

	const fileInputRef = useRef<HTMLInputElement>(null);

	const {
		data: visitorSpaceResponse,
		isLoading,
		refetch: refetchVisitorSpace,
		error: visitorSpaceError,
	} = useGetVisitorSpace(visitorSpaceSlug as string);

	const visitorSpace: VisitorSpaceSettingsFormValues | null = useMemo(() => {
		if (action === 'create') {
			return {
				id: null,
				orId: '',
				color: DEFAULT_VISITOR_SPACE_COLOR,
				image: '',
				descriptionNl: null,
				serviceDescriptionNl: null,
				descriptionEn: null,
				serviceDescriptionEn: null,
				logo: null,
				file: null,
				slug: '',
				name: '',
				status: VisitorSpaceStatus.Requested,
			};
		}
		if (action === 'edit' && visitorSpaceResponse) {
			return {
				id: visitorSpaceResponse.id,
				orId: visitorSpaceResponse.maintainerId,
				color: visitorSpaceResponse.color || DEFAULT_VISITOR_SPACE_COLOR,
				image: visitorSpaceResponse.image || '',
				descriptionNl: visitorSpaceResponse.descriptionNl,
				serviceDescriptionNl: visitorSpaceResponse.serviceDescriptionNl,
				descriptionEn: visitorSpaceResponse.descriptionEn,
				serviceDescriptionEn: visitorSpaceResponse.serviceDescriptionEn,
				logo: visitorSpaceResponse.logo,
				file: null,
				slug: visitorSpaceResponse.slug || '',
				name: visitorSpaceResponse.name,
				status: visitorSpaceResponse.status || VisitorSpaceStatus.Requested,
			};
		}
		return null;
	}, [action, visitorSpaceResponse]);

	const showSiteSettings = useHasAllPermission(
		action === 'create' ? Permission.CREATE_SPACES : Permission.UPDATE_ALL_SPACES
	);

	const [formValues, setFormValues] = useState<Partial<CreateVisitorSpaceSettings> | undefined>(
		undefined
	);

	useEffect(() => {
		if (visitorSpace) {
			setFormValues({
				color: visitorSpace.color,
				image: visitorSpace.image,
				descriptionNl: visitorSpace.descriptionNl,
				serviceDescriptionNl: visitorSpace.serviceDescriptionNl,
				descriptionEn: visitorSpace.descriptionEn,
				serviceDescriptionEn: visitorSpace.serviceDescriptionEn,
				slug: visitorSpace.slug,
				orId: visitorSpace.orId,
				file: null,
			});
		}
	}, [visitorSpace]);

	useEffect(() => {
		isErrorContentPartners &&
			toastService.notify({
				maxLines: 3,
				title: tHtml('modules/cp/components/site-settings-form/site-settings-form___error'),
				description: tHtml(
					'modules/cp/components/site-settings-form/site-settings-form___er-ging-iets-mis-bij-het-ophalen-van-de-content-partners'
				),
			});
	}, [contentPartners, isErrorContentPartners, tHtml]);

	const validateForm = useCallback(
		async (
			newFormValues: VisitorSpaceSettingsFormValues | undefined,
			showToasts: boolean
		): Promise<boolean> => {
			try {
				if (!newFormValues) {
					console.log('form is not valid !new form values');
					return false;
				}
				await VISITOR_SPACE_VALIDATION_SCHEMA().validate(newFormValues, {
					strict: true,
				});
				setFormErrors({});
				return true;
			} catch (err) {
				console.log('form is not valid: ' + JSON.stringify(err, null, 2));
				const validationError = err as ValidationError;
				setFormErrors({
					[validationError.path as string]: validationError.message,
				});

				if (showToasts) {
					toastService.notify({
						title: tHtml('Het formulier bevat nog errors'),
						description: validationError.message,
					});
				}
				return false;
			}
		},
		[tHtml]
	);

	/**
	 * Update
	 */

	const updateValues = useCallback(
		async (values: Partial<CreateVisitorSpaceSettings>) => {
			const newFormValues = {
				...(formValues || {}),
				...values,
			} as VisitorSpaceSettingsFormValues;
			setFormValues(newFormValues);
			await validateForm(newFormValues, false);
		},
		[formValues, validateForm]
	);

	const createSpace = useCallback(async () => {
		try {
			// Show errors
			const isFormValid = await validateForm(formValues, true);
			console.log('form is not valid');
			if (isFormValid && !!formValues) {
				console.log('form is valid');
				const response = await VisitorSpaceService.create(formValues);
				if (response === undefined) {
					return;
				}
				toastService.notify({
					maxLines: 3,
					title: tHtml(
						'modules/cp/components/visitor-space-settings/visitor-space-settings___succes'
					),
					description: tHtml(
						'modules/cp/components/visitor-space-settings/visitor-space-settings___de-bezoekersruimte-werd-succesvol-aangemaakt'
					),
				});
				await refetchVisitorSpace();
				await router.replace(
					`/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaceManagement}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaces}/${formValues.slug}`
				);
			}
		} catch (err) {
			await refetchVisitorSpace();

			console.error('Failed to create the visitor space', err);
			toastService.notify({
				title: tHtml('Het opslaan is mislukt'),
				description: tHtml('Het aanmaken van de bezoekersruimte is mislukt.'),
			});
		}
	}, [formValues, locale, refetchVisitorSpace, router, tHtml, validateForm]);

	const updateSpace = useCallback(
		async (values: Partial<UpdateVisitorSpaceSettings>, afterSubmit?: () => void) => {
			try {
				if (visitorSpace?.id && (await validateForm(formValues, true))) {
					const response = await VisitorSpaceService.update(visitorSpace.id, {
						...values,
					});
					if (response === undefined) {
						return;
					}

					afterSubmit?.();

					toastService.notify({
						maxLines: 3,
						title: tHtml('pages/beheer/instellingen/index___succes'),
						description: tHtml(
							'pages/beheer/instellingen/index___de-wijzigingen-werden-succesvol-opgeslagen'
						),
					});

					await refetchVisitorSpace();
					if (!!values.slug && values.slug !== visitorSpace.slug) {
						// Slug was changed, redirect to the new url
						await router.replace(
							`/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaceManagement}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaces}/${values.slug}`
						);
					}
				}
			} catch (err) {
				await refetchVisitorSpace();
				console.error('Failed to update the visitor space', err);
				toastService.notify({
					title: tHtml('Het opslaan is mislukt'),
					description: tHtml('Het updaten van de bezoekersruimte is mislukt.'),
				});
			}
		},
		[
			formValues,
			locale,
			refetchVisitorSpace,
			router,
			tHtml,
			validateForm,
			visitorSpace?.id,
			visitorSpace?.slug,
		]
	);

	/**
	 * Render
	 */

	const renderCancelSaveButtons = useCallback(
		(onCancel: () => void, onSave: () => void) => {
			if (action === 'create') {
				// You can only save the whole page at the top in the header during a create visitor space
				return null;
			}
			// Edit
			return (
				<div className={styles['c-cp-settings__cancel-save']}>
					<Button
						label={tHtml('pages/beheer/instellingen/index___annuleer')}
						variants="text"
						onClick={onCancel}
					/>
					<Button
						label={tHtml('pages/beheer/instellingen/index___bewaar-wijzigingen')}
						variants="black"
						onClick={onSave}
					/>
				</div>
			);
		},
		[action, tHtml]
	);

	const renderRichTextEditorForField = useCallback(
		(
			fieldName:
				| 'descriptionNl'
				| 'descriptionEn'
				| 'serviceDescriptionNl'
				| 'serviceDescriptionEn',
			visible: boolean
		) => {
			return (
				<div style={{ display: visible ? 'block' : 'none' }}>
					<RichTextEditorWithInternalState
						braft={{
							draftProps: {
								ariaDescribedBy: `${labelKeys[fieldName]}__description`,
								ariaLabelledBy: `${labelKeys[fieldName]}__label`,
							},
						}}
						id={labelKeys[fieldName]}
						value={visitorSpace?.[fieldName] ?? '<p></p>'}
						onChange={(value) => updateValues({ [fieldName]: value })}
						className={styles['c-cp-settings__description']}
					/>
				</div>
			);
		},
		[updateValues, visitorSpace]
	);

	const renderedFooter = useMemo(() => {
		if (action === 'edit') {
			return null;
		}
		return (
			<div
				className={clsx(
					adminLayoutStyles['c-admin__actions'],
					styles['c-cp-settings__actions']
				)}
			>
				<Button
					label={tHtml(
						'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/maak/index___annuleren'
					)}
					variants="silver"
					onClick={() =>
						router.push(
							`/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaceManagement}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaces}`
						)
					}
				/>
				<Button
					label={tHtml(
						'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/maak/index___opslaan'
					)}
					variants="black"
					onClick={createSpace}
				/>
			</div>
		);
	}, [action, tHtml, createSpace, router, locale]);

	const renderedHeader = useMemo(() => {
		if (action === 'edit') {
			return null;
		}
		const pageTitle = tText(
			'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/maak/index___nieuwe-bezoekersruimte'
		);
		return (
			<header className={clsx(adminLayoutStyles['c-admin__header'])}>
				<h2 className={adminLayoutStyles['c-admin__page-title']}>
					<label htmlFor={globalLabelKeys.adminLayout.title} title={pageTitle}>
						{pageTitle}
					</label>
				</h2>
				{renderedFooter}
			</header>
		);
	}, [action, renderedFooter, tText]);

	const renderedMaintainerSelectAndSlug: ReactNode | null = useMemo(() => {
		if (!showSiteSettings) {
			return null;
		}
		const selectedMaintainerOption = maintainer
			? { label: maintainer.name, value: maintainer.maintainerId }
			: maintainerOptions.find((maintainer) => maintainer.value === formValues?.orId);
		return (
			<article className={styles['c-cp-settings__setting-block']}>
				<h2 className={styles['c-cp-settings__title']}>
					{tHtml(
						'modules/cp/components/visitor-space-settings/visitor-space-settings___site-instellingen'
					)}
				</h2>
				<Box className={styles['c-cp-settings__box']}>
					<p className={styles['c-cp-settings__description']}>
						{tHtml(
							'modules/cp/components/visitor-space-settings/visitor-space-settings___stel-de-naam-en-de-slug-van-een-bezoekersruimte-in'
						)}
					</p>
					<div
						className={clsx(styles['c-cp-settings__site-settings-controls'], {
							[styles['c-cp-settings__site-settings-controls--create']]:
								action === 'create',
						})}
					>
						<FormControl
							className={styles['c-cp-settings__site-settings-input']}
							errors={formErrors.orId ? [formErrors.orId] : undefined}
							id={labelKeys.orId}
							label={tHtml(
								'modules/cp/components/site-settings-form/site-settings-form___content-partner'
							)}
						>
							<ReactSelect
								isDisabled={action === 'edit'}
								components={{
									IndicatorSeparator: () => null,
								}}
								options={maintainerOptions}
								value={selectedMaintainerOption}
								onChange={async (newValue) => {
									const value = (newValue as SingleValue<SelectOption>)
										?.value as string;
									const slug = kebabCase(
										(newValue as SingleValue<SelectOption>)?.label as string
									);

									if (value !== formValues?.orId || '') {
										updateValues?.({
											orId: value,
											slug: slug,
										});
									}
								}}
							/>
						</FormControl>

						<FormControl
							className={styles['c-cp-settings__site-settings-input']}
							errors={formErrors.slug ? [formErrors.slug] : []}
							id={labelKeys.slug}
							label={tHtml(
								'modules/cp/components/site-settings-form/site-settings-form___slug'
							)}
						>
							<TextInput
								id={labelKeys.slug}
								onChange={(evt) =>
									updateValues({
										slug: evt.currentTarget.value,
									})
								}
								value={formValues?.slug}
							/>
						</FormControl>

						{(formValues?.orId !== visitorSpace?.orId ||
							formValues?.slug !== visitorSpace?.slug) &&
							renderCancelSaveButtons(
								() =>
									updateValues({
										orId: visitorSpace?.orId,
										slug: visitorSpace?.slug,
									}),
								() =>
									action === 'create'
										? createSpace()
										: updateSpace({
												slug: formValues?.slug,
										  })
							)}
					</div>
				</Box>
			</article>
		);
	}, [
		showSiteSettings,
		maintainer,
		maintainerOptions,
		tHtml,
		action,
		formErrors.orId,
		formErrors.slug,
		formValues?.slug,
		formValues?.orId,
		visitorSpace?.orId,
		visitorSpace?.slug,
		renderCancelSaveButtons,
		updateValues,
		createSpace,
		updateSpace,
	]);

	const renderedImageAndColor = useMemo(() => {
		if (!formValues) {
			return null;
		}
		return (
			<article
				className={clsx(
					styles['c-cp-settings__setting-block'],
					styles['c-cp-settings__logo-and-color']
				)}
			>
				<h2 className={styles['c-cp-settings__title']}>
					{tHtml('pages/beheer/instellingen/index___bezoekersruimte')}
				</h2>
				<Box className={styles['c-cp-settings__box']}>
					<p className={styles['c-cp-settings__description']}>
						{tHtml(
							'pages/beheer/instellingen/index___personaliseer-hoe-jouw-bezoekersruimte-in-het-aanbod-mag-verschijnen-op-het-bezoekersruimtes-overzicht-naast-een-standaard-achtergrondkleur-kan-je-ook-een-thematische-achtergrond-afbeelding-instellen'
						)}
					</p>
					<div className={styles['c-cp-settings__logo-and-color__controls']}>
						<CardImage
							className={clsx(
								styles['c-cp-settings__logo-and-color__image'],
								(formValues?.image || formValues?.color) &&
									styles['c-cp-settings__logo-and-color__image--no-border']
							)}
							color={formValues?.color}
							logo={visitorSpace?.logo}
							id={visitorSpace?.id || undefined}
							name={visitorSpace?.name}
							image={formValues?.image}
							size="short"
						/>

						<FormControl
							className={styles['c-cp-settings__logo-and-color__color-control']}
							errors={formErrors.color ? [formErrors.color] : []}
							id={labelKeys.color}
							label={tHtml(
								'modules/cp/components/visitor-space-image-form/visitor-space-image-form___achtergrondkleur'
							)}
						>
							<ColorPicker
								input={{
									id: labelKeys.color,
								}}
								color={formValues?.color ?? ''}
								onChange={(color) => updateValues({ color })}
							/>
						</FormControl>

						<FormControl
							errors={[formErrors.file]}
							id={labelKeys.file}
							label={tHtml(
								'modules/cp/components/visitor-space-image-form/visitor-space-image-form___achtergrond-afbeelding'
							)}
							suffix={
								<span className={styles['c-cp-settings__logo-and-color__hint']}>
									{`(${tHtml(
										'modules/cp/components/visitor-space-image-form/visitor-space-image-form___max-500-kb'
									)})`}
								</span>
							}
						>
							<FileInput
								hasFile={!!formValues?.image}
								id={labelKeys.file}
								onChange={async (e) => {
									const file = e.currentTarget?.files?.[0] || undefined;
									const image = file
										? URL.createObjectURL(file)
										: formValues?.image;
									await updateValues({ file, image });
								}}
								ref={fileInputRef}
							/>

							{formValues?.image && (
								<Button
									label={tHtml(
										'modules/cp/components/visitor-space-image-form/visitor-space-image-form___verwijder-afbeelding'
									)}
									iconStart={<Icon name={IconNamesLight.Trash} />}
									variants="text"
									onClick={() => {
										updateValues({ image: '', file: undefined });
										if (fileInputRef.current) {
											fileInputRef.current.value = '';
										}
									}}
								/>
							)}
						</FormControl>
					</div>
					{(formValues?.color !== visitorSpace?.color ||
						formValues?.file !== visitorSpace?.file ||
						formValues?.image !== visitorSpace?.image) &&
						renderCancelSaveButtons(
							() =>
								updateValues({
									color: visitorSpace?.color,
									file: visitorSpace?.file,
									image: visitorSpace?.image,
								}),
							() => {
								action === 'create'
									? createSpace()
									: updateSpace({
											color: formValues?.color,
											file: formValues?.file,
											image: formValues?.image,
									  });
							}
						)}
				</Box>
			</article>
		);
	}, [
		action,
		createSpace,
		formErrors.color,
		formErrors.file,
		formValues,
		renderCancelSaveButtons,
		tHtml,
		updateSpace,
		updateValues,
		visitorSpace,
	]);

	const renderedDescriptionWaitingForAccess = useMemo(() => {
		if (!visitorSpace) {
			return null;
		}
		const descriptionKey =
			descriptionEditLanguage === Locale.nl
				? labelKeys.descriptionNl
				: labelKeys.descriptionEn;
		return (
			<article className={styles['c-cp-settings__setting-block']}>
				<label htmlFor={descriptionKey} id={`${descriptionKey}__label`}>
					<h2 className={styles['c-cp-settings__title']}>
						{tHtml('pages/beheer/instellingen/index___omschrijving-wachtzaal')}
					</h2>
				</label>

				<Box className={styles['c-cp-settings__box']}>
					<p
						className={styles['c-cp-settings__description']}
						id={`${descriptionKey}__description`}
					>
						{tHtml(
							'pages/beheer/instellingen/index___dit-is-de-wachtzaalomschrijving-die-bezoekers-kunnen-lezen-op-de-detailpagina-van-je-bezoekersruimte-leg-uit-waar-je-bezoekersruimte-om-gaat-welke-info-men-er-kan-vinden-vertel-de-bezoeker-over-je-collectie'
						)}
					</p>

					{/* Disable serverside rendering of rich text editor to conserve RAM on the server */}
					{/* Otherwise we getJavaScript heap out of memory errors */}
					<NoServerSideRendering>
						<Button
							label={tText('Nederlands')}
							className={clsx(styles['c-cp-settings__language-tab'], {
								[styles['c-cp-settings__language-tab--active']]:
									descriptionEditLanguage === Locale.nl,
							})}
							onClick={() => setDescriptionEditLanguage(Locale.nl)}
						/>
						<Button
							label={tText('Engels')}
							className={clsx(styles['c-cp-settings__language-tab'], {
								[styles['c-cp-settings__language-tab--active']]:
									descriptionEditLanguage === Locale.en,
							})}
							onClick={() => setDescriptionEditLanguage(Locale.en)}
						/>
						{renderRichTextEditorForField(
							'descriptionNl',
							descriptionEditLanguage === Locale.nl
						)}
						{renderRichTextEditorForField(
							'descriptionEn',
							descriptionEditLanguage === Locale.en
						)}

						{(!isEqual(formValues?.descriptionNl, visitorSpace.descriptionNl) ||
							!isEqual(formValues?.descriptionEn, visitorSpace.descriptionEn)) &&
							renderCancelSaveButtons(
								() => {
									updateValues({
										descriptionNl: visitorSpace.descriptionNl,
									});
									updateValues({
										descriptionEn: visitorSpace.descriptionEn,
									});
								},
								() =>
									updateSpace({
										descriptionNl: formValues?.descriptionNl,
										descriptionEn: formValues?.descriptionEn,
									})
							)}
					</NoServerSideRendering>
				</Box>
			</article>
		);
	}, [
		descriptionEditLanguage,
		formValues?.descriptionEn,
		formValues?.descriptionNl,
		renderCancelSaveButtons,
		renderRichTextEditorForField,
		tHtml,
		tText,
		updateSpace,
		updateValues,
		visitorSpace,
	]);

	const renderedServiceDescriptionForDuringVisitRequest = useMemo(() => {
		if (!visitorSpace) {
			return null;
		}
		const serviceDescriptionKey =
			serviceDescriptionEditLanguage === Locale.nl
				? labelKeys.descriptionNl
				: labelKeys.descriptionEn;
		return (
			<article className={styles['c-cp-settings__setting-block']}>
				<label htmlFor={serviceDescriptionKey} id={`${serviceDescriptionKey}__label`}>
					<h2 className={styles['c-cp-settings__title']}>
						{tHtml(
							'pages/beheer/instellingen/index___omschrijving-bezoekersruimte-aanvraag'
						)}
					</h2>
				</label>

				<Box className={styles['c-cp-settings__box']}>
					<p
						className={styles['c-cp-settings__description']}
						id={`${serviceDescriptionKey}__description`}
					>
						{tHtml(
							'pages/beheer/instellingen/index___als-bezoekers-een-aanvraag-doen-kunnen-zij-een-klein-tekstje-lezen-met-extra-info-over-het-bezoek-bv-vraag-meer-info-aan-balie-2-bij-aankomst-of-elke-dag-geopend-van-10-00-tot-17-00'
						)}
					</p>

					<NoServerSideRendering>
						<Button
							label={tText('Nederlands')}
							className={clsx(styles['c-cp-settings__language-tab'], {
								[styles['c-cp-settings__language-tab--active']]:
									serviceDescriptionEditLanguage === Locale.nl,
							})}
							onClick={() => setServiceDescriptionEditLanguage(Locale.nl)}
						/>
						<Button
							label={tText('Engels')}
							className={clsx(styles['c-cp-settings__language-tab'], {
								[styles['c-cp-settings__language-tab--active']]:
									serviceDescriptionEditLanguage === Locale.en,
							})}
							onClick={() => setServiceDescriptionEditLanguage(Locale.en)}
						/>
						{renderRichTextEditorForField(
							'serviceDescriptionNl',
							serviceDescriptionEditLanguage === Locale.nl
						)}
						{renderRichTextEditorForField(
							'serviceDescriptionEn',
							serviceDescriptionEditLanguage === Locale.en
						)}

						{(!isEqual(
							formValues?.serviceDescriptionNl,
							visitorSpace.serviceDescriptionNl
						) ||
							!isEqual(
								formValues?.serviceDescriptionEn,
								visitorSpace.serviceDescriptionEn
							)) &&
							renderCancelSaveButtons(
								() => {
									updateValues({
										serviceDescriptionNl: visitorSpace.serviceDescriptionNl,
									});
									updateValues({
										serviceDescriptionEn: visitorSpace.serviceDescriptionEn,
									});
								},
								() =>
									updateSpace({
										serviceDescriptionNl: formValues?.serviceDescriptionNl,
										serviceDescriptionEn: formValues?.serviceDescriptionEn,
									})
							)}
					</NoServerSideRendering>
				</Box>
			</article>
		);
	}, [
		visitorSpace,
		serviceDescriptionEditLanguage,
		tHtml,
		tText,
		renderRichTextEditorForField,
		formValues?.serviceDescriptionNl,
		formValues?.serviceDescriptionEn,
		renderCancelSaveButtons,
		updateValues,
		updateSpace,
	]);

	if (isLoading) {
		return <Loading owner="admin visitor spaces slug page" fullscreen />;
	} else if (visitorSpaceError) {
		return tHtml(
			'pages/beheer/instellingen/index___er-ging-iets-mis-bij-het-ophalen-van-de-instellingen'
		);
	} else {
		return (
			<div className="l-container">
				{renderedHeader}
				{renderedMaintainerSelectAndSlug}
				{renderedImageAndColor}
				{renderedDescriptionWaitingForAccess}
				{renderedServiceDescriptionForDuringVisitRequest}
				{renderedFooter}
			</div>
		);
	}
};

export default VisitorSpaceSettings;
