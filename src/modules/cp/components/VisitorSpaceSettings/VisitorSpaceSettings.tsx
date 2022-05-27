import { Box, Button } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { Permission } from '@account/const';
import { RichTextForm } from '@shared/components/RichTextForm';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { toastService } from '@shared/services/toast-service';
import { VisitorSpaceService } from '@visitor-space/services';
import {
	CreateVisitorSpaceSettings,
	UpdateVisitorSpaceSettings,
} from '@visitor-space/services/visitor-space/visitor-space.service.types';

import { SiteSettingsForm } from '../SiteSettingsForm';
import { SiteSettingsFormState } from '../SiteSettingsForm/SiteSettingsForm.types';
import { VisitorSpaceImageForm, VisitorSpaceImageFormState } from '../VisitorSpaceImageForm';

import styles from './VisitorSpaceSettings.module.scss';
import { ValidationRef, VisitorSpaceSettingsProps } from './VisitorSpaceSettings.types';

const VisitorSpaceSettings = forwardRef<
	{ createSpace: () => void } | undefined,
	VisitorSpaceSettingsProps
>(({ className, room, refetch, action = 'edit' }, ref) => {
	const { t } = useTranslation();

	const showSiteSettings = useHasAllPermission(
		action === 'create' ? Permission.CREATE_SPACES : Permission.UPDATE_ALL_SPACES
	);

	const siteSettingsRef = useRef<ValidationRef<SiteSettingsFormState>>(undefined);
	const visitorSpaceImageRef = useRef<ValidationRef<VisitorSpaceImageFormState>>(undefined);

	const [formValues, setFormValues] = useState<Partial<CreateVisitorSpaceSettings> | undefined>(
		undefined
	);

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
		// Show errors
		const siteSettingsValid = await siteSettingsRef.current?.validate();
		const visitorSpaceImageValid = await visitorSpaceImageRef.current?.validate();
		if (siteSettingsValid && visitorSpaceImageValid && !!formValues) {
			VisitorSpaceService.create(formValues)
				.catch(onFailedRequest)
				.then((response) => {
					if (response === undefined) {
						return;
					}
					// afterSubmit?.();
					toastService.notify({
						maxLines: 3,
						title: t(
							'modules/cp/components/visitor-space-settings/visitor-space-settings___succes'
						),
						description: t(
							'modules/cp/components/visitor-space-settings/visitor-space-settings___de-bezoekersruimte-werd-succesvol-aangemaakt'
						),
					});
				});
		}
	};

	const onFailedRequest = () => {
		refetch?.();

		toastService.notify({
			maxLines: 3,
			title: t('pages/beheer/instellingen/index___⚠️-er-ging-iets-mis'),
			description: t(
				'pages/beheer/instellingen/index___er-is-een-fout-opgetreden-tijdens-het-opslaan-probeer-opnieuw'
			),
		});
	};

	const updateSpace = (values: Partial<UpdateVisitorSpaceSettings>, afterSubmit?: () => void) => {
		if (room) {
			VisitorSpaceService.update(room.id, {
				color: room.color,
				image: room.image,
				...values,
			})
				.catch(onFailedRequest)
				.then((response) => {
					if (response === undefined) {
						return;
					}

					afterSubmit?.();

					toastService.notify({
						maxLines: 3,
						title: t('pages/beheer/instellingen/index___succes'),
						description: t(
							'pages/beheer/instellingen/index___de-wijzigingen-werden-succesvol-opgeslagen'
						),
					});
				});
		}
	};

	/**
	 * Expose create function to parent
	 */

	useImperativeHandle(ref, () => ({
		createSpace,
	}));

	/**
	 * Render
	 */

	const renderCancelSaveButtons = (onCancel: () => void, onSave: () => void) =>
		action === 'edit' ? (
			<div className={styles['c-cp-settings__cancel-save']}>
				<Button
					label={t('pages/beheer/instellingen/index___annuleer')}
					variants="text"
					onClick={onCancel}
				/>
				<Button
					label={t('pages/beheer/instellingen/index___bewaar-wijzigingen')}
					variants="black"
					onClick={onSave}
				/>
			</div>
		) : null;

	return (
		<div className={className}>
			{/* Site instellingen */}
			{/* TODO: permission */}
			{showSiteSettings && (
				<article className={styles['c-cp-settings__content-block']}>
					<h2 className={styles['c-cp-settings__title']}>
						{t(
							'modules/cp/components/visitor-space-settings/visitor-space-settings___site-instellingen'
						)}
					</h2>
					<Box className={styles['c-cp-settings__box']}>
						<p className={styles['c-cp-settings__description']}>
							{t(
								'modules/cp/components/visitor-space-settings/visitor-space-settings___stel-de-naam-en-de-slug-van-een-bezoekersruimte-in'
							)}
						</p>
						{room && (
							<SiteSettingsForm
								ref={siteSettingsRef}
								className={styles['c-cp-settings__site-settings-controls']}
								space={room}
								renderCancelSaveButtons={renderCancelSaveButtons}
								onSubmit={(values, afterSubmit) => {
									updateSpace(values, afterSubmit);
								}}
								onUpdate={action === 'create' ? updateValues : undefined}
								disableDropdown={action === 'edit'}
							/>
						)}
					</Box>
				</article>
			)}

			{/* Bezoekersruimte */}
			<article className={styles['c-cp-settings__content-block']}>
				<h2 className={styles['c-cp-settings__title']}>
					{t('pages/beheer/instellingen/index___bezoekersruimte')}
				</h2>
				<Box className={styles['c-cp-settings__box']}>
					<p className={styles['c-cp-settings__description']}>
						{t(
							'pages/beheer/instellingen/index___personaliseer-hoe-jouw-bezoekersruimte-in-het-aanbod-mag-verschijnen-op-het-bezoekersruimtes-overzicht-naast-een-standaard-achtergrondkleur-kan-je-ook-een-thematische-achtergrond-afbeelding-instellen'
						)}
					</p>
					{room && (
						<VisitorSpaceImageForm
							ref={visitorSpaceImageRef}
							className={styles['c-cp-settings__bezoekersruimte-controls']}
							room={room}
							renderCancelSaveButtons={renderCancelSaveButtons}
							onSubmit={(values, afterSubmit) => {
								updateSpace(values, afterSubmit);
							}}
							onUpdate={action === 'create' ? updateValues : undefined}
						/>
					)}
				</Box>
			</article>

			{/* Wachtzaal */}
			<article className={styles['c-cp-settings__content-block']}>
				<h2 className={styles['c-cp-settings__title']}>
					{t('pages/beheer/instellingen/index___omschrijving-wachtzaal')}
				</h2>
				<Box className={styles['c-cp-settings__box']}>
					<p className={styles['c-cp-settings__description']}>
						{t(
							'pages/beheer/instellingen/index___dit-is-de-wachtzaalomschrijving-die-bezoekers-kunnen-lezen-op-de-detailpagina-van-je-bezoekersruimte-leg-uit-waar-je-bezoekersruimte-om-gaat-welke-info-men-er-kan-vinden-vertel-de-bezoeker-over-je-collectie'
						)}
					</p>
					<RichTextForm
						initialHTML={(room && room.description) ?? '<p></p>'}
						onSubmit={(html, afterSubmit) =>
							updateSpace({ description: html }, afterSubmit)
						}
						renderCancelSaveButtons={renderCancelSaveButtons}
						onUpdate={
							action === 'create'
								? (value) => updateValues({ description: value })
								: undefined
						}
					/>
				</Box>
			</article>

			{/* Aanvraag */}
			<article className={styles['c-cp-settings__content-block']}>
				<h2 className={styles['c-cp-settings__title']}>
					{t('pages/beheer/instellingen/index___omschrijving-bezoekersruimte-aanvraag')}
				</h2>
				<Box className={styles['c-cp-settings__box']}>
					<p className={styles['c-cp-settings__description']}>
						{t(
							'pages/beheer/instellingen/index___als-bezoekers-een-aanvraag-doen-kunnen-zij-een-klein-tekstje-lezen-met-extra-info-over-het-bezoek-bv-vraag-meer-info-aan-balie-2-bij-aankomst-of-elke-dag-geopend-van-10-00-tot-17-00'
						)}
					</p>
					<RichTextForm
						className={styles['c-cp-settings__rich-text--no-heading']}
						initialHTML={(room && room.serviceDescription) ?? '<p></p>'}
						onSubmit={(html, afterSubmit) =>
							updateSpace({ serviceDescription: html }, afterSubmit)
						}
						renderCancelSaveButtons={renderCancelSaveButtons}
						onUpdate={
							action === 'create'
								? (value) => updateValues({ serviceDescription: value })
								: undefined
						}
					/>
				</Box>
			</article>
		</div>
	);
});

VisitorSpaceSettings.displayName = 'VisitorSpaceSettings';

export default VisitorSpaceSettings;
