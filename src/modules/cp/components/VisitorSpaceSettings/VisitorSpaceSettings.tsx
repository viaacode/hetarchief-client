import { Box, Button, RichTextEditorWithInternalState } from '@meemoo/react-components';
import clsx from 'clsx';
import { isEqual } from 'lodash-es';
import { useRouter } from 'next/router';
import { FC, useEffect, useRef, useState } from 'react';

import { Permission } from '@account/const';
import { Loading } from '@shared/components';
import { globalLabelKeys, ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';
import { Locale } from '@shared/utils';
import { NoServerSideRendering } from '@visitor-space/components/NoServerSideRendering/NoServerSideRendering';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';
import { VisitorSpaceService } from '@visitor-space/services';
import {
	CreateVisitorSpaceSettings,
	UpdateVisitorSpaceSettings,
} from '@visitor-space/services/visitor-space/visitor-space.service.types';

import adminLayoutStyles from '../../../admin/layouts/AdminLayout/AdminLayout.module.scss';
import { SiteSettingsForm } from '../SiteSettingsForm';
import { SiteSettingsFormState } from '../SiteSettingsForm/SiteSettingsForm.types';
import { VisitorSpaceImageForm, VisitorSpaceImageFormState } from '../VisitorSpaceImageForm';

import styles from './VisitorSpaceSettings.module.scss';
import { ValidationRef, VisitorSpaceSettingsProps } from './VisitorSpaceSettings.types';

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
	const {
		data: visitorSpaceResponse,
		isLoading,
		refetch: refetchVisitorSpace,
		error: visitorSpaceError,
	} = useGetVisitorSpace(visitorSpaceSlug as string);

	const emptyVisitorSpace = {
		id: '',
		color: null,
		image: null,
		descriptionNl: null,
		serviceDescriptionNl: null,
		descriptionEn: null,
		serviceDescriptionEn: null,
		logo: '',
		name: '',
		slug: '',
	};

	const visitorSpace = action === 'edit' ? visitorSpaceResponse : emptyVisitorSpace;

	const showSiteSettings = useHasAllPermission(
		action === 'create' ? Permission.CREATE_SPACES : Permission.UPDATE_ALL_SPACES
	);

	const siteSettingsRef = useRef<ValidationRef<SiteSettingsFormState>>(undefined);
	const visitorSpaceImageRef = useRef<ValidationRef<VisitorSpaceImageFormState>>(undefined);

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
				orId: visitorSpace.id,
				file: null,
			});
		}
	}, [visitorSpace]);

	/**
	 * Update
	 */

	const updateValues = (values: Partial<CreateVisitorSpaceSettings>) => {
		if (typeof formValues === 'object' && typeof values === 'object') {
			setFormValues({ ...formValues, ...values });
		} else if (typeof values === 'object') {
			setFormValues(values);
		}
	};

	const createSpace = async () => {
		try {
			// Show errors
			const siteSettingsValid = await siteSettingsRef.current?.validate();
			const visitorSpaceImageValid = await visitorSpaceImageRef.current?.validate();
			if (siteSettingsValid && visitorSpaceImageValid && !!formValues) {
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
				refetchVisitorSpace();
				await router.replace(
					`/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaceManagement}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaces}/${formValues.slug}`
				);
			}
		} catch (err) {
			onFailedRequest(err);
		}
	};

	const onFailedRequest = (err: unknown) => {
		refetchVisitorSpace();

		console.error('Failed to save the visitor space', err);
		toastService.notify({
			maxLines: 3,
			title: tHtml('Het opslaan is mislukt'),
			description: tHtml(
				'pages/beheer/instellingen/index___er-is-een-fout-opgetreden-tijdens-het-opslaan-probeer-opnieuw'
			),
		});
	};

	const updateSpace = async (
		values: Partial<UpdateVisitorSpaceSettings>,
		afterSubmit?: () => void
	) => {
		try {
			if (visitorSpace) {
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

				refetchVisitorSpace();
				if (!!values.slug && values.slug !== visitorSpace.slug) {
					// Slug was changed, redirect to the new url
					await router.replace(
						`/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaceManagement}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaces}/${values.slug}`
					);
				}
			}
		} catch (err) {
			onFailedRequest(err);
		}
	};

	/**
	 * Render
	 */

	const renderCancelSaveButtons = (onCancel: () => void, onSave: () => void) =>
		action === 'edit' ? (
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
		) : null;

	const renderRichTextEditorForField = (
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
	};

	const pageTitle = tText(
		'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/maak/index___nieuwe-bezoekersruimte'
	);
	const descriptionKey =
		descriptionEditLanguage === Locale.nl ? labelKeys.descriptionNl : labelKeys.descriptionEn;
	const serviceDescriptionKey =
		serviceDescriptionEditLanguage === Locale.nl
			? labelKeys.descriptionNl
			: labelKeys.descriptionEn;
	const renderPageContent = () => {
		if (!visitorSpace) {
			return null;
		}
		return (
			<div>
				{action === 'create' && (
					<header className={clsx(adminLayoutStyles['c-admin__header'])}>
						<h2 className={adminLayoutStyles['c-admin__page-title']}>
							<label htmlFor={globalLabelKeys.adminLayout.title} title={pageTitle}>
								{pageTitle}
							</label>
						</h2>
						<div className={adminLayoutStyles['c-admin__actions']}>
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
					</header>
				)}

				{/* Site instellingen */}
				{/* TODO: permission */}
				{showSiteSettings && (
					<article className={styles['c-cp-settings__content-block']}>
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
							{visitorSpace && (
								<SiteSettingsForm
									ref={siteSettingsRef}
									className={styles['c-cp-settings__site-settings-controls']}
									space={visitorSpace}
									renderCancelSaveButtons={renderCancelSaveButtons}
									onSubmit={async (values, afterSubmit) => {
										await updateSpace(values, afterSubmit);
									}}
									onUpdate={action === 'create' ? updateValues : undefined}
									disableDropdown={action === 'edit'}
								/>
							)}
						</Box>
					</article>
				)}

				{/* Visitor space logo and color */}
				<article className={styles['c-cp-settings__content-block']}>
					<h2 className={styles['c-cp-settings__title']}>
						{tHtml('pages/beheer/instellingen/index___bezoekersruimte')}
					</h2>
					<Box className={styles['c-cp-settings__box']}>
						<p className={styles['c-cp-settings__description']}>
							{tHtml(
								'pages/beheer/instellingen/index___personaliseer-hoe-jouw-bezoekersruimte-in-het-aanbod-mag-verschijnen-op-het-bezoekersruimtes-overzicht-naast-een-standaard-achtergrondkleur-kan-je-ook-een-thematische-achtergrond-afbeelding-instellen'
							)}
						</p>
						{visitorSpace && (
							<VisitorSpaceImageForm
								ref={visitorSpaceImageRef}
								className={styles['c-cp-settings__bezoekersruimte-controls']}
								room={visitorSpace}
								renderCancelSaveButtons={renderCancelSaveButtons}
								onSubmit={async (values, afterSubmit) => {
									await updateSpace(values, afterSubmit);
								}}
								onUpdate={action === 'create' ? updateValues : undefined}
							/>
						)}
					</Box>
				</article>

				{/* Description for waiting for access to visitor space */}
				<article className={styles['c-cp-settings__content-block']}>
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

				{/* Description during request access to visitor space */}
				<article className={styles['c-cp-settings__content-block']}>
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
			</div>
		);
	};

	if (isLoading) {
		return <Loading owner="admin visitor spaces slug page" fullscreen />;
	} else if (visitorSpaceError) {
		return tHtml(
			'pages/beheer/instellingen/index___er-ging-iets-mis-bij-het-ophalen-van-de-instellingen'
		);
	} else {
		return <div className="l-container">{renderPageContent()}</div>;
	}
};

export default VisitorSpaceSettings;
