import {
	Breadcrumb,
	Breadcrumbs,
	Button,
	FormControl,
	OrderDirection,
	TabProps,
} from '@meemoo/react-components';
import clsx from 'clsx';
import { HTTPError } from 'ky';
import { isEmpty, isNil, sortBy, sum } from 'lodash-es';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MultiValue } from 'react-select';
import { useQueryParams } from 'use-query-params';

import { Group, Permission } from '@account/const';
import { selectIsLoggedIn, selectUser } from '@auth/store/user';
import { useGetIeObjects } from '@ie-objects/hooks/get-ie-objects';
import { IeObjectAccessThrough } from '@ie-objects/types';
import { isInAFolder } from '@ie-objects/utils';
import {
	Callout,
	ErrorNoAccess,
	Icon,
	IconNamesLight,
	IconNamesSolid,
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
	TYPE_TO_ICON_MAP,
	TYPE_TO_NO_ICON_MAP,
	VisitorSpaceDropdown,
	VisitorSpaceDropdownOption,
} from '@shared/components';
import { ROUTES, SEARCH_QUERY_KEY } from '@shared/const';
import { tText } from '@shared/helpers/translate';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useScrollToId } from '@shared/hooks/scroll-to-id';
import { useLocalStorage } from '@shared/hooks/use-localStorage/use-local-storage';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { selectHistory, setHistory } from '@shared/store/history';
import { selectFolders } from '@shared/store/ie-objects';
import { selectShowNavigationBorder } from '@shared/store/ui';
import {
	Breakpoints,
	IeObjectTypes,
	SortObject,
	Visit,
	VisitorSpaceMediaType,
	VisitStatus,
} from '@shared/types';
import { asDate, formatMediumDateWithTime, formatSameDayTimeOrDate } from '@shared/utils';
import { scrollTo } from '@shared/utils/scroll-to-top';
import { VisitsService } from '@visits/services';
import { VisitTimeframe } from '@visits/types';

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
import { MetadataProp, TagIdentity, VisitorSpaceFilterId } from '../../types';
import { mapFiltersToTags, tagPrefix } from '../../utils';
import { mapFiltersToElastic } from '../../utils/elastic-filters';

// ToDo(Silke): check isLogged in voor filter maintainer ding -> enkel leeg gebruiken
const labelKeys = {
	search: 'VisitorSpaceSearchPage__search',
};

const PUBLIC_COLLECTION = ''; // No maintainer query param means the public collection should be selected

const getDefaultOption = (): VisitorSpaceDropdownOption => {
	return {
		id: PUBLIC_COLLECTION,
		label: tText(
			'modules/visitor-space/components/visitor-space-search-page/visitor-space-search-page___pages-bezoekersruimte-publieke-catalogus'
		),
	};
};

const VisitorSpaceSearchPage: FC = () => {
	const { tHtml, tText } = useTranslation();
	const router = useRouter();
	const windowSize = useWindowSizeContext();
	const history = useSelector(selectHistory);
	const dispatch = useDispatch();

	useScrollToId((router.query.focus as string) || null);

	const canManageFolders: boolean | null = useHasAllPermission(Permission.MANAGE_FOLDERS);
	const showResearchWarning = useHasAllPermission(Permission.SHOW_RESEARCH_WARNING);
	const isKioskUser = useHasAnyGroup(Group.KIOSK_VISITOR);
	const isCPAdmin = useHasAnyGroup(Group.CP_ADMIN);

	/**
	 * State
	 */
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const user = useSelector(selectUser);
	const showNavigationBorder = useSelector(selectShowNavigationBorder);
	const collections = useSelector(selectFolders);

	// We need 2 different states for the filter menu for different viewport sizes
	const [filterMenuOpen, setFilterMenuOpen] = useState(true);
	const [mobileFilterMenuOpen, setMobileFilterMenuOpen] = useState(false);

	const [viewMode, setViewMode] = useLocalStorage('HET_ARCHIEF.search.viewmode', 'grid');

	const [selected, setSelected] = useState<IdentifiableMediaCard | null>(null);
	const [isAddToFolderBladeOpen, setShowAddToFolderBlade] = useState(false);

	const [searchBarInputState, setSearchBarInputState] = useState<string>();
	const [query, setQuery] = useQueryParams(VISITOR_SPACE_QUERY_PARAM_CONFIG);

	const [visitorSpaces, setVisitorSpaces] = useState<Visit[]>([]);
	const [activeVisitorSpace, setActiveVisitorSpace] = useState<Visit | undefined>();

	const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.md);
	const activeSort: SortObject = {
		orderProp: query.orderProp,
		orderDirection: (query.orderDirection as OrderDirection) ?? undefined,
	};

	const activeVisitorSpaceId: string =
		query?.[VisitorSpaceFilterId.Maintainer] || PUBLIC_COLLECTION;

	/**
	 * Data
	 */
	const getVisitorSpaces = useCallback(async (): Promise<Visit[]> => {
		const { items: spaces } = await VisitsService.getAll({
			page: 1,
			size: 10,
			orderProp: 'startAt',
			orderDirection: OrderDirection.desc,
			status: VisitStatus.APPROVED,
			timeframe: VisitTimeframe.ACTIVE,
			personal: true,
		});

		const sortedSpaces = sortBy(spaces, (space) => space.spaceName?.toLowerCase());

		setVisitorSpaces(sortedSpaces);

		return sortedSpaces;
	}, []);

	const {
		data: searchResults,
		isLoading: searchResultsLoading,
		error: searchResultsError,
	} = useGetIeObjects(
		mapFiltersToElastic(query),
		query.page || 1,
		VISITOR_SPACE_ITEM_COUNT,
		activeSort,
		true
	);

	/**
	 * Effects
	 */

	useEffect(() => {
		// New search => update history in list
		dispatch(setHistory([history[history.length - 1], router.asPath]));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.asPath, dispatch, query]);

	useEffect(() => {
		if (!isLoggedIn) {
			return;
		}

		getVisitorSpaces();
	}, [getVisitorSpaces, isLoggedIn]);

	useEffect(() => {
		const visitorSpace: Visit | undefined = visitorSpaces.find(
			(visit: Visit): boolean => activeVisitorSpaceId === visit.spaceMaintainerId
		);

		setActiveVisitorSpace(visitorSpace);
		setQuery({
			...VISITOR_SPACE_QUERY_PARAM_INIT,
			[VisitorSpaceFilterId.Maintainer]: activeVisitorSpaceId || undefined,
		});
	}, [activeVisitorSpaceId, setQuery, visitorSpaces]);

	/**
	 * Display
	 */

	const getItemCounts = useCallback(
		(type: VisitorSpaceMediaType): number => {
			const buckets = searchResults?.aggregations?.dcterms_format?.buckets || [];
			if (type === VisitorSpaceMediaType.All) {
				return sum(buckets.map((item) => item.doc_count));
			} else {
				return buckets.find((bucket) => bucket.key === type)?.doc_count || 0;
			}
		},
		[searchResults]
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

	const dropdownOptions = useMemo(() => {
		const dynamicOptions: VisitorSpaceDropdownOption[] = visitorSpaces.map(
			({ spaceName, endAt, spaceMaintainerId }: Visit): VisitorSpaceDropdownOption => {
				const accessEndDate = isMobile
					? formatSameDayTimeOrDate(asDate(endAt))
					: formatMediumDateWithTime(asDate(endAt));

				return {
					id: spaceMaintainerId,
					label: spaceName || '',
					extraInfo: accessEndDate,
				};
			}
		);

		return [getDefaultOption(), ...dynamicOptions];
	}, [visitorSpaces, isMobile]);

	const filters = useMemo(
		() => VISITOR_SPACE_FILTERS().filter(({ isDisabled }) => !isDisabled?.()),
		[]
	);

	/**
	 * Methods
	 */

	const prepareSearchValue = (
		value = ''
	): { [SEARCH_QUERY_KEY]: (string | null)[] } | undefined => {
		const trimmed = value.trim();

		if (trimmed && !query.search?.includes(trimmed)) {
			return {
				[SEARCH_QUERY_KEY]: (query.search ?? []).concat(trimmed),
			};
		}

		return undefined;
	};

	const onSearch = async (newValue: string) => {
		const value = prepareSearchValue(newValue);

		value &&
			setQuery({
				...value,
				page: 1,
			});
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
		// Reset all filters except the maintainer
		setQuery({
			...VISITOR_SPACE_QUERY_PARAM_INIT,
			maintainer: query.maintainer,
		});
	};

	const onSubmitFilter = (id: VisitorSpaceFilterId, values: unknown) => {
		const searchValue = prepareSearchValue(searchBarInputState);
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

		setQuery({ [id]: data, filter: undefined, page: 1, ...(searchValue ? searchValue : {}) });
		setSearchBarInputState(undefined);
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
		const { format, orderProp, orderDirection, page, maintainer, ...rest } = {
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

	const onVisitorSpaceSelected = (id: string): void => {
		if (id === PUBLIC_COLLECTION) {
			setQuery({
				...VISITOR_SPACE_QUERY_PARAM_INIT,
				[VisitorSpaceFilterId.Maintainer]: undefined,
			});
			return;
		}

		setQuery({
			...VISITOR_SPACE_QUERY_PARAM_INIT,
			[VisitorSpaceFilterId.Maintainer]: id,
		});
	};

	/**
	 * Computed
	 */

	const keywords = (query.search ?? []).filter((str) => !!str) as string[];
	const isLoadedWithoutResults = !!searchResults && searchResults?.items?.length === 0;
	const isLoadedWithResults = !!searchResults && searchResults?.items?.length > 0;
	const searchResultsNoAccess = (searchResultsError as HTTPError)?.response?.status === 403;
	const activeFilters = useMemo(() => mapFiltersToTags(query), [query]);
	const showVisitorSpacesDropdown = useMemo(
		() => isLoggedIn && visitorSpaces.length > 0,
		[isLoggedIn, visitorSpaces]
	);

	const searchResultCardData = useMemo((): IdentifiableMediaCard[] => {
		return (searchResults?.items || []).map((item): IdentifiableMediaCard => {
			const type = item.dctermsFormat as IeObjectTypes;

			return {
				schemaIdentifier: item.schemaIdentifier,
				maintainerSlug: item.maintainerSlug,
				duration: item.duration,
				description: item.description,
				title: item.name,
				publishedAt: item.datePublished ? asDate(item.datePublished) : undefined,
				publishedBy: item.maintainerName || '',
				type,
				preview: item.thumbnailUrl || undefined,
				meemooIdentifier: item.meemooIdentifier,
				name: item.name,
				hasRelated: (item.related_count || 0) > 0,
				isKeyUser: item.accessThrough?.includes(IeObjectAccessThrough.SECTOR),
				hasTempAccess: item.accessThrough?.includes(
					IeObjectAccessThrough.VISITOR_SPACE_FULL ||
						IeObjectAccessThrough.VISITOR_SPACE_FOLDERS
				),
				...(!isNil(type) && {
					icon: item.thumbnailUrl ? TYPE_TO_ICON_MAP[type] : TYPE_TO_NO_ICON_MAP[type],
				}),
			};
		});
	}, [searchResults?.items]);

	/**
	 * Render
	 */
	const renderResearchWarning = (): ReactNode => (
		<Callout
			icon={<Icon name={IconNamesLight.Info} aria-hidden />}
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
	);

	const renderBreadcrumbs = (): ReactNode => {
		const staticBreadcrumbs: Breadcrumb[] = [
			{
				label: `${tHtml(
					'pages/bezoekersruimte/visitor-space-slug/index___breadcrumbs___home'
				)}`,
				to: ROUTES.home,
			},
			{
				label: `${tHtml(
					'pages/bezoekersruimte/visitor-space-slug/index___breadcrumbs___search'
				)}`,
				to: ROUTES.search,
			},
		];

		const dynamicBreadcrumbs: Breadcrumb[] =
			!isNil(activeVisitorSpace) && activeVisitorSpace.spaceMaintainerId !== PUBLIC_COLLECTION
				? [
						{
							label: activeVisitorSpace?.spaceName || '',
							to: `${ROUTES.search}?maintainer=${activeVisitorSpace?.spaceMaintainerId}`,
						},
				  ]
				: [];

		return (
			<Breadcrumbs
				className="u-my-16"
				items={[...staticBreadcrumbs, ...dynamicBreadcrumbs]}
				icon={<Icon name={IconNamesLight.AngleRight} />}
			/>
		);
	};

	const renderFilterMenu = () => {
		const filterMenuCls = clsx('p-visitor-space__filter-menu', {
			'u-mr-32:md': viewMode === 'list' && isLoadedWithResults,
		});

		return (
			<div className={filterMenuCls}>
				<FilterMenu
					activeSort={activeSort}
					filters={filters}
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
					<Icon
						name={itemIsInAFolder ? IconNamesSolid.Bookmark : IconNamesLight.Bookmark}
						aria-hidden
					/>
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

	const renderTempAccessLabel = () => {
		// Strip out public collection and own visitor space (cp)
		const visitorSpaces: VisitorSpaceDropdownOption[] = dropdownOptions.filter(
			(visitorSpace: VisitorSpaceDropdownOption): boolean => {
				const isPublicColelction = visitorSpace.id == PUBLIC_COLLECTION;
				const isOwnVisitorSapce = isCPAdmin && visitorSpace.id === user?.maintainerId;

				return !isPublicColelction && !isOwnVisitorSapce;
			}
		);

		if (isEmpty(visitorSpaces)) {
			return;
		}

		// Create a link element for each visitor space
		const visitorSpaceLinks = visitorSpaces.map(
			(visitorSpace: VisitorSpaceDropdownOption): ReactNode => (
				<Link key={visitorSpace.id} href={`/zoeken?maintainer=${visitorSpace?.id}`}>
					<a aria-label={visitorSpace?.label}>{visitorSpace?.label}</a>
				</Link>
			)
		);

		return (
			<div className="p-visitor-space__temp-access-container">
				<Icon name={IconNamesLight.Clock} />
				<span className="p-visitor-space__temp-access-label">
					{tText(
						'modules/visitor-space/components/visitor-space-search-page/visitor-space-search-page___tijdelijke-toegang'
					)}{' '}
					{visitorSpaceLinks.length === 1 && visitorSpaceLinks[0]}
					{visitorSpaceLinks.length > 1 &&
						visitorSpaceLinks.map(
							(visitorSpaceLink: ReactNode, i: number): ReactNode => {
								const isLast = i === visitorSpaceLinks.length - 1;
								const isSecondLast = i === visitorSpaceLinks.length - 2;

								return (
									<>
										{visitorSpaceLink}
										{!isLast && !isSecondLast && ', '}
										{isSecondLast && ' en '}
									</>
								);
							}
						)}
					{'.'}
				</span>
			</div>
		);
	};

	const renderResults = () => (
		<>
			<MediaCardList
				items={searchResultCardData}
				keywords={keywords}
				sidebar={renderFilterMenu()}
				view={viewMode === 'grid' ? 'grid' : 'list'}
				buttons={renderCardButtons}
				className="p-media-card-list"
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

	const renderVisitorSpace = () => {
		return (
			<>
				{visitorSpaces && (
					<div className="p-visitor-space">
						<section className="u-bg-black u-pt-8">
							<div className="l-container">
								<FormControl
									className="c-form-control--label-hidden u-mb-24"
									id={`react-select-${labelKeys.search}-input`}
									label={tHtml(
										'pages/bezoekersruimte/slug___zoek-op-trefwoord-jaartal-aanbieder'
									)}
								>
									<div
										className={clsx('p-visitor-space__searchbar', {
											'p-visitor-space__searchbar--has-dropdown':
												showVisitorSpacesDropdown,
										})}
									>
										{showVisitorSpacesDropdown && (
											<VisitorSpaceDropdown
												options={dropdownOptions}
												selectedOptionId={
													activeVisitorSpaceId || PUBLIC_COLLECTION
												}
												onSelected={onVisitorSpaceSelected}
											/>
										)}
										<TagSearchBar
											allowCreate
											hasDropdown={showVisitorSpacesDropdown}
											clearLabel={tHtml(
												'pages/bezoekersruimte/slug___wis-volledige-zoekopdracht'
											)}
											inputState={[
												searchBarInputState,
												setSearchBarInputState,
											]}
											instanceId={labelKeys.search}
											isMulti
											onClear={onResetFilters}
											onRemoveValue={onRemoveTag}
											onSearch={onSearch}
											placeholder={tText(
												'pages/bezoekersruimte/slug___zoek-op-trefwoord-jaartal-aanbieder'
											)}
											infoContent={tText(
												'modules/visitor-space/components/visitor-space-search-page/visitor-space-search-page___pages-bezoekersruimte-zoeken-zoek-info'
											)}
											size="lg"
											syncSearchValue={false}
											value={activeFilters}
										/>
									</div>
								</FormControl>
								<ScrollableTabs
									variants={['dark']}
									tabs={tabs}
									onClick={onTabClick}
								/>
							</div>
						</section>

						<aside className="u-bg-platinum">
							<div
								className={clsx('l-container', {
									'u-py-32': showResearchWarning,
								})}
							>
								{showResearchWarning
									? renderResearchWarning()
									: renderBreadcrumbs()}

								{!isKioskUser && isLoggedIn && renderTempAccessLabel()}
							</div>
						</aside>

						<section
							className={clsx(
								'p-visitor-space__results u-page-bottom-margin u-bg-platinum',
								{
									'p-visitor-space__results--placeholder': isLoadedWithoutResults,
									'u-pt-0': showResearchWarning,
								}
							)}
						>
							<div className="l-container">
								{/* Only render filters when there are no results yet, when the results are loaded we render the filter menu using MediaCardList */}
								{!isLoadedWithResults && renderFilterMenu()}
								{isLoadedWithoutResults && (
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
								{isLoadedWithResults && renderResults()}
							</div>
						</section>
					</div>
				)}

				{!searchResultsLoading && (
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
	};

	const renderPageContent = () => {
		if (searchResultsLoading) {
			return <Loading fullscreen owner="visitor space search page: render page content" />;
		}

		if (searchResultsNoAccess) {
			return (
				<ErrorNoAccess
					visitorSpaceSlug={String(activeVisitorSpace?.spaceSlug)}
					description={tHtml(
						'modules/visitor-space/components/visitor-space-search-page/visitor-space-search-page___deze-bezoekersruimte-is-momenteel-niet-beschikbaar'
					)}
				/>
			);
		}

		return renderVisitorSpace();
	};

	return renderPageContent();
};

export default VisitorSpaceSearchPage;
