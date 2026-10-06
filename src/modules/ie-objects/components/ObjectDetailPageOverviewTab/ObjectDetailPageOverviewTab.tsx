import { GroupName, Permission } from '@account/const';
import { selectUser } from '@auth/store/user';
import type { User } from '@auth/types';
import { IeObjectCardList } from '@ie-objects/components/IeObjectCardList/IeObjectCardList';
import Metadata from '@ie-objects/components/Metadata/Metadata';
import MetadataList from '@ie-objects/components/Metadata/MetadataList';
import { renderSimpleMetadataField as renderSimpleMetadataFieldBase } from '@ie-objects/components/Metadata/render-simple-metadata-field';
import { ObjectDetailPageAiPersons } from '@ie-objects/components/ObjectDetailPageAiEntities/ObjectDetailPageAiPersons';
import { ObjectDetailPageMetadataRights } from '@ie-objects/components/ObjectDetailPageMetadataTab/ObjectDetailPageMetadataRights';
import { ObjectDetailPageMetadataThemes } from '@ie-objects/components/ObjectDetailPageMetadataTab/ObjectDetailPageMetadataThemes';
import type { ObjectDetailPageOverviewTabProps } from '@ie-objects/components/ObjectDetailPageOverviewTab/ObjectDetailPageOverviewTab.types';
import { SearchLinkTag } from '@ie-objects/components/SearchLinkTag/SearchLinkTag';
import { useGetIeObjectFileMentions } from '@ie-objects/hooks/use-get-ie-object-file-mentions';
import { useGetIeObjectPreviousNextIds } from '@ie-objects/hooks/use-get-ie-object-previous-next-ids';
import { renderDate } from '@ie-objects/ie-objects.consts';
import { FileMentionEntityType } from '@ie-objects/ie-objects.types';
import {
	getIeObjectAvRightsIcon,
	getIeObjectAvRightsLabel,
	getIeObjectAvRightsUrl,
} from '@ie-objects/utils/get-ie-object-av-rights-icon';
import { getIeObjectRightsStatusInfo } from '@ie-objects/utils/get-ie-object-rights-status';
import { mapFileMentionsToAiEntities } from '@ie-objects/utils/map-ai-entities';
import { renderKeywordsAsTags } from '@ie-objects/utils/map-metadata';
import { isAudioVideoType, isNewspaperType } from '@meemoo/admin-core-ui/admin';
import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getSearchLink } from '@shared/helpers/get-search-link';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useIsKeyUser } from '@shared/hooks/is-key-user';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { Locale } from '@shared/utils/i18n';
import {
	type HetArchiefIeObject,
	HetArchiefIeObjectLicense,
	type HetArchiefIeObjectRightsInfo,
	HetArchiefIeObjectType,
} from '@viaa/avo2-types';
import { FILTER_LABEL_VALUE_DELIMITER, SearchFilterId } from '@visitor-space/types';
import { isNil } from 'es-toolkit/compat';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { type FC, type ReactNode, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ArrayParam, useQueryParam } from 'use-query-params';
import styles from './ObjectDetailPageOverviewTab.module.scss';

export const ObjectDetailPageOverviewTab: FC<ObjectDetailPageOverviewTabProps> = ({
	mediaInfo,
	visitRequest,
	similar,
	onReadMoreClicked,
	playableFileId,
	onSeekPlayer,
}) => {
	const router = useRouter();
	const locale = useLocale();
	const user: User | null = useSelector(selectUser);
	const isKiosk = useHasAnyGroup(GroupName.KIOSK_VISITOR);
	// AI-entity filters (Personen/Plaatsen/Organisaties) carried over from the search results page
	const [mentionPersonFilter] = useQueryParam(SearchFilterId.MentionPerson, ArrayParam);
	// biome-ignore lint/correctness/noUnusedVariables: consumed once the visitekaartje card UI exists, see renderAiEntities below
	const [mentionPlaceFilter] = useQueryParam(SearchFilterId.MentionPlace, ArrayParam);
	// biome-ignore lint/correctness/noUnusedVariables: consumed once the visitekaartje card UI exists, see renderAiEntities below
	const [mentionOrganisationFilter] = useQueryParam(SearchFilterId.MentionOrganisation, ArrayParam);

	const isNewspaper = isNewspaperType(mediaInfo?.dctermsFormat);
	const isKeyUser = useIsKeyUser();
	// The proxy only discloses AI entities to key users, on AV objects that have the AI licence
	const { data: fileMentions } = useGetIeObjectFileMentions(
		mediaInfo?.schemaIdentifier,
		playableFileId,
		{ enabled: isKeyUser && isAudioVideoType(mediaInfo?.dctermsFormat) }
	);
	const aiPersons = useMemo(
		() => mapFileMentionsToAiEntities(fileMentions?.mentions ?? [], FileMentionEntityType.PERSON),
		[fileMentions]
	);
	const { data: ieObjectPreviousNextIds } = useGetIeObjectPreviousNextIds(
		mediaInfo?.collectionId,
		mediaInfo?.iri,
		isNewspaper && !!mediaInfo?.collectionId && !!mediaInfo?.schemaIdentifier
	);

	// Themes are shown for publicly disclosed objects that belong to at least one theme, to every
	// user including logged out ones, but never to kiosk visitors. See ARC-3826.
	const themes = mediaInfo?.themes ?? [];
	const showThemes: boolean =
		!isKiosk &&
		!!mediaInfo?.licenses?.includes(HetArchiefIeObjectLicense.PUBLIEK_CONTENT) &&
		themes.length > 0;

	const renderSimpleMetadataField = (
		title: string,
		data: string | ReactNode | null | undefined
	): ReactNode => renderSimpleMetadataFieldBase(title, data, onReadMoreClicked);

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
			<div className={styles['p-object-detail-overview-tab__maintainer-title']}>
				<div>
					<span className={styles['p-object-detail-overview-tab__label']}>
						{tText('modules/ie-objects/const/index___aanbieder')}
					</span>
					{!isKiosk && <SearchLinkTag label={maintainerName} link={maintainerSearchLink} />}
				</div>

				{!isKiosk && maintainerLogo && (
					<div
						className={styles['p-object-detail-overview-tab__maintainer-logo']}
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
				<div className={styles['p-object-detail-overview-tab__maintainer-data']}>
					{maintainerDescription && locale === Locale.nl && (
						<p className={styles['p-object-detail-overview-tab__maintainer-description']}>
							{maintainerDescription}
						</p>
					)}
					{maintainerSiteUrl && (
						<p className={styles['p-object-detail-overview-tab__maintainer-link']}>
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
			<div className={styles['p-object-detail-overview-tab__previous-next']}>
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

	const getRightsInfoForAudioVideo = (
		mediaInfo: HetArchiefIeObject
	): HetArchiefIeObjectRightsInfo | null => {
		const isAudioOrVideo = isAudioVideoType(mediaInfo.dctermsFormat);
		return isAudioOrVideo ? mediaInfo.rightsInfo || null : null;
	};

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
					className={styles['p-object-detail-overview-tab__rights-status']}
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
					className={styles['p-object-detail-overview-tab__rights-status']}
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

	const renderAuthorRightsHolder = (mediaInfo: HetArchiefIeObject) => {
		const rightsInfoAudioVideo = getRightsInfoForAudioVideo(mediaInfo);
		if (!rightsInfoAudioVideo) {
			return renderSimpleMetadataField(
				tText('modules/ie-objects/ie-objects___auteursrechthouder'),
				mediaInfo?.copyrightHolder
			);
		}
	};

	// TODO: places and organisations, with the same visitekaartje (mentionPlaceFilter / mentionOrganisationFilter)
	const renderAiEntities = (): ReactNode => {
		if (!aiPersons.length) {
			return null;
		}
		// The person filtered on in the search results opens straight away
		const personFromFilter = aiPersons.find((person) =>
			(mentionPersonFilter ?? []).includes(person.name)
		);
		return (
			<ObjectDetailPageAiPersons
				persons={aiPersons}
				durationSeconds={fileMentions?.durationSeconds ?? null}
				isTimelineInteractive={!!fileMentions?.hasAccessToEssence}
				onSeek={onSeekPlayer}
				initialSelectedId={personFromFilter?.id ?? null}
				disclaimerAriaLabel={tText(
					'modules/ie-objects/components/object-detail-page-ai-entities/object-detail-page-ai-persons___meer-info-over-ai-herkende-personen'
				)}
				disclaimer={tHtml(
					'modules/ie-objects/components/object-detail-page-ai-entities/object-detail-page-ai-persons___deze-personen-zijn-automatisch-herkend-met-ai-en-kunnen-fouten-bevatten-meer-info'
				)}
			/>
		);
	};

	if (isNil(mediaInfo)) {
		return null;
	}

	// null for AV objects (this section is newspaper-only) - whichever section ends up first in the
	// DOM is the one that needs the no-leading-divider/no-leading-border treatment below.
	const previousAndNextButtons = renderPreviousAndNextButtons();

	return (
		<div className={styles['p-object-detail-overview-tab']}>
			{previousAndNextButtons && (
				// First section in this tab: no leading divider, there's nothing above it to divide
				// from inside this tab (the header sits above, outside it).
				<MetadataList allowTwoColumns={false} noDivider>
					<Metadata
						title={tText(
							'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata___editie-newspaper-series-title',
							{
								newspaperSeriesTitle: mediaInfo.collectionName,
							}
						)}
						key={'collectionNamePreviousNext'}
					>
						{previousAndNextButtons}
					</Metadata>
				</MetadataList>
			)}

			<MetadataList allowTwoColumns={true} noDivider={!previousAndNextButtons}>
				<Metadata title={renderMaintainerMetaTitle(mediaInfo)} key={'metadata-maintainer'}>
					{renderMaintainerMetaData(mediaInfo)}
				</Metadata>
				{/* Newspapers get the combined "Editie: ..." field above (naam van de reeks + editie
				 * publicatiedatum + vorige/volgende) instead of these - showing both would repeat the
				 * same series name under two different labels. */}
				{!previousAndNextButtons && (
					<>
						{renderSimpleMetadataField(
							tText('modules/ie-objects/ie-objects___titel-van-de-reeks'),
							renderSeriesTitle(mediaInfo)
						)}
						{renderSimpleMetadataField(
							tText('modules/ie-objects/const/index___publicatiedatum'),
							renderDate(mediaInfo.datePublished)
						)}
					</>
				)}
				{renderAiEntities()}
				{renderRightsInfo(mediaInfo)}
				{renderAuthorRightsHolder(mediaInfo)}
				{showThemes && (
					<ObjectDetailPageMetadataThemes
						title={tHtml(
							'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata-themes___themas'
						)}
						themes={themes}
						locale={locale}
					/>
				)}
			</MetadataList>

			<MetadataList allowTwoColumns={false}>
				{!!mediaInfo.keywords?.length && (
					<Metadata
						title={tHtml('pages/bezoekersruimte/visitor-space-slug/object-id/index___trefwoorden')}
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

			{!!similar.length && (
				<MetadataList allowTwoColumns={false} grow>
					<Metadata
						title={tHtml('pages/slug/ie/index___ook-interessant')}
						key="metadata-similar"
						className="u-pb-0"
					>
						<IeObjectCardList type="similar" items={similar} />
					</Metadata>
				</MetadataList>
			)}
		</div>
	);
};
