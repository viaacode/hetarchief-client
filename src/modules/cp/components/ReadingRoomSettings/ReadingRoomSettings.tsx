import { Box, Button } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { VistorSpaceService } from '@reading-room/services';
import { UpdateReadingRoomSettings } from '@reading-room/services/visitor-space/visitor-space.service.types';
import { toastService } from '@shared/services/toast-service';

import { ReadingRoomImageForm } from '../ReadingRoomImageForm';
import { RichTextForm } from '../RichTextForm';

import styles from './ReadingRoomSettings.module.scss';
import { ReadingRoomSettingsProps } from './ReadingRoomSettings.types';

const ReadingRoomSettings: FC<ReadingRoomSettingsProps> = ({ className, room, refetch }) => {
	const { t } = useTranslation();

	/**
	 * Update
	 */

	const onFailedRequest = () => {
		refetch();

		toastService.notify({
			maxLines: 3,
			title: t('pages/beheer/instellingen/index___⚠️-er-ging-iets-mis'),
			description: t(
				'pages/beheer/instellingen/index___er-is-een-fout-opgetreden-tijdens-het-opslaan-probeer-opnieuw'
			),
		});
	};

	const updateSpace = (values: Partial<UpdateReadingRoomSettings>, afterSubmit?: () => void) => {
		if (room) {
			VistorSpaceService.update(room.id, {
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
	 * Render
	 */

	const renderCancelSaveButtons = (onCancel: () => void, onSave: () => void) => (
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
	);

	return (
		<div className={className}>
			{/* Bezoekersruimte */}
			<article className={styles['c-cp-settings__content-block']}>
				<h2 className={styles['c-cp-settings__title']}>
					{t('pages/beheer/instellingen/index___bezoekersruimte')}
				</h2>
				<Box className={styles['c-cp-settings__box']}>
					<p className={styles['c-cp-settings__description']}>
						{t(
							'pages/beheer/instellingen/index___personaliseer-hoe-jouw-bezoekersruimte-in-het-aanbod-mag-verschijnen-op-het-leeszalen-overzicht-naast-een-standaard-achtergrondkleur-kan-je-ook-een-thematische-achtergrond-afbeelding-instellen'
						)}
					</p>
					{room && (
						<ReadingRoomImageForm
							className={styles['c-cp-settings__bezoekersruimte-controls']}
							room={room}
							renderCancelSaveButtons={renderCancelSaveButtons}
							onSubmit={(values, afterSubmit) => {
								updateSpace(values, afterSubmit);
							}}
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
					/>
				</Box>
			</article>
		</div>
	);
};

export default ReadingRoomSettings;
