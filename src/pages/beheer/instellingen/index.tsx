import { Box, Button } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { withAuth } from '@auth/wrappers/with-auth';
import { ReadingRoomSettingsForm, RichTextForm } from '@cp/components';
import { CPAdminLayout } from '@cp/layouts';
import { withI18n } from '@i18n/wrappers';
import { createPageTitle } from '@shared/utils';

const CPSettingsPage: NextPage = () => {
	/**
	 * Hooks
	 */
	const { t } = useTranslation();

	/**
	 * Render
	 */

	const renderCancelSaveButtons = (onCancel: () => void, onSave: () => void) => (
		<div className="p-cp-settings__cancel-save">
			<Button label={t('Annuleer')} variants="text" onClick={onCancel} />
			<Button label={t('Bewaar wijzigingen')} variants="black" onClick={onSave} />
		</div>
	);

	return (
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
						<h2 className="p-cp-settings__title">{t('Leeszaal')}</h2>
						<Box className="p-cp-settings__box">
							<p className="p-cp-settings__description">
								{t(
									'Personaliseer hoe jouw leeszaal in het aanbod mag verschijnen op het Leeszalen overzicht. Naast een standaard achtergrondkleur kan je ook een thematische achtergrond afbeelding instellen.'
								)}
							</p>
							<div className="p-cp-settings__leeszaal-controls">
								<ReadingRoomSettingsForm
									renderCancelSaveButtons={renderCancelSaveButtons}
								/>
							</div>
						</Box>
					</article>

					{/* Wachtzaal */}
					<article className="p-cp-settings__content-block">
						<h2 className="p-cp-settings__title">{t('Omschrijving wachtzaal')}</h2>
						<Box className="p-cp-settings__box">
							<p className="p-cp-settings__description">
								{t(
									'Dit is de wachtzaalomschrijving die bezoekers kunnen lezen op de detailpagina van je leeszaal. Leg uit waar je leeszaal om gaat, welke info men er kan vinden, vertel de bezoeker over je collectie.'
								)}
							</p>
							<RichTextForm
								onSubmit={(html) => console.log(html)}
								renderCancelSaveButtons={renderCancelSaveButtons}
							/>
						</Box>
					</article>

					{/* Aanvraag */}
					<article className="p-cp-settings__content-block">
						<h2 className="p-cp-settings__title">
							{t('Omschrijving leeszaal aanvraag')}
						</h2>
						<Box className="p-cp-settings__box">
							<p className="p-cp-settings__description">
								{t(
									'Als bezoekers een aanvraag doen, kunnen zij een klein tekstje lezen met extra info over het bezoek. Bv: “Vraag meer info aan balie 2 bij aankomst.” of “Elke dag geopend van 10:00 tot 17:00.”'
								)}
							</p>
							<RichTextForm
								onSubmit={(html) => console.log(html)}
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
