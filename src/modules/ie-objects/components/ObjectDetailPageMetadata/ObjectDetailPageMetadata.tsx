import { GroupName, Permission } from '@account/const';
import { selectUser } from '@auth/store/user';
import type { User } from '@auth/types';
import Metadata from '@ie-objects/components/Metadata/Metadata';
import type { MetadataItem } from '@ie-objects/components/Metadata/Metadata.types';
import { NamesList } from '@ie-objects/components/NamesList/NamesList';
import type { ObjectDetailPageMetadataProps } from '@ie-objects/components/ObjectDetailPageMetadata/ObjectDetailPageMetadata.types';
import { ObjectDetailPageMetadataDisclaimerTooltip } from '@ie-objects/components/ObjectDetailPageMetadata/ObjectDetailPageMetadataDisclaimerTooltip';
import { ObjectDetailPageMetadataRights } from '@ie-objects/components/ObjectDetailPageMetadata/ObjectDetailPageMetadataRights';
import { ObjectDetailPageMetadataThemes } from '@ie-objects/components/ObjectDetailPageMetadata/ObjectDetailPageMetadataThemes';
import { SearchLinkTag } from '@ie-objects/components/SearchLinkTag/SearchLinkTag';
import { useGetIeObjectPreviousNextIds } from '@ie-objects/hooks/use-get-ie-object-previous-next-ids';
import { renderAbrahamLink, renderDate, renderIsPartOfValue } from '@ie-objects/ie-objects.consts';
import { getFirstMentionHighlight } from '@ie-objects/utils/get-first-mention-highlight';
import {
	getIeObjectAvRightsIcon,
	getIeObjectAvRightsLabel,
	getIeObjectAvRightsUrl,
} from '@ie-objects/utils/get-ie-object-av-rights-icon';
import { getIeObjectProviderIdentifierLinkProps } from '@ie-objects/utils/get-ie-object-provider-identifier-link-props';
import { getIeObjectRightsStatusInfo } from '@ie-objects/utils/get-ie-object-rights-status';
import { getIeObjectSourceAttribution } from '@ie-objects/utils/get-ie-object-source-attribution';
import {
	mapArrayToMetadataData,
	mapObjectOrArrayToMetadata,
	mapObjectsToMetadata,
	renderKeywordsAsTags,
} from '@ie-objects/utils/map-metadata';
import type { TextLine } from '@iiif-viewer/IiifViewer.types';
import { isAudioVideoType, isNewspaperType } from '@meemoo/admin-core-ui/admin';
import { Button } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import { CopyButton } from '@shared/components/CopyButton';
import HighlightedMetadata from '@shared/components/HighlightedMetadata/HighlightedMetadata';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import MetaDataFieldWithHighlightingAndMaxLength from '@shared/components/MetaDataFieldWithHighlightingAndMaxLength/MetaDataFieldWithHighlightingAndMaxLength';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getSearchLink } from '@shared/helpers/get-search-link';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { formatDateTime } from '@shared/utils/dates';
import { Locale } from '@shared/utils/i18n';
import {
	type HetArchiefIeObject,
	HetArchiefIeObjectLicense,
	type HetArchiefIeObjectRightsInfo,
	HetArchiefIeObjectType,
	HetArchiefIsPartOfKey,
	type HetArchiefMention,
} from '@viaa/avo2-types';
import {
	LANGUAGES,
	type LanguageCode,
} from '@visitor-space/components/LanguageFilterForm/languages';
import { FILTER_LABEL_VALUE_DELIMITER, SearchFilterId } from '@visitor-space/types';
import clsx from 'clsx';
import { compact, isEmpty, isNil, isString } from 'es-toolkit/compat';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import React, { type FC, type ReactNode, useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import MetadataList from '../Metadata/MetadataList';
import styles from './ObjectDetailPageMetadata.module.scss';

export const ObjectDetailPageMetadata: FC<ObjectDetailPageMetadataProps> = ({
	mediaInfo,
	currentPage,
	goToPage,
	visitRequest,
	activeFile,
	simplifiedAltoInfo,
	iiifZoomTo,
	setActiveMentionHighlights,
	setIsTextOverlayVisible,
}) => {
	const router = useRouter();
	const locale = useLocale();

	/**
	 * Content
	 */

	const isNewspaper = isNewspaperType(mediaInfo?.dctermsFormat);
	const [selectedMetadataField, setSelectedMetadataField] = useState<MetadataItem | null>(null);
	const { data: ieObjectPreviousNextIds } = useGetIeObjectPreviousNextIds(
		mediaInfo?.collectionId,
		mediaInfo?.iri,

		isNewspaper && !!mediaInfo?.collectionId && !!mediaInfo?.schemaIdentifier
	);

	/**
	 * User
	 */

	const user: User | null = useSelector(selectUser);
	const isKiosk = useHasAnyGroup(GroupName.KIOSK_VISITOR);

	// Themes are shown for publicly disclosed objects that belong to at least one theme, to every
	// user including logged out ones, but never to kiosk visitors. See ARC-3826.
	const themes = mediaInfo?.themes ?? [];
	const showThemes: boolean =
		!isKiosk &&
		!!mediaInfo?.licenses?.includes(HetArchiefIeObjectLicense.PUBLIEK_CONTENT) &&
		themes.length > 0;

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

	const renderMaintainerMetaTitle = ({
		maintainerName,
		maintainerLogo,
		maintainerId,
	}: HetArchiefIeObject): ReactNode => {
		const maintainerSearchLink = stringifyUrl({
			url: ROUTES_BY_LOCALE[locale].search,
			query: {
				[SearchFilterId.Maintainers]: [
					`${maintainerId}${FILTER_LABEL_VALUE_DELIMITER}${maintainerName}`,
				],
			},
		});
		return (
			<div className={styles['p-object-detail__metadata-maintainer-title']}>
				<div>
					<p className={styles['p-object-detail__metadata-label']}>
						{tText('modules/ie-objects/const/index___aanbieder')}
					</p>
					{!isKiosk && <SearchLinkTag label={maintainerName} link={maintainerSearchLink} />}
				</div>

				{!isKiosk && maintainerLogo && (
					<div
						className={styles['p-object-detail__sidebar__content-logo']}
						style={{ backgroundImage: `url(${maintainerLogo})` }}
						aria-hidden="true"
					/>
				)}
			</div>
		);
	};

	const renderMaintainerMetaData = ({
		maintainerDescription,
		maintainerSiteUrl,
	}: HetArchiefIeObject): ReactNode => {
		if (!isKiosk) {
			return (
				<div className={styles['p-object-detail__sidebar__content-maintainer-data']}>
					{maintainerDescription && locale === Locale.nl && (
						<p className={styles['p-object-detail__sidebar__content-description']}>
							{maintainerDescription}
						</p>
					)}
					{maintainerSiteUrl && (
						<p className={styles['p-object-detail__sidebar__content-link']}>
							<a href={maintainerSiteUrl} target="_blank" rel="noopener noreferrer">
								{maintainerSiteUrl}
							</a>
							<Icon className="u-ml-8" name={IconNamesLight.Extern} aria-hidden />
						</p>
					)}
				</div>
			);
		}
	};

	const renderSimpleMetadataField = (
		title: string,
		data: string | ReactNode | null | undefined
	): ReactNode => {
		if (!data) {
			return null;
		}
		if (isString(data)) {
			return (
				<Metadata title={title} key={`metadata-${title}`}>
					<MetaDataFieldWithHighlightingAndMaxLength
						title={title}
						data={data}
						onReadMoreClicked={setSelectedMetadataField}
					/>
				</Metadata>
			);
		}
		return (
			<Metadata title={title} key={`metadata-${title}`}>
				{data}
			</Metadata>
		);
	};

	const renderSeriesTitle = (mediaInfo: HetArchiefIeObject) => {
		if (!mediaInfo.collectionName) {
			return null;
		}
		if (isNewspaperType(mediaInfo.dctermsFormat)) {
			// Use the series filter
			return (
				<SearchLinkTag
					label={mediaInfo.collectionName}
					link={getSearchLink(locale, {
						format: HetArchiefIeObjectType.NEWSPAPER,
						[SearchFilterId.NewspaperSeriesName]: mediaInfo.collectionName,
					})}
				/>
			);
		}

		// This series filter isn't available for audio / video material, since the filter doesn't work well for those media types
		// https://meemoo.atlassian.net/browse/ARC-3046
		return mediaInfo.collectionName;
	};

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

	const renderPreviousButton = (enabled: boolean) => {
		const previousButtonIcon = <Icon name={IconNamesLight.ArrowLeft} aria-hidden />;
		const previousButtonLabel = tText(
			'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata___vorige'
		);

		return (
			<Button
				variants={['text']}
				iconStart={previousButtonIcon}
				label={previousButtonLabel}
				disabled={!enabled}
				tabIndex={enabled ? undefined : -1}
			/>
		);
	};

	const renderNextButton = (enabled: boolean) => {
		const nextButtonIcon = <Icon name={IconNamesLight.ArrowRight} aria-hidden />;
		const nextButtonLabel = tText(
			'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata___volgende'
		);

		return (
			<Button
				variants={['text']}
				iconEnd={nextButtonIcon}
				label={nextButtonLabel}
				disabled={!enabled}
				tabIndex={enabled ? undefined : -1}
			/>
		);
	};

	const renderPreviousAndNextButtons = (): ReactNode | null => {
		if (user && !user?.permissions?.includes(Permission.VIEW_PREVIOUS_AND_NEXT_NEWSPAPER_BUTTONS)) {
			// Kiosk user cannot see previous and next buttons
			// https://meemoo.atlassian.net/browse/ARC-2933
			return null;
		}
		if (
			!mediaInfo ||
			(!ieObjectPreviousNextIds?.previousIeObjectId && !ieObjectPreviousNextIds?.nextIeObjectId)
		) {
			return null;
		}
		return (
			<div className={styles['p-object-detail__metadata-content__previous-next']}>
				{ieObjectPreviousNextIds?.previousIeObjectId ? (
					<Link
						href={`/pid/${ieObjectPreviousNextIds?.previousIeObjectId}`}
						aria-label={tText(
							'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata___ga-naar-de-vorige-krant-in-dezelfde-serie-link-aria-label'
						)}
					>
						{renderPreviousButton(true)}
					</Link>
				) : (
					renderPreviousButton(false)
				)}

				<span>{mediaInfo?.datePublished || mediaInfo?.dateCreated || '-'}</span>

				{ieObjectPreviousNextIds?.nextIeObjectId ? (
					<Link
						href={`/pid/${ieObjectPreviousNextIds?.nextIeObjectId}`}
						aria-label={tText(
							'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata___ga-naar-de-volgende-krant-in-dezelfde-serie-link-aria-label'
						)}
					>
						{renderNextButton(true)}
					</Link>
				) : (
					renderNextButton(false)
				)}
			</div>
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

	const getRightsInfoForAudioVideo = (
		mediaInfo: HetArchiefIeObject
	): HetArchiefIeObjectRightsInfo | null => {
		const isAudioOrVideo = isAudioVideoType(mediaInfo.dctermsFormat);
		return isAudioOrVideo ? mediaInfo.rightsInfo || null : null;
	};

	/**
	 * Render the rights-info for a newspaper or audio / video object, if available.
	 * For newspapers, we use the getIeObjectRightsStatusInfo util to get a user-friendly label and icon based on the rights-status of the object.
	 * 		this is stored as licenses on the object itself (legacy)
	 * For audio / video objects, we use the rightsInfo property of the mediaInfo, which is only present for AV media types.
	 * 		this is stored as rights in graph.rights table (currelty still a fixed list of rights per object, but in the future this will be filled dynamically from the £Knowledge graph of meemoo)
	 *
	 * @param mediaInfo
	 */
	const renderRightsInfo = (mediaInfo: HetArchiefIeObject) => {
		const rightsInfoNewspapers = isNewspaper ? getIeObjectRightsStatusInfo(mediaInfo) : null;
		const rightsInfoAudioVideo = getRightsInfoForAudioVideo(mediaInfo);
		const avRightsIcon = getIeObjectAvRightsIcon(rightsInfoAudioVideo);
		const avRightsLabel = getIeObjectAvRightsLabel(rightsInfoAudioVideo);
		const avRightsUrl = getIeObjectAvRightsUrl(rightsInfoAudioVideo);
		const rightsMoreInfoTitle = tText(
			'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata___meer-info-over-de-rechten-van-dit-object'
		);

		if (rightsInfoNewspapers) {
			return (
				<ObjectDetailPageMetadataRights
					title={tHtml('modules/ie-objects/object-detail-page___rechten')}
					className={styles['p-object-detail__metadata-content__rights-status']}
					label={rightsInfoNewspapers.label}
					labelIcon={rightsInfoNewspapers.icon}
					labelUrl={rightsInfoNewspapers.internalLink}
					moreInfoUrl={rightsInfoNewspapers.externalLink}
					moreInfoTitle={rightsMoreInfoTitle}
				/>
			);
		}
		if (rightsInfoAudioVideo) {
			return (
				<ObjectDetailPageMetadataRights
					title={tHtml('modules/ie-objects/object-detail-page___rechten')}
					className={styles['p-object-detail__metadata-content__rights-status']}
					label={avRightsLabel}
					labelIcon={avRightsIcon}
					labelUrl={avRightsUrl}
					moreInfoUrl={tText(
						'modules/ie-objects/utils/get-ie-object-rights-status___public-domain-internal-link',
						{
							languageCode: locale,
						}
					)}
					moreInfoTitle={rightsMoreInfoTitle}
					copyrightHolder={mediaInfo.copyrightHolder}
					copyrightHolderLabel={tText('modules/ie-objects/ie-objects___rechthebbende')}
					licenseDistributor={rightsInfoAudioVideo.licenseDistributor || undefined}
					licenseDistributorLabel={tText('modules/ie-objects/ie-objects___licentiegever')}
				/>
			);
		}
	};

	const renderSourceAttributionDisclaimerTooltip = () => (
		<ObjectDetailPageMetadataDisclaimerTooltip
			iconName={IconNamesLight.Info}
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
				renderedTitleRight={renderSourceAttributionDisclaimerTooltip()}
				renderRight={
					<CopyButton
						text={rightsAttributionText}
						title={tText(
							'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata___kopieer-de-bronvermelding-naar-je-klembord'
						)}
						variants={['white']}
					/>
				}
				className="u-bt-0"
			>
				<span>{rightsAttributionText}</span>
			</Metadata>
		);
	};

	const renderAuthorRightsHolder = (mediaInfo: HetArchiefIeObject) => {
		const rightsInfoAudioVideo = getRightsInfoForAudioVideo(mediaInfo);
		if (!rightsInfoAudioVideo) {
			return renderSimpleMetadataField(
				tText('modules/ie-objects/ie-objects___auteursrechthouder'),
				mediaInfo?.copyrightHolder
			);
		}
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

				<MetadataList allowTwoColumns={false}>
					<Metadata
						title={tText(
							'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata___editie-newspaper-series-title',
							{
								newspaperSeriesTitle: mediaInfo.collectionName,
							}
						)}
						key={'collectionNamePreviousNext'}
					>
						{renderPreviousAndNextButtons()}
					</Metadata>
				</MetadataList>
				<MetadataList allowTwoColumns={true}>
					<Metadata title={renderMaintainerMetaTitle(mediaInfo)} key={'metadata-maintainer'}>
						{renderMaintainerMetaData(mediaInfo)}
					</Metadata>
					{renderRightsInfo(mediaInfo)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___media-type'),
						mediaInfo.dctermsFormat
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___bestandstype'),
						activeFile?.mimeType
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___pid'),
						mediaInfo.schemaIdentifier
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___titel-van-de-reeks'),
						renderSeriesTitle(mediaInfo)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___publicatiedatum'),
						renderDate(mediaInfo.datePublished)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___rechtenstatus'),
						mediaInfo?.copyrightNotice
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___abraham-id'),
						renderAbrahamLink(mediaInfo?.abrahamInfo)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___identifier-bij-aanbieder'),
						renderProviderIdentifier(mediaInfo)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___editie-nummer'),
						mediaInfo.issueNumber
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___plaats-van-uitgave'),
						mediaInfo.locationCreated
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___fysieke-drager'),
						mapArrayToMetadataData(mediaInfo.dctermsMedium)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___bestandsnaam'),
						activeFile?.name
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___uitgebreide-beschrijving'),
						mediaInfo?.abstract ? mediaInfo?.abstract : null
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
						tText('modules/ie-objects/ie-objects___programmabeschrijving'),
						mediaInfo.synopsis
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___publicatietype'),
						mediaInfo.bibframeEdition
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___transcriptie'),
						mediaInfo?.transcript
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
						tText('modules/ie-objects/ie-objects___afmetingen-in-cm'),
						(mediaInfo?.width
							? tText('modules/ie-objects/ie-objects___breedte') + mediaInfo?.width
							: '') +
							(mediaInfo?.height
								? ` ${tText('modules/ie-objects/ie-objects___hoogte')}${mediaInfo?.height}`
								: '') || null
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___digitaliseringsdatum'),
						mediaInfo.digitizationDate
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
					{mapObjectOrArrayToMetadata(
						mediaInfo.creator,
						tText('modules/ie-objects/ie-objects___maker')
					).map((info) => renderSimpleMetadataField(info.title, info.data))}
					{mapObjectOrArrayToMetadata(
						Array.isArray(mediaInfo.publisher?.[0])
							? mediaInfo.publisher?.[0]
							: mediaInfo.publisher,
						tText('modules/ie-objects/ie-objects___uitgever')
					).map((info) => renderSimpleMetadataField(info.title, info.data))}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___datum-toegevoegd-aan-platform'),
						renderDate(activeFile?.createdAt)
					)}
					{/*{renderSimpleMetadataField(*/}
					{/*	tText('modules/ie-objects/ie-objects___permanente-url'),*/}
					{/*	publicRuntimeConfig.CLIENT_URL +*/}
					{/*		ROUTES_BY_LOCALE[locale].permalink.replace(':pid', mediaInfo.schemaIdentifier)*/}
					{/*)}*/}
					{mapObjectsToMetadata(
						mediaInfo.premisIdentifier?.filter(
							(premisEntry) => !['abraham_id', 'abraham_uri'].includes(Object.keys(premisEntry)[0])
						),
						tText('modules/ie-objects/ie-objects___premis-identifier')
					).map((info) => renderSimpleMetadataField(info.title, info.data))}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___creatiedatum'),
						mediaInfo.dateCreated
							? formatDateTime(new Date(mediaInfo.dateCreated), locale, 'short', false)
							: null
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___datum-drager'),
						mediaInfo.carrierDate
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___bronvermelding'),
						rightsAttributionText ? undefined : mediaInfo?.creditText
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___paginanummer'),
						mediaInfo?.pageNumber
					)}
					{renderAuthorRightsHolder(mediaInfo)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___oorsprong'),
						mediaInfo.meemooOriginalCp
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___archief'),
						renderIsPartOfValue(mediaInfo.isPartOf, HetArchiefIsPartOfKey.archive)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___programma'),
						renderIsPartOfValue(mediaInfo.isPartOf, HetArchiefIsPartOfKey.program)
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
						tText('modules/ie-objects/const/index___episode'),
						renderIsPartOfValue(mediaInfo.isPartOf, HetArchiefIsPartOfKey.episode)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___seizoennummer'),
						mediaInfo.collectionSeasonNumber
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___objecttype'),
						mediaInfo.ebucoreObjectType
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___duurtijd'),
						mediaInfo.duration
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___cast'),
						mediaInfo.meemooDescriptionCast
					)}
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

					{showThemes && (
						<ObjectDetailPageMetadataThemes
							title={tHtml(
								'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata-themes___themas'
							)}
							themes={themes}
							locale={locale}
						/>
					)}

					{!!mediaInfo.keywords?.length && (
						<Metadata
							title={tHtml(
								'pages/bezoekersruimte/visitor-space-slug/object-id/index___trefwoorden'
							)}
							key="metadata-keywords"
							className="u-pb-0"
						>
							{renderKeywordsAsTags(
								mediaInfo.keywords,
								visitRequest ? (router.query.slug as string) : '',
								locale,
								router
							)}
						</Metadata>
					)}
				</MetadataList>

				{/* Read more metadata field blade */}
				<Blade
					className={clsx(styles['p-object-detail__metadata-blade'])}
					isOpen={!!selectedMetadataField}
					onClose={() => setSelectedMetadataField(null)}
					title={selectedMetadataField?.title ?? ''}
					stickyFooter={false}
					footerButtons={[
						{
							label: tText(
								'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata___sluit'
							),
							mobileLabel: tText(
								'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata___sluit-mobiel'
							),
							type: 'secondary',
							onClick: () => setSelectedMetadataField(null),
						},
					]}
					id="object-detail-page__metadata-field-detail-blade"
					ariaLabel={tText(
						'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata___lees-de-volledige-waarde-van-het-metadata-veld-selected-metadata-field-name-blade-aria-label',
						{ selectedMetadataFieldName: selectedMetadataField?.title }
					)}
				>
					<HighlightedMetadata
						title={selectedMetadataField?.title}
						data={selectedMetadataField?.data}
					/>
				</Blade>
			</div>
		);
	};

	return renderMetaData();
};
