import { Box, Button } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { withAuth } from '@auth/wrappers/with-auth';
import { ReadingRoomSettingsForm, RichTextForm } from '@cp/components';
import { CPAdminLayout } from '@cp/layouts';
import { withI18n } from '@i18n/wrappers';
import { useGetReadingRoomInfo } from '@reading-room/hooks/get-reading-room-info';
import { ReadingRoomService } from '@reading-room/services';
import { UpdateReadingRoomSettings } from '@reading-room/services/reading-room/reading-room.service.types';
import { Loading } from '@shared/components';
import { createPageTitle } from '@shared/utils';

const CPSettingsPage: NextPage = () => {
	/**
	 * Hooks
	 */
	const { t } = useTranslation();

	/**
	 * Data
	 */
	const { data: readingRoomInfo, isLoading } = useGetReadingRoomInfo(
		'52caf5a2-a6d1-4e54-90cc-1b6e5fb66a21'
	);

	const updateSpace = (values: Partial<UpdateReadingRoomSettings>) => {
		if (readingRoomInfo) {
			ReadingRoomService.update('52caf5a2-a6d1-4e54-90cc-1b6e5fb66a21', {
				color: readingRoomInfo.color,
				image: readingRoomInfo.image,
				...values,
			});
		}
	};

	/**
	 * Render
	 */

	const renderCancelSaveButtons = (onCancel: () => void, onSave: () => void) => (
		<div className="p-cp-settings__cancel-save">
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

	return isLoading ? (
		<Loading />
	) : (
		<>
			<Head>
				<title>
					{createPageTitle(
						t('pages/beheer/instellingen/index___beheer-instellingen-title')
					)}
				</title>
				<meta
					name="description"
					content={t(
						'pages/beheer/instellingen/index___beheer-instellingen-meta-omschrijving'
					)}
				/>
			</Head>

			<CPAdminLayout
				className="p-cp-settings"
				contentTitle={t('pages/beheer/instellingen/index___instellingen')}
			>
				<div className="l-container">
					{/* Leeszaal */}
					<article className="p-cp-settings__content-block">
						<h2 className="p-cp-settings__title">
							{t('pages/beheer/instellingen/index___leeszaal')}
						</h2>
						<Box className="p-cp-settings__box">
							<p className="p-cp-settings__description">
								{t(
									'pages/beheer/instellingen/index___personaliseer-hoe-jouw-leeszaal-in-het-aanbod-mag-verschijnen-op-het-leeszalen-overzicht-naast-een-standaard-achtergrondkleur-kan-je-ook-een-thematische-achtergrond-afbeelding-instellen'
								)}
							</p>
							{readingRoomInfo && (
								<ReadingRoomSettingsForm
									className="p-cp-settings__leeszaal-controls"
									room={readingRoomInfo}
									renderCancelSaveButtons={renderCancelSaveButtons}
									onSubmit={(values) => {
										updateSpace(values);
									}}
								/>
							)}
						</Box>
					</article>

					{/* Wachtzaal */}
					<article className="p-cp-settings__content-block">
						<h2 className="p-cp-settings__title">
							{t('pages/beheer/instellingen/index___omschrijving-wachtzaal')}
						</h2>
						<Box className="p-cp-settings__box">
							<p className="p-cp-settings__description">
								{t(
									'pages/beheer/instellingen/index___dit-is-de-wachtzaalomschrijving-die-bezoekers-kunnen-lezen-op-de-detailpagina-van-je-leeszaal-leg-uit-waar-je-leeszaal-om-gaat-welke-info-men-er-kan-vinden-vertel-de-bezoeker-over-je-collectie'
								)}
							</p>
							<RichTextForm
								initialHTML={
									(readingRoomInfo && readingRoomInfo.description) ?? '<p></p>'
								}
								onSubmit={(html) => updateSpace({ description: html })}
								renderCancelSaveButtons={renderCancelSaveButtons}
							/>
						</Box>
					</article>

					{/* Aanvraag */}
					<article className="p-cp-settings__content-block">
						<h2 className="p-cp-settings__title">
							{t('pages/beheer/instellingen/index___omschrijving-leeszaal-aanvraag')}
						</h2>
						<Box className="p-cp-settings__box">
							<p className="p-cp-settings__description">
								{t(
									'pages/beheer/instellingen/index___als-bezoekers-een-aanvraag-doen-kunnen-zij-een-klein-tekstje-lezen-met-extra-info-over-het-bezoek-bv-vraag-meer-info-aan-balie-2-bij-aankomst-of-elke-dag-geopend-van-10-00-tot-17-00'
								)}
							</p>
							<RichTextForm
								className="p-cp-settings__rich-text--no-heading"
								initialHTML={
									(readingRoomInfo && readingRoomInfo.serviceDescription) ??
									'<p></p>'
								}
								onSubmit={(html) => updateSpace({ serviceDescription: html })}
								renderCancelSaveButtons={renderCancelSaveButtons}
							/>
						</Box>
					</article>
				</div>
			</CPAdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(CPSettingsPage);
