import {
	Breadcrumb,
	Breadcrumbs,
	Button,
	FormControl,
	OrderDirection,
	TabProps,
} from '@meemoo/react-components';
import clsx from 'clsx';
import { addYears, isAfter } from 'date-fns';
import { HTTPError } from 'ky';
import { intersection, isEmpty, isNil, kebabCase, sortBy, sum } from 'lodash-es';
import Head from 'next/head';
import Link from 'next/link';
import { stringifyUrl } from 'query-string';
import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MultiValue } from 'react-select';
import { useQueryParams } from 'use-query-params';

import { GroupName, Permission } from '@account/const';
import { selectIsLoggedIn, selectUser } from '@auth/store/user';
import { useGetIeObjectFormatCounts } from '@ie-objects/hooks/get-ie-object-format-counts';
import { useGetIeObjects } from '@ie-objects/hooks/get-ie-objects';
import { IeObjectAccessThrough, IeObjectSearchAggregations } from '@ie-objects/types';
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
import {
	MAX_COUNT_SEARCH_RESULTS,
	PAGE_NUMBER_OF_MANY_RESULTS_TILE,
} from '@shared/components/MediaCardList/MediaCardList.const';
import NextLinkWrapper from '@shared/components/NextLinkWrapper/NextLinkWrapper';
import { QUERY_KEYS, ROUTE_PARTS, ROUTES } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tText } from '@shared/helpers/translate';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useIsKeyUser } from '@shared/hooks/is-key-user';
import { useLocalStorage } from '@shared/hooks/use-localStorage/use-local-storage';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { selectFolders } from '@shared/store/ie-objects';
import {
	selectLastScrollPosition,
	selectShowNavigationBorder,
	setLastScrollPosition,
	setShowZendesk,
} from '@shared/store/ui';
import {
	Breakpoints,
	IeObjectsSearchFilterField,
	IeObjectTypes,
	SortObject,
	Visit,
	VisitorSpaceMediaType,
	VisitStatus,
} from '@shared/types';
import { asDate, formatMediumDateWithTime, formatSameDayTimeOrDate } from '@shared/utils';
import { scrollTo } from '@shared/utils/scroll-to-top';
import { useGetActiveVisitForUserAndSpace } from '@visits/hooks/get-active-visit-for-user-and-space';
import { VisitsService } from '@visits/services';
import { VisitTimeframe } from '@visits/types';

import {
	AddToFolderBlade,
	AdvancedFilterFormState,
	ConsultableMediaFilterFormState,
	ConsultableOnlyOnLocationFilterFormState,
	CreatedFilterFormState,
	CreatorFilterFormState,
	DurationFilterFormState,
	FilterMenu,
	FilterMenuFilterOption,
	GenreFilterFormState,
	initialFields,
	KeywordsFilterFormState,
	LanguageFilterFormState,
	MaintainerFilterFormState,
	MediumFilterFormState,
	PublishedFilterFormState,
} from '..';
import {
	PUBLIC_COLLECTION,
	VISITOR_SPACE_FILTERS,
	VISITOR_SPACE_ITEM_COUNT,
	VISITOR_SPACE_QUERY_PARAM_CONFIG,
	VISITOR_SPACE_QUERY_PARAM_INIT,
	VISITOR_SPACE_SORT_OPTIONS,
	VISITOR_SPACE_TABS,
	VISITOR_SPACE_VIEW_TOGGLE_OPTIONS,
} from '../../const';
import {
	ElasticsearchFieldNames,
	MetadataProp,
	TagIdentity,
	VisitorSpaceFilterId,
} from '../../types';
import { mapFiltersToTags, tagPrefix } from '../../utils';
import { mapFiltersToElastic, mapMaintainerToElastic } from '../../utils/elastic-filters';

const labelKeys = {
	search: 'SearchPage__search',
};

const getDefaultOption = (): VisitorSpaceDropdownOption => {
	return {
		slug: PUBLIC_COLLECTION,
		label: tText(
			'modules/visitor-space/components/visitor-space-search-page/visitor-space-search-page___pages-bezoekersruimte-publieke-catalogus'
		),
	};
};

const SearchPage: FC = () => {
	const { tHtml, tText } = useTranslation();
	const windowSize = useWindowSizeContext();
	const dispatch = useDispatch();

	const canManageFolders: boolean | null = useHasAllPermission(Permission.MANAGE_FOLDERS);
	const showResearchWarning = useHasAllPermission(Permission.SHOW_RESEARCH_WARNING);
	const isKioskUser = useHasAnyGroup(GroupName.KIOSK_VISITOR);
	const isCPAdmin = useHasAnyGroup(GroupName.CP_ADMIN);
	const isMeemooAdmin = useHasAnyGroup(GroupName.MEEMOO_ADMIN);
	const isAnonymousUser = useHasAnyGroup(GroupName.ANONYMOUS);

	/**
	 * State
	 */
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const user = useSelector(selectUser);
	const showNavigationBorder = useSelector(selectShowNavigationBorder);
	const collections = useSelector(selectFolders);
	const isKeyUser = useIsKeyUser();
	const lastScrollPosition = useSelector(selectLastScrollPosition);

	// We need 2 different states for the filter menu for different viewport sizes
	const [filterMenuOpen, setFilterMenuOpen] = useState(true);
	const [mobileFilterMenuOpen, setMobileFilterMenuOpen] = useState(false);

	const [viewMode, setViewMode] = useLocalStorage('HET_ARCHIEF.search.viewmode', 'grid');

	const [selectedCard, setSelectedCard] = useState<IdentifiableMediaCard | null>(null);
	const [isAddToFolderBladeOpen, setShowAddToFolderBlade] = useState(false);

	const [searchBarInputValue, setSearchBarInputValue] = useState<string>();
	const [query, setQuery] = useQueryParams(VISITOR_SPACE_QUERY_PARAM_CONFIG);

	const [visitorSpaces, setVisitorSpaces] = useState<Visit[]>([]);
	const { data: activeVisitRequest, isLoading: isLoadingActiveVisitRequest } =
		useGetActiveVisitForUserAndSpace(query[VisitorSpaceFilterId.Maintainer], user, true);

	const [isInitialPageLoad, setIsInitialPageLoad] = useState(false);

	const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.md);
	const activeSort: SortObject = {
		orderProp: query.orderProp,
		orderDirection: (query.orderDirection as OrderDirection) ?? undefined,
	};

	const queryParamMaintainer = query?.[VisitorSpaceFilterId.Maintainer];
	const activeVisitorSpaceSlug: string | undefined = useMemo(() => {
		if (!visitorSpaces.length) {
			// Until visitor spaces is loaded, we cannot know which option to select
			return undefined;
		}

		if (
			queryParamMaintainer &&
			visitorSpaces
				.map((visitorSpace) => visitorSpace.spaceSlug)
				.includes(queryParamMaintainer)
		) {
			return queryParamMaintainer;
		}

		// No visitor space set in query params or the visitor space is not recognized
		setQuery({
			...query,
			[VisitorSpaceFilterId.Maintainer]: undefined,
		});
		return PUBLIC_COLLECTION;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryParamMaintainer, visitorSpaces]);

	const isPublicCollection =
		activeVisitorSpaceSlug === undefined || activeVisitorSpaceSlug === PUBLIC_COLLECTION;

	/**
	 * Data
	 */
	const getVisitorSpaces = useCallback(async (): Promise<Visit[]> => {
		if (!user || isKioskUser || isAnonymousUser) {
			setVisitorSpaces([]);
			return [];
		}

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
	}, [isAnonymousUser, isKioskUser, user]);

	const {
		data: searchResults,
		isLoading: searchResultsLoading,
		isRefetching: searchResultsRefetching,
		error: searchResultsError,
	} = useGetIeObjects(
		{
			filters: [
				...mapMaintainerToElastic(query, activeVisitRequest),
				...mapFiltersToElastic(query),
			],
			page: query.page || 1,
			size: VISITOR_SPACE_ITEM_COUNT,
			sort: activeSort,
		},
		{ enabled: !isLoadingActiveVisitRequest }
	);
	const { data: formatCounts } = useGetIeObjectFormatCounts(
		[
			...mapMaintainerToElastic(query, activeVisitRequest),
			...mapFiltersToElastic(query),
		].filter((item) => item.field !== IeObjectsSearchFilterField.FORMAT),

		// Enabled when search query is finished, so it loads the tab counts after the initial results
		{ enabled: !searchResultsRefetching }
	);

	const showManyResultsTile = query.page === PAGE_NUMBER_OF_MANY_RESULTS_TILE;

	/**
	 * Effects
	 */

	useEffect(() => {
		if (!isLoggedIn) {
			return;
		}

		getVisitorSpaces();
	}, [getVisitorSpaces, isLoggedIn]);

	useEffect(() => {
		dispatch(setShowZendesk(!isKioskUser && !query[VisitorSpaceFilterId.Maintainer]));
	}, [dispatch, isKioskUser, query]);

	useEffect(() => {
		// Filter out all disabled query param keys/ids
		const disabledFilterKeys: VisitorSpaceFilterId[] = VISITOR_SPACE_FILTERS(
			isPublicCollection,
			isKioskUser,
			isKeyUser
		)
			.filter(({ isDisabled }: FilterMenuFilterOption): boolean => !!isDisabled?.())
			.map(
				({ id }: FilterMenuFilterOption): VisitorSpaceFilterId => id as VisitorSpaceFilterId
			);

		// Loop over all existing query params and strip out the disabled filters if they exist
		const disabledKeysSet: Set<VisitorSpaceFilterId> = new Set(disabledFilterKeys);
		const strippedQuery = Object.keys(query).reduce((result, current) => {
			const id = current as VisitorSpaceFilterId;
			if (disabledKeysSet.has(id)) {
				return {
					...result,
					[id]: VISITOR_SPACE_QUERY_PARAM_INIT[id],
				};
			}

			return {
				...result,
				[id]: (query as any)[id],
			};
		}, {});

		setQuery(strippedQuery);
		// Make sure the dependency array contains the same items as passed to VISITOR_SPACE_FILTERS
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isKeyUser, isPublicCollection]);

	useEffect(() => {
		// Ward: wait until items are rendered on the screen before scrolling
		if (
			lastScrollPosition &&
			lastScrollPosition.page === ROUTES.search &&
			searchResults?.items &&
			window.scrollY === 0
		) {
			setTimeout(() => {
				const item = document.getElementById(
					`${lastScrollPosition.itemId}`
				) as HTMLElement | null;

				item?.scrollIntoView({ block: 'center', behavior: 'smooth' });
				dispatch(setLastScrollPosition(null));
			}, 100);
		}
	}, [dispatch, lastScrollPosition, searchResults?.items]);

	useEffect(() => {
		setIsInitialPageLoad(true);
	}, []);

	/**
	 * Display
	 */

	const limitToMaxResults = (count: number): number => {
		return Math.min(count, MAX_COUNT_SEARCH_RESULTS);
	};

	const getItemCounts = useCallback(
		(type: VisitorSpaceMediaType): number => {
			if (type === VisitorSpaceMediaType.All) {
				return sum(Object.values(formatCounts || {})) || 0;
			} else {
				return formatCounts?.[type] || 0;
			}
		},
		[formatCounts]
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

	const visitorSpaceDropdownOptions = useMemo(() => {
		const dynamicOptions: VisitorSpaceDropdownOption[] = visitorSpaces.map(
			({ spaceName, endAt, spaceSlug }: Visit): VisitorSpaceDropdownOption => {
				const endAtDate = asDate(endAt);
				const hideEndDate = !endAtDate || isAfter(endAtDate, addYears(new Date(), 100 - 1));
				const formattedDate = isMobile
					? formatSameDayTimeOrDate(endAtDate)
					: formatMediumDateWithTime(endAtDate);

				const accessEndDate: string | undefined = hideEndDate ? undefined : formattedDate;

				return {
					slug: spaceSlug,
					label: spaceName || '',
					extraInfo: accessEndDate,
				};
			}
		);

		return isKioskUser
			? [{ slug: user?.visitorSpaceSlug || '', label: user?.organisationName || '' }]
			: [getDefaultOption(), ...dynamicOptions];
	}, [visitorSpaces, user, isKioskUser, isMobile]);

	const filters = useMemo(
		() =>
			VISITOR_SPACE_FILTERS(isPublicCollection, isKioskUser, isKeyUser).filter(
				({ isDisabled }) => !isDisabled?.()
			),
		[isPublicCollection, isKioskUser, isKeyUser]
	);

	/**
	 * Methods
	 */

	const prepareSearchValue = (
		value = ''
	): { [QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: (string | null)[] } | undefined => {
		const trimmed = value.trim();

		if (trimmed && !query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]?.includes(trimmed)) {
			return {
				[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: (
					query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] ?? []
				).concat(trimmed),
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

	/**
	 * Reset all filters except the maintainer
	 */
	const onResetFilters = () => {
		setQuery({
			...VISITOR_SPACE_QUERY_PARAM_INIT,
			[VisitorSpaceFilterId.Maintainer]: query[VisitorSpaceFilterId.Maintainer],
		});
	};

	/**
	 * Reset one filter by id
	 * @param id
	 */
	const onResetFilter = (id: VisitorSpaceFilterId) => {
		const newQueryParams = { ...query };
		newQueryParams[id] = undefined;
		setQuery(newQueryParams);
	};

	/**
	 * Set one filter with its values
	 * @param id
	 * @param values
	 */
	const onSubmitFilter = (id: VisitorSpaceFilterId, values: unknown) => {
		const searchValue = prepareSearchValue(searchBarInputValue);
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
				data = (values as CreatorFilterFormState).creator;
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

			case VisitorSpaceFilterId.Maintainers:
				data = (values as MaintainerFilterFormState).maintainers;
				break;

			case VisitorSpaceFilterId.ConsultableOnlyOnLocation:
				// Info: remove query param if false (= set to undefined)
				data = (values as ConsultableOnlyOnLocationFilterFormState)[
					IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION
				]
					? (values as ConsultableOnlyOnLocationFilterFormState)[
							IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION
					  ]
					: undefined;
				break;

			case VisitorSpaceFilterId.ConsultableMedia:
				// Info: remove query param if false (= set to undefined)
				data = (values as ConsultableMediaFilterFormState)[
					IeObjectsSearchFilterField.CONSULTABLE_MEDIA
				]
					? (values as ConsultableMediaFilterFormState)[
							IeObjectsSearchFilterField.CONSULTABLE_MEDIA
					  ]
					: undefined;
				break;

			case VisitorSpaceFilterId.Advanced:
				data = (values as AdvancedFilterFormState).advanced.filter((advanced) => {
					return !isNil(advanced.val) && advanced.val !== initialFields().val;
				});

				if (data.length === 0) {
					setQuery({ [id]: undefined, filter: undefined, page: 1 });
					return;
				}

				break;

			default:
				console.warn(`[WARN][VisitorSpacePage] No submit handler for ${id}`);
				break;
		}

		const page = isInitialPageLoad ? query.page : 1;

		setQuery({ [id]: data, filter: undefined, page, ...(searchValue ? searchValue : {}) });
		setSearchBarInputValue('');
		isInitialPageLoad && setIsInitialPageLoad(false);
	};

	const onRemoveTag = (tags: MultiValue<TagIdentity>) => {
		const updatedQuery: Record<string, unknown> = {};

		tags.forEach((tag) => {
			switch (tag.key) {
				case VisitorSpaceFilterId.Genre:
				case VisitorSpaceFilterId.Keywords:
				case VisitorSpaceFilterId.Language:
				case VisitorSpaceFilterId.Medium:
				case VisitorSpaceFilterId.Maintainers:
				case QUERY_PARAM_KEY.SEARCH_QUERY_KEY:
				case VisitorSpaceFilterId.Creator:
					updatedQuery[tag.key] = [
						...((updatedQuery[tag.key] as Array<unknown>) || []),
						`${tag.value}`.replace(tagPrefix(tag.key), ''),
					];
					break;

				case VisitorSpaceFilterId.Advanced:
				case VisitorSpaceFilterId.Created:
				case VisitorSpaceFilterId.Duration:
				case VisitorSpaceFilterId.Published:
					updatedQuery[tag.key] = [
						...((updatedQuery[tag.key] as Array<unknown>) || []),
						tag,
					];
					break;

				case VisitorSpaceFilterId.ConsultableMedia:
				case VisitorSpaceFilterId.ConsultableOnlyOnLocation:
					// eslint-disable-next-line no-case-declarations
					const newValue = `${tag.value ?? 'false'}`.replace(tagPrefix(tag.key), '');
					updatedQuery[tag.key] = newValue === 'true' ? 'false' : 'true';
					break;

				default:
					updatedQuery[tag.key] = tag.value;
					break;
			}
		});

		// Destructure to keyword-able filters
		/* eslint-disable @typescript-eslint/no-unused-vars */
		const {
			format,
			orderProp,
			orderDirection,
			page,
			// Dynamically destructure the maintainer qp using our enum so we don't need to change it every time the qp value changes
			[VisitorSpaceFilterId.Maintainer]: maintainer,
			...rest
		} = {
			...VISITOR_SPACE_QUERY_PARAM_INIT,
		};
		/* eslint-disable @typescript-eslint/no-unused-vars */

		setQuery({ ...rest, ...updatedQuery, page: 1 });
	};

	const onSortClick = (orderProp: string, orderDirection?: OrderDirection) => {
		setQuery({ orderProp, orderDirection, page: 1 });
	};

	const onTabClick = (tabId: string | number) => {
		setQuery({ format: String(tabId), page: 1 });
	};

	const onViewToggle = (nextMode: string) => setViewMode(nextMode as MediaCardViewMode);

	const onVisitorSpaceSelected = (id: string): void => {
		setQuery({
			...query,
			page: 1,
			[VisitorSpaceFilterId.Maintainer]: id === PUBLIC_COLLECTION ? undefined : id,
		});
	};

	/**
	 * Computed
	 */

	const isLoadedWithoutResults = !!searchResults && searchResults?.items?.length === 0;
	const isLoadedWithResults = !!searchResults && searchResults?.items?.length > 0;
	const searchResultsNoAccess = (searchResultsError as HTTPError)?.response?.status === 403;
	const showVisitorSpacesDropdown = (isLoggedIn && visitorSpaces.length > 0) || isKioskUser;
	const activeFilters = useMemo(() => mapFiltersToTags(query), [query]);

	const searchResultCardData = useMemo((): IdentifiableMediaCard[] => {
		return (searchResults?.items || []).map((item): IdentifiableMediaCard => {
			const type = item.dctermsFormat as IeObjectTypes;
			const showKeyUserLabel = item.accessThrough?.includes(IeObjectAccessThrough.SECTOR);
			const hasAccessToVisitorSpaceOfObject = !!intersection(item?.accessThrough, [
				IeObjectAccessThrough.VISITOR_SPACE_FOLDERS,
				IeObjectAccessThrough.VISITOR_SPACE_FULL,
			]).length;

			// Only show pill when the public collection is selected (https://meemoo.atlassian.net/browse/ARC-1210?focusedCommentId=39708)
			const hasTempAccess =
				!isKioskUser && isPublicCollection && hasAccessToVisitorSpaceOfObject;

			const link: string | undefined = stringifyUrl({
				url: `/${ROUTE_PARTS.search}/${item.maintainerSlug}/${item.schemaIdentifier}/${
					kebabCase(item.name) || 'titel'
				}`,
				query: {
					[QUERY_PARAM_KEY.HIGHLIGHTED_SEARCH_TERMS]: searchResults?.searchTerms,
				},
			});

			return {
				schemaIdentifier: item.schemaIdentifier,
				maintainerSlug: item.maintainerSlug,
				duration: item.duration,
				description: item.description,
				title: item.name,
				publishedOrCreatedDate: asDate(
					item.datePublished ?? item.dateCreatedLowerBound ?? null
				),
				publishedBy: item.maintainerName || '',
				type,
				preview: item.thumbnailUrl || undefined,
				meemooIdentifier: item.meemooIdentifier,
				name: item.name,
				hasRelated: (item.related_count || 0) > 0,
				hasTempAccess,
				showKeyUserLabel,
				...(!isNil(type) && {
					icon: item.thumbnailUrl ? TYPE_TO_ICON_MAP[type] : TYPE_TO_NO_ICON_MAP[type],
				}),
				link,
				previousPage: ROUTES.search,
			};
		});
	}, [isKioskUser, isPublicCollection, searchResults?.items, searchResults?.searchTerms]);

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
				<Link passHref href={`/${ROUTE_PARTS.kioskConditions}`}>
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
			!isNil(activeVisitRequest) && activeVisitRequest.spaceMaintainerId !== PUBLIC_COLLECTION
				? [
						{
							label: activeVisitRequest?.spaceName || '',
						} as Breadcrumb, // Last breadcrumb doesn't need a link, since you are on that page
				  ]
				: [];

		return (
			<Breadcrumbs
				className="u-my-16"
				items={[...staticBreadcrumbs, ...dynamicBreadcrumbs]}
				icon={<Icon name={IconNamesLight.AngleRight} />}
				linkComponent={NextLinkWrapper}
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
					onFilterSubmit={onSubmitFilter}
					onFilterReset={onResetFilter}
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
				onClick={() => {
					setSelectedCard(item as IdentifiableMediaCard);
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
		if (isMeemooAdmin || !isPublicCollection || isKioskUser || !isLoggedIn) {
			// Don't show the temporary access label for:
			// - MEEMOO admins, since they have access to all visitor spaces
			// - when a visitor space is selected (https://meemoo.atlassian.net/browse/ARC-1210?focusedCommentId=39708)
			// When the user is a kiosk user, since kiosk users have unlimited access
			// When the user is not logged in, since then he cannot have temporary access
			return null;
		}

		// Strip out public collection and own visitor space (cp)
		let visitorSpaces: VisitorSpaceDropdownOption[] = visitorSpaceDropdownOptions.filter(
			(visitorSpace: VisitorSpaceDropdownOption): boolean => {
				const isPublicCollection = visitorSpace.slug == PUBLIC_COLLECTION;
				const isOwnVisitorSpace = isCPAdmin && visitorSpace.slug === user?.maintainerId;

				return !isPublicCollection && !isOwnVisitorSpace;
			}
		);

		if (isCPAdmin) {
			// Don't show the temporary access label for CP_ADMIN's own visitor space
			visitorSpaces = visitorSpaces.filter((space) => space.slug !== user?.visitorSpaceSlug);
		}

		if (isEmpty(visitorSpaces)) {
			return;
		}

		// Create a link element for each visitor space
		const visitorSpaceLinks = visitorSpaces.map(
			(visitorSpace: VisitorSpaceDropdownOption): ReactNode => (
				<Link
					key={visitorSpace.slug}
					href={`/${ROUTE_PARTS.search}?${VisitorSpaceFilterId.Maintainer}=${visitorSpace?.slug}`}
				>
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
				keywords={searchResults?.searchTerms}
				sidebar={renderFilterMenu()}
				view={viewMode === 'grid' ? 'grid' : 'list'}
				renderButtons={renderCardButtons}
				className="p-media-card-list"
				showManyResultsTile={showManyResultsTile}
			/>
			<PaginationBar
				className="u-mb-48"
				start={(query.page - 1) * VISITOR_SPACE_ITEM_COUNT}
				count={VISITOR_SPACE_ITEM_COUNT}
				showBackToTop
				total={limitToMaxResults(getItemCounts(query.format as VisitorSpaceMediaType))}
				onPageChange={(zeroBasedPage) => {
					scrollTo(0, 'instant');
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
				<Head>
					<link rel="canonical" href="https://hetarchief.be/zoeken" />
				</Head>

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
												options={visitorSpaceDropdownOptions}
												selectedOptionId={
													isKioskUser
														? user?.visitorSpaceSlug ?? ''
														: activeVisitorSpaceSlug ||
														  PUBLIC_COLLECTION
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
											inputValue={searchBarInputValue}
											setInputValue={setSearchBarInputValue}
											instanceId={labelKeys.search}
											isMulti
											onClear={onResetFilters}
											onRemoveValue={onRemoveTag}
											onSearch={onSearch}
											placeholder={tText(
												'pages/bezoekersruimte/slug___zoek-op-trefwoord-jaartal-aanbieder'
											)}
											infoContent={tHtml(
												'modules/visitor-space/components/visitor-space-search-page/visitor-space-search-page___pages-bezoekersruimte-zoeken-zoek-info'
											)}
											size="lg"
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

								{renderTempAccessLabel()}
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
							selectedCard
								? {
										schemaIdentifier: selectedCard.schemaIdentifier,
										title: selectedCard.name,
								  }
								: undefined
						}
						onClose={() => {
							setShowAddToFolderBlade(false);
							setSelectedCard(null);
						}}
						onSubmit={async () => {
							setShowAddToFolderBlade(false);
							setSelectedCard(null);
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
					visitorSpaceSlug={String(activeVisitRequest?.spaceSlug)}
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

export default SearchPage;
