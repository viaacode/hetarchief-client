import { Box, Button, ColorPicker, RichEditorState } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useState } from 'react';

import { withAuth } from '@auth/wrappers/with-auth';
import { CPAdminLayout } from '@cp/layouts';
import { withI18n } from '@i18n/wrappers';
import { CardImage, Icon } from '@shared/components';
import { RichTextEditor } from '@shared/components/RichTextEditor';
import { createPageTitle } from '@shared/utils';

const CPSettingsPage: NextPage = () => {
	/**
	 * Hooks
	 */
	const { t } = useTranslation();

	/**
	 * Form state
	 */

	// Leeszaal
	const [savedColor, setSavedColor] = useState<string>('#00857d'); // Save unedited state
	const [newColor, setNewColor] = useState<string>('#00857d');

	// Wachtzaal
	const [savedWachtzaalState, setSavedWachtzaalState] = useState<RichEditorState>(); // Save unedited state
	const [newWachtzaalState, setNewWachtzaalState] = useState<RichEditorState>();

	// Aanvraag
	const [savedAanvraagState, setSavedAanvraagState] = useState<RichEditorState>(); // Save unedited state
	const [newAanvraagState, setNewAanvraagState] = useState<RichEditorState>();

	const minWidth = 400;
	const minHeight = 320;

	/**
	 * Helpers
	 */
	const isEqualHtml = (a?: RichEditorState, b?: RichEditorState): boolean => {
		if (!a || !b) {
			return true;
		}

		return a.toHTML() === b.toHTML();
	};

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
								<CardImage
									className="p-cp-settings__leeszaal-image"
									color={newColor}
									logo="/images/logo-shd--small.svg"
									id="placeholder id"
									name={'placeholder name' || ''}
									// image="/images/bg-shd.png"
									size="short"
								/>
								<div className="p-cp-settings__leeszaal-color-picker">
									<p className="p-cp-settings__subtitle">
										{t('Achtergrondkleur')}
									</p>
									<ColorPicker
										color={newColor}
										onChange={(color) => {
											if (!savedColor) {
												console.log(color);

												setSavedColor(color);
											}
											setNewColor(color);
										}}
									/>
								</div>
								<div className="p-cp-settings__leeszaal-image-controls">
									<p className="p-cp-settings__subtitle">
										{t('Achtergrond afbeelding')}
										<span className="p-cp-settings__hint">
											(
											{t(
												'Minimum {{minWidth}}px x {{minHeight}}px, max 500kb.',
												{
													minWidth,
													minHeight,
												}
											)}
											)
										</span>
									</p>
									<div className="p-cp-settings__leeszaal-image-buttons">
										<Button
											label={t('Upload nieuwe afbeelding')}
											variants="outline"
										/>
										<Button
											label={t('Verwijderen')}
											iconStart={<Icon name="trash" />}
											variants="text"
										/>
									</div>
								</div>
							</div>
							{newColor !== savedColor &&
								renderCancelSaveButtons(
									() => setNewColor(savedColor),
									() => setSavedColor(newColor)
								)}
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
							<RichTextEditor
								onChange={(state) => {
									if (!savedWachtzaalState) {
										setSavedWachtzaalState(state);
									}
									setNewWachtzaalState(state);
								}}
								initialHtml={
									'<p><strong>Leeszaal 8</strong></p><p></p><h4><strong>Praktische informatie</strong></h4><p></p><p>In deze leeszaal vind je alles ...</p>'
								}
								state={newWachtzaalState}
							/>
							{!isEqualHtml(newWachtzaalState, savedWachtzaalState) &&
								renderCancelSaveButtons(
									() => setNewWachtzaalState(savedWachtzaalState),
									() => setSavedWachtzaalState(newWachtzaalState)
								)}
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
							<RichTextEditor
								onChange={(state) => {
									if (!savedAanvraagState) {
										setSavedAanvraagState(state);
									}
									setNewAanvraagState(state);
								}}
								initialHtml={
									'<p>Elke dag geopend van 10:00 tot 17:00. Vraag meer info aan balie 2 bij aankomst.</p>'
								}
								state={newAanvraagState}
							/>
							{!isEqualHtml(newAanvraagState, savedAanvraagState) &&
								renderCancelSaveButtons(
									() => setNewAanvraagState(savedAanvraagState),
									() => setSavedAanvraagState(newAanvraagState)
								)}
						</Box>
					</article>
				</div>
			</CPAdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(CPSettingsPage);
