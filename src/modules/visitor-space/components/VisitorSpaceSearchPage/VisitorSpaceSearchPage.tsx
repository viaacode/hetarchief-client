import { Button, FormControl, TabProps } from '@meemoo/react-components';
import clsx from 'clsx';
import { HTTPError } from 'ky';
import { sum } from 'lodash-es';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MultiValue } from 'react-select';
import { useQueryParams } from 'use-query-params';

import { Permission } from '@account/const';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { useGetMediaFilterOptions } from '@media/hooks/get-media-filter-options';
import { useGetMediaObjects } from '@media/hooks/get-media-objects';
import { isInAFolder } from '@media/utils';
import {
	Callout,
	ErrorNoAccess,
	Icon,
	IdentifiableMediaCard,
	Loading,
	MediaCardList,
	MediaCardProps,
	MediaCardViewMode,
	PaginationBar,
	Placeholder,
	ScrollableTabs,
	TabLabel,
	TagSearchBar,
	ToggleOption,
} from '@shared/components';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useScrollToId } from '@shared/hooks/scroll-to-id';
import { useLocalStorage } from '@shared/hooks/use-localStorage/use-local-storage';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { selectHistory, setHistory } from '@shared/store/history';
import { selectFolders } from '@shared/store/media';
import { selectShowNavigationBorder } from '@shared/store/ui';
import {
	AccessStatus,
	Breakpoints,
	OrderDirection,
	SortObject,
	VisitorSpaceMediaType,
} from '@shared/types';
import {
	asDate,
	createPageTitle,
	formatMediumDateWithTime,
	formatSameDayTimeOrDate,
} from '@shared/utils';
import { scrollTo } from '@shared/utils/scroll-to-top';
import { useGetActiveVisitForUserAndSpace } from '@visits/hooks/get-active-visit-for-user-and-space';
import { useGetVisitAccessStatus } from '@visits/hooks/get-visit-access-status';

import {
	AddToFolderBlade,
	AdvancedFilterFormState,
	CreatedFilterFormState,
	CreatorFilterFormState,
	DurationFilterFormState,
	FilterMenu,
	GenreFilterFormState,
	initialFields,
	KeywordsFilterFormState,
	LanguageFilterFormState,
	MediumFilterFormState,
	PublishedFilterFormState,
	VisitorSpaceNavigation,
} from '../../components';
import {
	VISITOR_SPACE_FILTERS,
	VISITOR_SPACE_ITEM_COUNT,
	VISITOR_SPACE_QUERY_PARAM_CONFIG,
	VISITOR_SPACE_QUERY_PARAM_INIT,
	VISITOR_SPACE_SORT_OPTIONS,
	VISITOR_SPACE_TABS,
	VISITOR_SPACE_VIEW_TOGGLE_OPTIONS,
} from '../../const';
import { useGetVisitorSpace } from '../../hooks/get-visitor-space';
import { MetadataProp, TagIdentity, VisitorSpaceFilterId, VisitorSpaceStatus } from '../../types';
import { mapFiltersToTags, tagPrefix } from '../../utils';
import { mapFiltersToElastic } from '../../utils/elastic-filters';
import { WaitingPage } from '../WaitingPage';

const labelKeys = {
	search: 'VisitorSpaceSearchPage__search',
};

const VisitorSpaceSearchPage: NextPage = () => {
	useNavigationBorder();

	const { tHtml, tText } = useTranslation();
	const router = useRouter();
	const windowSize = useWindowSizeContext();
	const history = useSelector(selectHistory);
	const dispatch = useDispatch();

	useScrollToId((router.query.focus as string) || null);

	const { slug } = router.query;
	const canManageFolders: boolean | null = useHasAllPermission(Permission.MANAGE_FOLDERS);
	const showResearchWarning = useHasAllPermission(Permission.SHOW_RESEARCH_WARNING);
	const showLinkedSpaceAsHomepage = useHasAllPermission(Permission.SHOW_LINKED_SPACE_AS_HOMEPAGE);

	/**
	 * State
	 */

	const showNavigationBorder = useSelector(selectShowNavigationBorder);

	// We need 2 different states for the filter menu for different viewport sizes
	const [filterMenuOpen, setFilterMenuOpen] = useState(true);
	const [mobileFilterMenuOpen, setMobileFilterMenuOpen] = useState(false);

	const [viewMode, setViewMode] = useLocalStorage('HET_ARCHIEF.search.viewmode', 'grid');

	const [selected, setSelected] = useState<IdentifiableMediaCard | null>(null);
	const [isAddToFolderBladeOpen, setShowAddToFolderBlade] = useState(false);

	const [query, setQuery] = useQueryParams(VISITOR_SPACE_QUERY_PARAM_CONFIG);

	const activeSort: SortObject = {
		orderProp: query.orderProp,
		orderDirection: (query.orderDirection as OrderDirection) ?? undefined,
	};

	useEffect(() => {
		// New search => update history in list
		dispatch(setHistory([history[history.length - 1], router.asPath]));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.asPath, dispatch, query]);

	/**
	 * Data
	 */

	const {
		error: visitRequestError,
		data: visitRequest,
		isLoading: visitRequestIsLoading,
	} = useGetActiveVisitForUserAndSpace(slug as string, typeof slug === 'string');

	const { data: accessStatus, isLoading: visitAccessStatusIsLoading } = useGetVisitAccessStatus(
		slug as string,
		typeof slug === 'string'
	);

	const { data: visitorSpace, isLoading: visitorSpaceIsLoading } = useGetVisitorSpace(
		slug as string,
		false,
		{
			enabled: visitRequest !== undefined || accessStatus?.status === AccessStatus.PENDING,
		}
	);

	const {
		data: media,
		isLoading: mediaIsLoading,
		error: mediaError,
	} = useGetMediaObjects(
		visitorSpace?.maintainerId?.toLocaleLowerCase() as string,
		mapFiltersToElastic(query),
		query.page || 1,
		VISITOR_SPACE_ITEM_COUNT,
		activeSort,
		visitorSpace?.maintainerId !== undefined
	);

	// The result will be added to the redux store
	useGetMediaFilterOptions(visitorSpace?.maintainerId?.toLocaleLowerCase() as string | undefined);

	const collections = useSelector(selectFolders);

	/**
	 * Computed
	 */

	const isNoAccessError =
		(visitRequestError as HTTPError)?.response?.status === 403 &&
		(accessStatus?.status === AccessStatus.NO_ACCESS || !accessStatus?.status);
	const isAccessPendingError =
		(visitRequestError as HTTPError)?.response?.status === 403 &&
		accessStatus?.status === AccessStatus.PENDING;
	const isVisitorSpaceInactive = visitorSpace?.status === VisitorSpaceStatus.Inactive;
	const mediaNoAccess = (mediaError as HTTPError)?.response?.status === 403;

	/**
	 * Display
	 */

	const getItemCounts = useCallback(
		(type: VisitorSpaceMediaType): number => {
			const buckets = media?.aggregations?.dcterms_format?.buckets || [];
			if (type === VisitorSpaceMediaType.All) {
				return sum(buckets.map((item) => item.doc_count));
			} else {
				return buckets.find((bucket) => bucket.key === type)?.doc_count || 0;
			}
		},
		[media]
	);

	const tabs: TabProps[] = useMemo(
		() =>
			VISITOR_SPACE_TABS().map((tab) => ({
				...tab,
				label: (
					<TabLabel
						label={tab.label}
						count={getItemCounts(tab.id as VisitorSpaceMediaType)}
					/>
				),
				active: tab.id === query.format,
			})),
		[query.format, getItemCounts]
	);

	const toggleOptions: ToggleOption[] = useMemo(
		() =>
			VISITOR_SPACE_VIEW_TOGGLE_OPTIONS.map((option) => ({
				...option,
				active: option.id === viewMode,
			})),
		[viewMode]
	);

	/**
	 * Methods
	 */

	const onSearch = async (newValue: string) => {
		if (newValue.trim() && !query.search?.includes(newValue)) {
			setQuery({
				[SEARCH_QUERY_KEY]: (query.search ?? []).concat(newValue),
				page: 1,
			});
		}
	};

	const onFilterMenuToggle = (nextOpen?: boolean, isMobile?: boolean) => {
		const nextOpenState =
			typeof nextOpen !== 'undefined' ? nextOpen : (prevOpen: boolean) => !prevOpen;
		if (isMobile) {
			setMobileFilterMenuOpen(nextOpenState);
		} else {
			setFilterMenuOpen(nextOpenState);
		}
	};

	const onResetFilters = () => {
		setQuery(VISITOR_SPACE_QUERY_PARAM_INIT);
	};

	const onSubmitFilter = (id: VisitorSpaceFilterId, values: unknown) => {
		let data;

		switch (id) {
			case VisitorSpaceFilterId.Medium:
				data = (values as MediumFilterFormState).mediums;
				break;

			case VisitorSpaceFilterId.Duration:
				data = values as DurationFilterFormState;
				data = data.duration
					? [
							{
								prop: MetadataProp.Duration,
								op: data.operator,
								val: data.duration,
							},
					  ]
					: undefined;
				break;

			case VisitorSpaceFilterId.Created:
				data = values as CreatedFilterFormState;
				data = data.created
					? [
							{
								prop: MetadataProp.CreatedAt,
								op: data.operator,
								val: data.created,
							},
					  ]
					: undefined;
				break;

			case VisitorSpaceFilterId.Published:
				data = values as PublishedFilterFormState;
				data = data.published
					? [
							{
								prop: MetadataProp.PublishedAt,
								op: data.operator,
								val: data.published,
							},
					  ]
					: undefined;
				break;

			case VisitorSpaceFilterId.Creator:
				data = (values as CreatorFilterFormState).creators;
				break;

			case VisitorSpaceFilterId.Genre:
				data = (values as GenreFilterFormState).genres;
				break;

			case VisitorSpaceFilterId.Keywords:
				data = (values as KeywordsFilterFormState).values;
				break;

			case VisitorSpaceFilterId.Language:
				data = (values as LanguageFilterFormState).languages;
				break;

			case VisitorSpaceFilterId.Advanced:
				data = (values as AdvancedFilterFormState).advanced.filter(
					(advanced) => advanced.val !== initialFields().val
				);

				if (data.length === 0) {
					setQuery({ [id]: undefined, filter: undefined, page: 1 });
					return;
				}

				break;

			default:
				console.warn(`[WARN][VisitorSpacePage] No submit handler for ${id}`);
				break;
		}

		setQuery({ [id]: data, filter: undefined, page: 1 });
	};

	const onRemoveTag = (tags: MultiValue<TagIdentity>) => {
		const query: Record<string, unknown> = {};

		tags.forEach((tag) => {
			switch (tag.key) {
				case VisitorSpaceFilterId.Creator:
				case VisitorSpaceFilterId.Genre:
				case VisitorSpaceFilterId.Keywords:
				case VisitorSpaceFilterId.Language:
				case VisitorSpaceFilterId.Medium:
				case SEARCH_QUERY_KEY:
					query[tag.key] = [
						...((query[tag.key] as Array<unknown>) || []),
						`${tag.value}`.replace(tagPrefix(tag.key), ''),
					];
					break;

				case VisitorSpaceFilterId.Advanced:
				case VisitorSpaceFilterId.Created:
				case VisitorSpaceFilterId.Duration:
				case VisitorSpaceFilterId.Published:
					query[tag.key] = [...((query[tag.key] as Array<unknown>) || []), tag];
					break;

				default:
					query[tag.key] = tag.value;
					break;
			}
		});

		// Destructure to keyword-able filters
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { format, orderProp, orderDirection, page, ...rest } = {
			...VISITOR_SPACE_QUERY_PARAM_INIT,
		};

		setQuery({ ...rest, ...query, page: 1 });
	};

	const onSortClick = (orderProp: string, orderDirection?: OrderDirection) => {
		setQuery({ orderProp, orderDirection, page: 1 });
	};

	const onTabClick = (tabId: string | number) => {
		setQuery({ format: String(tabId), page: 1 });
	};

	const onViewToggle = (nextMode: string) => setViewMode(nextMode as MediaCardViewMode);

	/**
	 * Computed
	 */

	const activeFilters = useMemo(() => mapFiltersToTags(query), [query]);
	const keywords = (query.search ?? []).filter((str) => !!str) as string[];
	const showNoResults = !!media && media?.items?.length === 0;
	const showResults = !!media && media?.items?.length > 0;
	const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.md);
	const accessEndDate = formatMediumDateWithTime(asDate(visitRequest?.endAt));
	const accessEndDateMobile = formatSameDayTimeOrDate(asDate(visitRequest?.endAt));

	/**
	 * Render
	 */

	const renderFilterMenu = () => {
		const filterMenuCls = clsx('p-visitor-space__filter-menu', {
			'u-mr-32:md': viewMode === 'list' && showResults,
		});

		return (
			<div className={filterMenuCls}>
				<FilterMenu
					activeSort={activeSort}
					filters={VISITOR_SPACE_FILTERS()}
					filterValues={query}
					label={tText('pages/bezoekersruimte/visitor-space-slug/index___filters')}
					isOpen={filterMenuOpen}
					isMobileOpen={mobileFilterMenuOpen}
					showNavigationBorder={showNavigationBorder}
					sortOptions={VISITOR_SPACE_SORT_OPTIONS()}
					toggleOptions={toggleOptions}
					onSortClick={onSortClick}
					onMenuToggle={onFilterMenuToggle}
					onViewToggle={onViewToggle}
					onFilterSubmit={(id, values) =>
						onSubmitFilter(id as VisitorSpaceFilterId, values)
					}
					onRemoveValue={onRemoveTag}
				/>
			</div>
		);
	};

	const renderCardButtons = (item: MediaCardProps): ReactNode => {
		if (!canManageFolders) {
			return null;
		}

		const itemIsInAFolder = isInAFolder(
			collections,
			(item as IdentifiableMediaCard).schemaIdentifier
		);

		return (
			<Button
				onClick={(e) => {
					// Avoid navigating to detail when opening
					e.preventDefault();
					e.stopPropagation();

					setSelected(item as IdentifiableMediaCard);
					setShowAddToFolderBlade(true);
				}}
				icon={
					<Icon type={itemIsInAFolder ? 'solid' : 'light'} name="bookmark" aria-hidden />
				}
				variants={['text', 'xxs']}
				title={tText(
					'modules/visitor-space/components/visitor-space-search-page/visitor-space-search-page___sla-dit-item-op'
				)}
				aria-label={tText(
					'modules/visitor-space/components/visitor-space-search-page/visitor-space-search-page___sla-dit-item-op'
				)}
			/>
		);
	};

	const renderResults = () => (
		<>
			<MediaCardList
				items={media?.items.map(
					(item): IdentifiableMediaCard => ({
						schemaIdentifier: item.schema_identifier,
						description: item.schema_description,
						title: item.schema_name,
						publishedAt: item.schema_date_published
							? asDate(item.schema_date_published)
							: undefined,
						publishedBy: item.schema_maintainer?.schema_name ?? '',
						type: item.dcterms_format,
						preview: item.schema_thumbnail_url || undefined,
						name: item.schema_name,
						hasRelated: (item.related_count || 0) > 0,
					})
				)}
				keywords={keywords}
				sidebar={renderFilterMenu()}
				view={viewMode === 'grid' ? 'grid' : 'list'}
				buttons={renderCardButtons}
				className="p-media-card-list"
				wrapper={(card, item) => {
					const cast = item as IdentifiableMediaCard;
					const source = media?.items.find(
						(media) => media.schema_identifier === cast.schemaIdentifier
					);

					const href = `/${slug}/${source?.schema_identifier}`;

					const name = item.title?.toString(); // TODO double check that this still works
					return (
						<Link key={source?.schema_identifier} href={href.toLowerCase()}>
							<a
								className="u-text-no-decoration"
								aria-label={tText(
									'modules/visitor-space/components/visitor-space-search-page/visitor-space-search-page___navigeer-naar-de-detailpagina-van-name',
									{
										name,
									}
								)}
							>
								{card}
							</a>
						</Link>
					);
				}}
			/>
			<PaginationBar
				className="u-mb-48"
				start={(query.page - 1) * VISITOR_SPACE_ITEM_COUNT}
				count={VISITOR_SPACE_ITEM_COUNT}
				showBackToTop
				total={getItemCounts(query.format as VisitorSpaceMediaType)}
				onPageChange={(zeroBasedPage) => {
					scrollTo(0);
					setQuery({
						...query,
						page: zeroBasedPage + 1,
					});
				}}
			/>
		</>
	);

	const getAccessEndDate = () => {
		if ((!accessEndDate && !accessEndDateMobile) || showLinkedSpaceAsHomepage) {
			return undefined;
		}
		if (isMobile) {
			return tHtml('pages/slug/index___tot-access-end-date-mobile', {
				accessEndDateMobile,
			});
		}
		return tHtml(
			'pages/bezoekersruimte/visitor-space-slug/object-id/index___toegang-tot-access-end-date',
			{
				accessEndDate,
			}
		);
	};

	const renderVisitorSpace = () => (
		<>
			{visitorSpace && (
				<div className="p-visitor-space">
					<VisitorSpaceNavigation
						title={visitorSpace?.name}
						phone={visitorSpace?.contactInfo.telephone || ''}
						email={visitorSpace?.contactInfo.email || ''}
						showBorder={showNavigationBorder}
						showAccessEndDate={getAccessEndDate()}
					/>

					<section className="u-bg-black u-pt-8">
						<div className="l-container">
							<FormControl
								className="c-form-control--label-hidden u-mb-24"
								id={`react-select-${labelKeys.search}-input`}
								label={tHtml(
									'pages/bezoekersruimte/slug___zoek-op-trefwoord-jaartal-aanbieder'
								)}
							>
								<TagSearchBar
									allowCreate
									clearLabel={tHtml(
										'pages/bezoekersruimte/slug___wis-volledige-zoekopdracht'
									)}
									instanceId={labelKeys.search}
									isMulti
									size="lg"
									placeholder={tText(
										'pages/bezoekersruimte/slug___zoek-op-trefwoord-jaartal-aanbieder'
									)}
									syncSearchValue={false}
									value={activeFilters}
									onClear={onResetFilters}
									onRemoveValue={onRemoveTag}
									onSearch={onSearch}
								/>
							</FormControl>

							<ScrollableTabs variants={['dark']} tabs={tabs} onClick={onTabClick} />
						</div>
					</section>

					{showResearchWarning && (
						<aside className="u-bg-platinum">
							<div className="l-container u-flex u-justify-center u-py-32">
								<Callout
									icon={<Icon name="info" aria-hidden />}
									text={tHtml(
										'pages/slug/index___door-gebruik-te-maken-van-deze-applicatie-bevestigt-u-dat-u-het-beschikbare-materiaal-enkel-raadpleegt-voor-wetenschappelijk-of-prive-onderzoek'
									)}
									action={
										<Link passHref href="/kiosk-voorwaarden">
											<a aria-label={tText('pages/slug/index___meer-info')}>
												<Button
													className="u-py-0 u-px-8 u-color-neutral u-font-size-14 u-height-auto"
													label={tHtml('pages/slug/index___meer-info')}
													variants={['text', 'underline']}
												/>
											</a>
										</Link>
									}
								/>
							</div>
						</aside>
					)}
					<section
						className={clsx(
							'p-visitor-space__results u-page-bottom-margin u-bg-platinum u-py-24 u-py-48:md',
							{
								'p-visitor-space__results--placeholder': showNoResults,
								'u-pt-0': showResearchWarning,
							}
						)}
					>
						<div className="l-container">
							{!showResults && renderFilterMenu()}

							{showNoResults && (
								<Placeholder
									className="p-visitor-space__placeholder"
									img="/images/looking-glass.svg"
									title={tHtml(
										'pages/bezoekersruimte/visitor-space-slug/index___geen-resultaten'
									)}
									description={tHtml(
										'pages/bezoekersruimte/visitor-space-slug/index___pas-je-zoekopdracht-aan-om-minder-filter-of-trefwoorden-te-omvatten'
									)}
								/>
							)}

							{showResults && renderResults()}
						</div>
					</section>
				</div>
			)}

			{visitorSpace && (
				<AddToFolderBlade
					isOpen={isAddToFolderBladeOpen}
					selected={
						selected
							? {
									schemaIdentifier: selected.schemaIdentifier,
									title: selected.name,
							  }
							: undefined
					}
					onClose={() => {
						setShowAddToFolderBlade(false);
						setSelected(null);
					}}
					onSubmit={async () => {
						setShowAddToFolderBlade(false);
						setSelected(null);
					}}
				/>
			)}
		</>
	);

	const renderPageContent = () => {
		if (
			visitorSpaceIsLoading ||
			visitAccessStatusIsLoading ||
			visitRequestIsLoading ||
			mediaIsLoading
		) {
			return <Loading fullscreen />;
		}

		if (isNoAccessError || isVisitorSpaceInactive || mediaNoAccess) {
			return (
				<ErrorNoAccess
					visitorSpaceSlug={slug as string}
					description={tHtml(
						'modules/visitor-space/components/visitor-space-search-page/visitor-space-search-page___deze-bezoekersruimte-is-momenteel-niet-beschikbaar'
					)}
				/>
			);
		}

		if (isAccessPendingError) {
			return <WaitingPage space={visitorSpace ?? undefined} />;
		}

		return renderVisitorSpace();
	};

	return (
		<>
			<Head>
				<title>{createPageTitle(visitorSpace?.name)}</title>
				<meta
					name="description"
					content={
						visitorSpace?.info ||
						tText(
							'pages/bezoekersruimte/visitor-space-slug/index___een-bezoekersruimte'
						)
					}
				/>
			</Head>
			{renderPageContent()}
		</>
	);
};

export const getServerSideProps = withI18n();

export default withAuth(VisitorSpaceSearchPage);
