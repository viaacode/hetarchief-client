import { GroupName } from '@account/const';
import Metadata from '@ie-objects/components/Metadata/Metadata';
import { renderSimpleMetadataField as renderSimpleMetadataFieldBase } from '@ie-objects/components/Metadata/render-simple-metadata-field';
import { NamesList } from '@ie-objects/components/NamesList/NamesList';
import { ObjectDetailPageMetadataDisclaimerTooltip } from '@ie-objects/components/ObjectDetailPageMetadataTab/ObjectDetailPageMetadataDisclaimerTooltip';
import type { ObjectDetailPageMetadataTabProps } from '@ie-objects/components/ObjectDetailPageMetadataTab/ObjectDetailPageMetadataTab.types';
import { SearchLinkTag } from '@ie-objects/components/SearchLinkTag/SearchLinkTag';
import { renderAbrahamLink, renderDate, renderIsPartOfValue } from '@ie-objects/ie-objects.consts';
import { getFirstMentionHighlight } from '@ie-objects/utils/get-first-mention-highlight';
import { getIeObjectProviderIdentifierLinkProps } from '@ie-objects/utils/get-ie-object-provider-identifier-link-props';
import { getIeObjectSourceAttribution } from '@ie-objects/utils/get-ie-object-source-attribution';
import {
	mapArrayToMetadataData,
	mapObjectOrArrayToMetadata,
	mapObjectsToMetadata,
} from '@ie-objects/utils/map-metadata';
import type { TextLine } from '@iiif-viewer/IiifViewer.types';
import { isNewspaperType } from '@meemoo/admin-core-ui/admin';
import { Alert } from '@meemoo/react-components';
import { CopyButton } from '@shared/components/CopyButton';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { getSearchLink } from '@shared/helpers/get-search-link';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { formatDateTime } from '@shared/utils/dates';
import {
	type HetArchiefIeObject,
	HetArchiefIsPartOfKey,
	type HetArchiefMention,
} from '@viaa/avo2-types';
import {
	LANGUAGES,
	type LanguageCode,
} from '@visitor-space/components/LanguageFilterForm/languages';
import { SearchFilterId } from '@visitor-space/types';
import { compact, isEmpty, isNil } from 'es-toolkit/compat';
import React, { type FC, type ReactNode, useCallback, useMemo } from 'react';
import MetadataList from '../Metadata/MetadataList';
import styles from './ObjectDetailPageMetadataTab.module.scss';

// const { publicRuntimeConfig } = getConfig();

export const ObjectDetailPageMetadataTab: FC<ObjectDetailPageMetadataTabProps> = ({
	mediaInfo,
	currentPage,
	goToPage,
	activeFile,
	simplifiedAltoInfo,
	iiifZoomTo,
	setActiveMentionHighlights,
	setIsTextOverlayVisible,
	onReadMoreClicked,
}) => {
	const locale = useLocale();

	/**
	 * Content
	 */

	const isNewspaper = isNewspaperType(mediaInfo?.dctermsFormat);

	/**
	 * User
	 */

	const isKiosk = useHasAnyGroup(GroupName.KIOSK_VISITOR);

	const zoomToName = useCallback(
		(mention: HetArchiefMention) => {
			const firstHighlight = getFirstMentionHighlight(mention.highlights);

			if (!firstHighlight) {
				return;
			}

			// Show the highlights on the iiif viewer newspaper image
			setIsTextOverlayVisible(true);

			// Highlight the words in the mention name
			const highlights = mention.highlights.map((highlight): TextLine => {
				return {
					text: mention.name,
					x: highlight.x,
					y: highlight.y,
					width: highlight.width,
					height: highlight.height,
				};
			});
			setActiveMentionHighlights({
				pageIndex: mention.pageIndex,
				highlights,
			});

			// Zoom to first word in mention name
			const x = firstHighlight.x + firstHighlight.width / 2;
			const y = firstHighlight.y + firstHighlight.height / 2;
			iiifZoomTo(x, y);
		},
		[iiifZoomTo, setActiveMentionHighlights, setIsTextOverlayVisible]
	);

	const handleZoomToMention = useCallback(
		(mention: HetArchiefMention) => {
			if (!currentPage) {
				return;
			}

			if (mention.pageNumber !== currentPage.pageNumber) {
				// Switch to the correct page first
				goToPage(mention.pageIndex);

				// Wait for page load
				setTimeout(() => {
					zoomToName(mention);
				}, 1000);
			} else {
				// Already on the correct page => zoom to highlight
				zoomToName(mention);
			}
		},
		[currentPage, zoomToName, goToPage]
	);

	const renderSimpleMetadataField = (
		title: string,
		data: string | ReactNode | null | undefined
	): ReactNode => renderSimpleMetadataFieldBase(title, data, onReadMoreClicked);

	/*
	const renderPermalink = (schemaIdentifier: string | undefined): ReactNode => {
		if (!schemaIdentifier) {
			return null;
		}
		const permalink = `${publicRuntimeConfig.CLIENT_URL}/${locale}${ROUTES_BY_LOCALE[locale].permalink.replace(':pid', schemaIdentifier)}`;
		return (
			<a href={permalink} target="_blank" rel="noreferrer">
				{permalink}
			</a>
		);
	};
	 */

	const renderProviderIdentifier = (mediaInfo: HetArchiefIeObject): ReactNode => {
		const linkProps = getIeObjectProviderIdentifierLinkProps(mediaInfo, isKiosk);

		if (!linkProps) {
			return null;
		}

		if (!linkProps.href) {
			return linkProps.label;
		}

		return (
			<a
				className={styles['p-object-detail__provider-identifier-link']}
				href={linkProps.href}
				target="_blank"
				rel="noreferrer"
			>
				{linkProps.label}
			</a>
		);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want this translation to be recalculated when the language is changed
	const explainNamesListLink = useMemo(
		() => (
			<div className="u-color-neutral u-font-size-14 u-font-weight-400">
				{tHtml(
					'modules/ie-objects/object-detail-page___a-href-namenlijst-gesneuvelden-wat-is-dit-a'
				)}
			</div>
		),
		[locale]
	);

	const renderSourceAttributionDisclaimerTooltip = () => (
		<ObjectDetailPageMetadataDisclaimerTooltip
			iconName={IconNamesLight.Console}
			position="left"
			className={styles['p-object-detail__source-attribution-info']}
			ariaLabel={tText(
				'modules/ie-objects/object-detail-page___deze-bronvermelding-is-automatisch-gegenereerd-en-kan-fouten-bevatten-a-href-bronvermelding-fouten-meer-info-a'
			)}
			content={tHtml(
				'modules/ie-objects/object-detail-page___deze-bronvermelding-is-automatisch-gegenereerd-en-kan-fouten-bevatten-a-href-bronvermelding-fouten-meer-info-a'
			)}
		/>
	);

	const renderRightsAttributionText = (rightsAttributionText: string | null) => {
		if (!rightsAttributionText) {
			return null;
		}

		return (
			<Metadata
				title={tHtml('modules/ie-objects/object-detail-page___bronvermelding')}
				key="metadata-source-attribution"
				renderedTitleRight={
					<div className="u-flex u-flex-row">
						<CopyButton
							text={rightsAttributionText}
							title={tText(
								'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata___kopieer-de-bronvermelding-naar-je-klembord'
							)}
							className={styles['p-object-detail__icon-button']}
							variants={['white']}
						/>
						{renderSourceAttributionDisclaimerTooltip()}
					</div>
				}
				className="u-bt-0"
			>
				<span>{rightsAttributionText}</span>
			</Metadata>
		);
	};

	const renderMetaData = () => {
		if (isNil(mediaInfo)) {
			return;
		}

		const rightsAttributionText = getIeObjectSourceAttribution(mediaInfo, locale);

		return (
			<div className={styles['p-object-detail__metadata-wrapper']}>
				<div className={styles['p-object-detail__metadata-content']}>
					{renderRightsAttributionText(rightsAttributionText)}
				</div>

				<MetadataList allowTwoColumns={true} noDivider={!rightsAttributionText}>
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___bronvermelding'),
						rightsAttributionText ? undefined : mediaInfo?.creditText
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___pid'),
						mediaInfo.schemaIdentifier
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___abraham-id'),
						renderAbrahamLink(mediaInfo?.abrahamInfo)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___identifier-bij-aanbieder'),
						renderProviderIdentifier(mediaInfo)
					)}
					{mapObjectsToMetadata(
						mediaInfo.premisIdentifier?.filter(
							(premisEntry) => !['abraham_id', 'abraham_uri'].includes(Object.keys(premisEntry)[0])
						),
						tText('modules/ie-objects/ie-objects___premis-identifier')
					).map((info) => renderSimpleMetadataField(info.title, info.data))}
					{/* Permanente URL (field 5): the place is reserved, but it is not shown yet */}
					{/*{renderSimpleMetadataField(*/}
					{/*	tText('modules/ie-objects/ie-objects___permanente-url'),*/}
					{/*	renderPermalink(mediaInfo.schemaIdentifier)*/}
					{/*)}*/}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___editie-nummer'),
						mediaInfo.issueNumber
					)}
					{mapObjectOrArrayToMetadata(
						mediaInfo.creator,
						tText('modules/ie-objects/ie-objects___maker')
					).map((info) => renderSimpleMetadataField(info.title, info.data))}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___cast'),
						mediaInfo.meemooDescriptionCast
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___creatiedatum'),
						mediaInfo.dateCreated
							? formatDateTime(new Date(mediaInfo.dateCreated), locale, 'short', false)
							: null
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___uitgebreide-beschrijving'),
						mediaInfo?.abstract ? mediaInfo?.abstract : null
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___plaats-van-uitgave'),
						mediaInfo.locationCreated
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___locatie-van-de-inhoud'),
						mapArrayToMetadataData(mediaInfo.spatial)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___tijdsperiode-van-de-inhoud'),
						mapArrayToMetadataData(mediaInfo.temporal)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___duurtijd'),
						mediaInfo.duration
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___categorie'),
						!isEmpty(mediaInfo.genre) ? (
							<div className={styles['p-object-detail__metadata-category-tags']}>
								{mediaInfo.genre.map((genre) => (
									<SearchLinkTag
										key={genre}
										label={genre}
										link={getSearchLink(locale, { [SearchFilterId.Genre]: genre })}
									/>
								))}
							</div>
						) : null
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___taal'),
						mapArrayToMetadataData(
							mediaInfo.inLanguage?.map(
								(languageCode) => LANGUAGES[locale][languageCode as LanguageCode] || languageCode
							)
						)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___alternatieve-titels'),
						mapArrayToMetadataData(mediaInfo.alternativeTitle)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___programma'),
						renderIsPartOfValue(mediaInfo.isPartOf, HetArchiefIsPartOfKey.program)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___programmabeschrijving'),
						mediaInfo.synopsis
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___publicatietype'),
						mediaInfo.bibframeEdition
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___gerelateerde-titels'),
						mapArrayToMetadataData([
							...(mediaInfo?.preceededBy || []),
							...(mediaInfo?.succeededBy || []),
						])
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___periode-van-uitgave'),
						compact([mediaInfo.startDate, mediaInfo.endDate]).join(' - ')
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___uitgevers-van-krant'),
						mediaInfo?.newspaperPublisher
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___aantal-paginas'),
						isNil(mediaInfo?.numberOfPages) ? null : String(mediaInfo.numberOfPages)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___paginanummer'),
						mediaInfo?.pageNumber
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___afmetingen-in-cm'),
						(mediaInfo?.width
							? tText('modules/ie-objects/ie-objects___breedte') + mediaInfo?.width
							: '') +
							(mediaInfo?.height
								? ` ${tText('modules/ie-objects/ie-objects___hoogte')}${mediaInfo?.height}`
								: '') || null
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___ocr-software'),
						simplifiedAltoInfo?.description.softwareName
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___ocr-software-version'),
						simplifiedAltoInfo?.description.softwareVersion
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___ocr-software-maker'),
						simplifiedAltoInfo?.description.softwareCreator
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___ocr-gemaakt-op'),
						simplifiedAltoInfo?.description.processingDateTime
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___ocr-betrouwbaarheid'),
						simplifiedAltoInfo?.description.processingStepSettings
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___scanresolutie'),
						simplifiedAltoInfo?.description.width || simplifiedAltoInfo?.description.height
							? [
									simplifiedAltoInfo?.description.width,
									simplifiedAltoInfo?.description.height,
								].join(' x ')
							: null
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___teksttype'),
						mediaInfo.bibframeProductionMethod
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___serie'),
						renderIsPartOfValue(mediaInfo.isPartOf, HetArchiefIsPartOfKey.series)
					)}
					{renderSimpleMetadataField(
						tText(
							'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata___seizoen'
						),
						renderIsPartOfValue(mediaInfo.isPartOf, HetArchiefIsPartOfKey.season)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___seizoennummer'),
						mediaInfo.collectionSeasonNumber
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___episode'),
						renderIsPartOfValue(mediaInfo.isPartOf, HetArchiefIsPartOfKey.episode)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___fysieke-drager'),
						mapArrayToMetadataData(mediaInfo.dctermsMedium)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___media-type'),
						mediaInfo.dctermsFormat
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___bestandstype'),
						activeFile?.mimeType
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___bestandsnaam'),
						activeFile?.name
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___datum-drager'),
						mediaInfo.carrierDate
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___digitaliseringsdatum'),
						mediaInfo.digitizationDate
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___datum-toegevoegd-aan-platform'),
						renderDate(activeFile?.createdAt)
					)}

					<Alert
						content={
							<div className={styles['p-object-detail__disclaimer']}>
								{tHtml(
									'modules/ie-objects/components/object-detail-page-metadata-tab/object-detail-page-metadata-tab___metadata-worden-aangeleverd-door-partners-van-meemoo-meemoo-is-niet-verantwoordelijk-voor-onjuistheden-of-onvolledigheden-in-deze-gegevens-meer-info'
								)}
								<Icon name={IconNamesLight.Metadata} aria-hidden className="u-font-size-24" />
							</div>
						}
					/>

					{/*
					 * Fields not listed in the FA's field order - kept here, commented out,
					 * pending confirmation of where they should go.
					 */}
					{/*{renderSimpleMetadataField(*/}
					{/*	tText('modules/ie-objects/ie-objects___rechtenstatus'),*/}
					{/*	mediaInfo?.copyrightNotice*/}
					{/*)}*/}
					{/*{renderSimpleMetadataField(*/}
					{/*	tText('modules/ie-objects/ie-objects___transcriptie'),*/}
					{/*	mediaInfo?.transcript*/}
					{/*)}*/}
					{/*{mapObjectOrArrayToMetadata(*/}
					{/*	Array.isArray(mediaInfo.publisher?.[0])*/}
					{/*		? mediaInfo.publisher?.[0]*/}
					{/*		: mediaInfo.publisher,*/}
					{/*	tText('modules/ie-objects/ie-objects___uitgever')*/}
					{/*).map((info) => renderSimpleMetadataField(info.title, info.data))}*/}
					{/*{renderSimpleMetadataField(*/}
					{/*	tText('modules/ie-objects/const/index___oorsprong'),*/}
					{/*	mediaInfo.meemooOriginalCp*/}
					{/*)}*/}
					{/*{renderSimpleMetadataField(*/}
					{/*	tText('modules/ie-objects/const/index___archief'),*/}
					{/*	renderIsPartOfValue(mediaInfo.isPartOf, HetArchiefIsPartOfKey.archive)*/}
					{/*)}*/}
					{/*{renderSimpleMetadataField(*/}
					{/*	tText('modules/ie-objects/const/index___objecttype'),*/}
					{/*	mediaInfo.ebucoreObjectType*/}
					{/*)}*/}
				</MetadataList>

				<MetadataList allowTwoColumns={false}>
					{isNewspaper && !!mediaInfo?.mentions?.length && (
						<Metadata
							title={tText('modules/ie-objects/object-detail-page___namenlijst')}
							key="metadata-fallen-names-list"
							renderedTitleRight={explainNamesListLink}
						>
							<NamesList
								mentions={mediaInfo?.mentions || []}
								onZoomToMention={handleZoomToMention}
							/>
						</Metadata>
					)}
				</MetadataList>
			</div>
		);
	};

	return renderMetaData();
};
