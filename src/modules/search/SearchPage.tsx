import { GroupName, Permission } from '@account/const';
import { useGetFolders } from '@account/hooks/get-folders';
import { FoldersService } from '@account/services/folders';
import { selectIsLoggedIn, selectUser } from '@auth/store/user/user.select';
import { useGetIeObjectFormatCounts } from '@ie-objects/hooks/use-get-ie-object-format-counts';
import { useGetIeObjects } from '@ie-objects/hooks/use-get-ie-objects';
import { isInAFolder } from '@ie-objects/utils/folders';
import { isNewspaperType } from '@meemoo/admin-core-ui/admin';
import {
	type Breadcrumb,
	Breadcrumbs,
	Button,
	FormControl,
	PaginationBar,
	type TabProps,
} from '@meemoo/react-components';
import { Callout } from '@shared/components/Callout';
import { ErrorNoAccess } from '@shared/components/ErrorNoAccess';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Loading } from '@shared/components/Loading';
import {
	getIconFromObjectType,
	type IdentifiableMediaCard,
	type MediaCardProps,
	type MediaCardViewMode,
} from '@shared/components/MediaCard';
import { MediaCardList } from '@shared/components/MediaCardList';
import {
	MAX_COUNT_SEARCH_RESULTS,
	PAGE_NUMBER_OF_MANY_RESULTS_TILE,
} from '@shared/components/MediaCardList/MediaCardList.const';
import NextLinkWrapper from '@shared/components/NextLinkWrapper/NextLinkWrapper';
import { getDefaultPaginationBarProps } from '@shared/components/PaginationBar/PaginationBar.consts';
import { Placeholder } from '@shared/components/Placeholder';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { ScrollableTabs, TabLabel } from '@shared/components/Tabs';
import { TagSearchBar } from '@shared/components/TagSearchBar';
import type { ClickableTag } from '@shared/components/TagSearchBar/TagSearchBar';
import { TagSearchBarInfo } from '@shared/components/TagSearchBar/TagSearchBarInfo/TagSearchBarInfo';
import type { ToggleOption } from '@shared/components/Toggle';
import { VisitorSpaceDropdown } from '@shared/components/VisitorSpaceDropdown/VisitorSpaceDropdown';
import type { VisitorSpaceDropdownOption } from '@shared/components/VisitorSpaceDropdown/VisitorSpaceDropdown.types';
import {
	GET_VISITOR_SPACE_VIEW_TOGGLE_OPTIONS,
	ROUTE_PARTS_BY_LOCALE,
	ROUTES_BY_LOCALE,
} from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { numberWithCommas } from '@shared/helpers';
import { getSearchLink } from '@shared/helpers/get-search-link';
import { getIeObjectDetailPath } from '@shared/helpers/ie-object-urls';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useIsKeyUser } from '@shared/hooks/is-key-user';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { useLocalStorage } from '@shared/hooks/use-localStorage/use-local-storage';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { toastService } from '@shared/services/toast-service';
import {
	selectLastScrollPosition,
	setBreadcrumbs,
	setLastScrollPosition,
	setLastSearchParams,
	setShowZendesk,
} from '@shared/store/ui';
import type { SortObject } from '@shared/types';
import { IeObjectsSearchFilterField, SearchPageMediaType } from '@shared/types/ie-objects';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { type VisitRequest, VisitStatus } from '@shared/types/visit-request';
import { asDate, formatMediumDateWithTime, formatSameDayTimeOrDate } from '@shared/utils/dates';
import { isMobileSize } from '@shared/utils/is-mobile';
import { scrollTo } from '@shared/utils/scroll-to-top';
import {
	AvoSearchOrderDirection,
	HetArchiefIeObjectAccessThrough,
	type HetArchiefIeObjectType,
} from '@viaa/avo2-types';
import { useGetActiveVisitRequestForUserAndSpace } from '@visit-requests/hooks/get-active-visit-request-for-user-and-space';
import { useGetVisitRequests } from '@visit-requests/hooks/get-visit-requests';
import { VisitTimeframe } from '@visit-requests/types';
import { AddToFolderBlade } from '@visitor-space/components/AddToFolderBlade';
import type { ConsultableMediaFilterFormState } from '@visitor-space/components/ConsultableMediaFilterForm/ConsultableMediaFilterForm.types';
import type { ConsultableOnlyOnLocationFilterFormState } from '@visitor-space/components/ConsultableOnlyOnLocationFilterForm/ConsultableOnlyOnLocationFilterForm.types';
import FilterMenu from '@visitor-space/components/FilterMenu/FilterMenu';
import type { FilterMenuFilterOption } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import {
	GLOBAL_ARCHIVE,
	SEARCH_PAGE_QUERY_PARAM_CONFIG,
	SEARCH_RESULTS_PAGE_SIZE,
	VISITOR_SPACE_QUERY_PARAM_INIT,
	VISITOR_SPACE_SORT_OPTIONS,
} from '@visitor-space/const';
import {
	getAdvancedFlyoutFilters,
	getAvailableSearchPageFilters,
	getUsableSearchPageFilters,
	getVisiblePanelFilters,
} from '@visitor-space/const/visitor-space-filters.const';
import { SEARCH_PAGE_IE_OBJECT_TABS } from '@visitor-space/const/visitor-space-tabs.const';
import { useSearchQueryFilters } from '@visitor-space/hooks/get-search-query-filters';
import { useGetThemeFilterOptions } from '@visitor-space/hooks/use-get-theme-filter-options';
import {
	type AdvancedFilter,
	SearchFilterId,
	type TagIdentity,
	type TextFilterCondition,
} from '@visitor-space/types';
import { getQueryForRemainingTags, mapFiltersToTags } from '@visitor-space/utils/map-filters';
import { migrateLegacyAdvancedFilters } from '@visitor-space/utils/migrate-legacy-advanced-filters';
import clsx from 'clsx';
import { addYears, isAfter } from 'date-fns';
import { compact, intersection, isEmpty, isNil, sortBy, sum } from 'es-toolkit/compat';
import type { HTTPError } from 'ky';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import queryString from 'query-string';
import React, {
	type FC,
	type ReactNode,
	type RefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { MultiValue } from 'react-select';
import { useQueryParams } from 'use-query-params';
import { MultiselectActionBar } from './components/MultiselectActionBar';
import { MultiselectErrorBanner } from './components/MultiselectErrorBanner';
import { ResultCardBookmarkSlot } from './components/ResultCardBookmarkSlot';
import { SelectableMediaCard } from './components/SelectableMediaCard';
import { useMultiselect } from './hooks/use-multiselect';
import { omitEmptyFilters } from './omit-empty-filters';
import styles from './SearchPage.module.scss';

const labelKeys = {
	search: 'SearchPage__search',
};

const getDefaultOption = (): VisitorSpaceDropdownOption => {
	return {
		slug: GLOBAL_ARCHIVE,
		label: tText(
			'modules/visitor-space/components/visitor-space-search-page/visitor-space-search-page___pages-bezoekersruimte-publieke-catalogus'
		),
	};
};

const SearchPage: FC<DefaultSeoInfo> = ({ url, canonicalUrl }) => {
	const windowSize = useWindowSizeContext();
	const dispatch = useDispatch();
	const locale = useLocale();

	const { data: folders, refetch: refetchFolders } = useGetFolders();
	// Theme slugs are what live in the url, the names shown in the pills come from this lookup
	const { labelsBySlug: themeLabelsBySlug } = useGetThemeFilterOptions();
	const canManageFolders: boolean | null = useHasAllPermission(Permission.MANAGE_FOLDERS);
	const showResearchWarning = useHasAllPermission(Permission.SHOW_RESEARCH_WARNING);
	const isKioskUser = useHasAnyGroup(GroupName.KIOSK_VISITOR);
	const isCPAdmin = useHasAnyGroup(GroupName.CP_ADMIN);
	const isMeemooAdmin = useHasAnyGroup(GroupName.MEEMOO_ADMIN);
	const isAnonymousUser = useHasAnyGroup(GroupName.ANONYMOUS);
	const searchParams = useSearchParams();

	/**
	 * State
	 */
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const user = useSelector(selectUser);
	const isKeyUser = useIsKeyUser();
	const lastScrollPosition = useSelector(selectLastScrollPosition);

	// We need 2 different states for the filter menu for different viewport sizes
	const [filterMenuOpen, setFilterMenuOpen] = useState(true);
	const [mobileFilterMenuOpen, setMobileFilterMenuOpen] = useState(false);

	const [viewMode, setViewMode] = useLocalStorage('HET_ARCHIEF.search.viewmode', 'grid');

	const [selectedCard, setSelectedCard] = useState<IdentifiableMediaCard | null>(null);
	const [isAddToFolderBladeOpen, setShowAddToFolderBlade] = useState(false);

	const [searchBarInputValue, setSearchBarInputValue] = useState<string>();
	const [query, setQuery] = useQueryParams(SEARCH_PAGE_QUERY_PARAM_CONFIG);

	// Select multiple search results to add them to folders at once
	// Changing the search, filters, tab, sort or page silently ends the multiselect mode
	// Only opening a filter panel ("filter" query param) does not change the results
	const { filter: _openFilterPanel, ...searchQueryWithoutOpenFilterPanel } = query;
	const multiselect = useMultiselect(JSON.stringify(searchQueryWithoutOpenFilterPanel));
	// Folders that could not be saved, so the user can retry
	const [failedMultiselectFolderIds, setFailedMultiselectFolderIds] = useState<string[] | null>(
		null
	);
	const [isSavingMultiselect, setIsSavingMultiselect] = useState(false);
	// The card that started the multiselect mode, to move the focus to its checkbox and back again
	const [multiselectStartId, setMultiselectStartId] = useState<string | null>(null);
	const multiselectSaveButtonRef = useRef<HTMLButtonElement>(null) as RefObject<HTMLButtonElement>;

	// Keep defaults only in code, not in the query params in the url
	const page = query.page || VISITOR_SPACE_QUERY_PARAM_INIT.page;
	const format = (query.format || VISITOR_SPACE_QUERY_PARAM_INIT.format) as SearchPageMediaType;
	const orderProp = query.orderProp || VISITOR_SPACE_QUERY_PARAM_INIT.orderProp;
	const orderDirection = (query.orderDirection ||
		VISITOR_SPACE_QUERY_PARAM_INIT.orderDirection) as AvoSearchOrderDirection;

	const isUserWithAccount = isLoggedIn && !!user && !isAnonymousUser;
	const { data: visitRequestsPaginated } = useGetVisitRequests(
		{
			page: 1,
			size: 100,
			orderProp: 'startAt',
			orderDirection: AvoSearchOrderDirection.DESC,
			status: VisitStatus.APPROVED,
			timeframe: VisitTimeframe.ACTIVE,
			personal: true,
		},
		{ enabled: !!user }
	);
	const accessibleVisitorSpaceRequests: VisitRequest[] = useMemo(
		() =>
			isUserWithAccount
				? sortBy(visitRequestsPaginated?.items || [], (visitRequest) =>
						visitRequest.spaceName?.toLowerCase()
					)
				: [],
		[isUserWithAccount, visitRequestsPaginated?.items]
	);

	const { data: activeVisitRequest, isLoading: isLoadingActiveVisitRequest } =
		useGetActiveVisitRequestForUserAndSpace(query[SearchFilterId.Maintainer], user);

	// The same filters the option lists of the individual filters search with
	const searchQueryFilters = useSearchQueryFilters();

	const [isInitialPageLoad, setIsInitialPageLoad] = useState(false);

	const isMobile = isMobileSize(windowSize);
	const activeSort: SortObject = {
		orderProp,
		orderDirection,
	};

	const queryParamMaintainer = query?.[SearchFilterId.Maintainer];
	// biome-ignore lint/correctness/useExhaustiveDependencies: render loop
	const activeVisitorSpaceSlug: string | undefined = useMemo(() => {
		if (!accessibleVisitorSpaceRequests.length) {
			// Until visitor spaces is loaded, we cannot know which option to select
			return undefined;
		}

		if (
			queryParamMaintainer &&
			accessibleVisitorSpaceRequests
				.map((visitorSpace) => visitorSpace.spaceSlug)
				.includes(queryParamMaintainer)
		) {
			return queryParamMaintainer;
		}

		// No visitor space set in query params or the visitor space is not recognized
		setQuery({
			...query,
			[SearchFilterId.Maintainer]: undefined,
		});
		return GLOBAL_ARCHIVE;
	}, [queryParamMaintainer, accessibleVisitorSpaceRequests]);

	// Global archive as opposed to the archive of one visitor space
	const isGlobalArchive =
		activeVisitorSpaceSlug === undefined || activeVisitorSpaceSlug === GLOBAL_ARCHIVE;

	/**
	 * Data
	 */

	const {
		data: searchResults,
		isLoading: searchResultsLoading,
		isRefetching: searchResultsRefetching,
		error: searchResultsError,
	} = useGetIeObjects(
		{
			filters: searchQueryFilters,
			page,
			size: SEARCH_RESULTS_PAGE_SIZE,
			sort: activeSort,
		},
		!isLoadingActiveVisitRequest
	);
	const { data: formatCounts } = useGetIeObjectFormatCounts(
		searchQueryFilters.filter((item) => item.field !== IeObjectsSearchFilterField.FORMAT),

		// Enabled when search query is finished, so it loads the tab counts after the initial results
		!searchResultsRefetching
	);

	const showManyResultsTile = page === PAGE_NUMBER_OF_MANY_RESULTS_TILE;

	/**
	 * Effects
	 */

	useEffect(() => {
		dispatch(
			setBreadcrumbs([
				{
					label: `${tText('pages/slug/ie/index___breadcrumbs-home')}`,
					to: ROUTES_BY_LOCALE[locale].home,
				},
				{
					label: `${tText('pages/slug/ie/index___breadcrumbs-search')}`,
					to: ROUTES_BY_LOCALE[locale].search,
				},
			])
		);
	}, [dispatch, locale]);

	useEffect(() => {
		dispatch(setShowZendesk(!isKioskUser && !query[SearchFilterId.Maintainer]));
	}, [dispatch, isKioskUser, query]);

	useEffect(() => {
		// Ward: wait until items are rendered on the screen before scrolling
		if (
			lastScrollPosition &&
			lastScrollPosition.page === ROUTES_BY_LOCALE[locale].search &&
			searchResults?.items &&
			window.scrollY === 0
		) {
			setTimeout(() => {
				const item = document.getElementById(`${lastScrollPosition.itemId}`) as HTMLElement | null;

				item?.scrollIntoView({ block: 'center', behavior: 'smooth' });
				dispatch(setLastScrollPosition(null));
			}, 100);
		}
	}, [dispatch, lastScrollPosition, locale, searchResults?.items]);

	useEffect(() => {
		setIsInitialPageLoad(true);
	}, []);

	// Convert a url shared before ARC-3806, which still holds the old combined "advanced" parameter
	// biome-ignore lint/correctness/useExhaustiveDependencies: only react to the legacy parameter
	useEffect(() => {
		const changes = migrateLegacyAdvancedFilters(query[SearchFilterId.Advanced]);
		if (!isEmpty(changes)) {
			setQuery(changes);
		}
	}, [query[SearchFilterId.Advanced]]);

	useEffect(() => {
		dispatch(setLastSearchParams(searchParams.toString()));
	}, [searchParams, dispatch]);

	useEffect(() => {
		if (!multiselect.isActive) {
			setFailedMultiselectFolderIds(null);
		}
	}, [multiselect.isActive]);

	/**
	 * Display
	 */

	const limitToMaxResults = (count: number): number => {
		return Math.min(count, MAX_COUNT_SEARCH_RESULTS);
	};

	const getItemCounts = useCallback(
		(type: SearchPageMediaType): number => {
			if (type === SearchPageMediaType.All) {
				return sum(Object.values(formatCounts || {})) || 0;
			}
			return formatCounts?.[type] || 0;
		},
		[formatCounts]
	);

	const tabs: TabProps[] = useMemo(
		() =>
			SEARCH_PAGE_IE_OBJECT_TABS().map((tab) => ({
				...tab,
				label: (
					<TabLabel
						label={tab.label}
						count={numberWithCommas(getItemCounts(tab.id as SearchPageMediaType))}
					/>
				),
				active: tab.id === format,
			})),
		[format, getItemCounts]
	);

	const toggleOptions: ToggleOption[] = useMemo(
		() =>
			GET_VISITOR_SPACE_VIEW_TOGGLE_OPTIONS().map((option) => ({
				...option,
				active: option.id === viewMode,
			})),
		[viewMode]
	);

	const visitorSpaceDropdownOptions = useMemo(() => {
		const dynamicOptions: VisitorSpaceDropdownOption[] = accessibleVisitorSpaceRequests.map(
			({ spaceName, endAt, spaceSlug }: VisitRequest): VisitorSpaceDropdownOption => {
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
			? [
					{
						slug: user?.visitorSpaceSlug || '',
						label: user?.organisationName || '',
					},
				]
			: [getDefaultOption(), ...dynamicOptions];
	}, [
		accessibleVisitorSpaceRequests,
		isKioskUser,
		user?.visitorSpaceSlug,
		user?.organisationName,
		isMobile,
	]);

	const availableFilters = useMemo(
		() => getAvailableSearchPageFilters(isGlobalArchive, isKioskUser, isKeyUser, format),
		[isGlobalArchive, isKioskUser, isKeyUser, format]
	);

	// The value of a filter that is not offered on this tab stays in the url and in the search
	// request, so its pill stays as well
	const pillFilters = useMemo(
		() => getUsableSearchPageFilters(isGlobalArchive, isKioskUser, isKeyUser, format),
		[isGlobalArchive, isKioskUser, isKeyUser, format]
	);

	const flyoutFilters = useMemo(
		() => getAdvancedFlyoutFilters(availableFilters, locale),
		[availableFilters, locale]
	);

	const filters = useMemo(
		(): FilterMenuFilterOption[] => getVisiblePanelFilters(availableFilters, query, pillFilters),
		[availableFilters, query, pillFilters]
	);

	/** Clicking a pill opens the modal of that filter, with the selected values filled in. */
	const onPillClick = (tag: ClickableTag) => {
		setFilterMenuOpen(true);
		setMobileFilterMenuOpen(true);
		setQuery({ filter: tag.key });
	};

	/** Picking a filter from the fly-out puts it in the panel and opens its modal. */
	const onFlyoutFilterClick = (filterId: SearchFilterId) => {
		setQuery({ filter: filterId });
	};

	/**
	 * Methods
	 */

	const prepareSearchValue = (
		value = ''
	): { [QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: (string | null)[] } | undefined => {
		const trimmed = value.trim();

		if (trimmed && !query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]?.includes(trimmed)) {
			return {
				[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: (query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] ?? []).concat(
					trimmed
				),
			};
		}

		return undefined;
	};

	const onSearch = async (newValue: string) => {
		const value = prepareSearchValue(newValue);

		value &&
			setQuery({
				...value,
				page: undefined,
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
			[SearchFilterId.Maintainer]: query[SearchFilterId.Maintainer],
		});
	};

	/**
	 * Reset one filter by id
	 * @param id
	 */
	const onResetFilter = (id: SearchFilterId) => {
		const newQueryParams = { ...query };
		newQueryParams[id] = undefined;
		setQuery(newQueryParams);
	};

	/**
	 * Set one filter with its values.
	 * The generic forms of ARC-3806 all hand back { [filter id]: values }, so only the filters
	 * with a form of their own need a case here.
	 */
	const onSubmitFilter = (id: SearchFilterId, values: unknown) => {
		const searchValue = prepareSearchValue(searchBarInputValue);
		let data: string[] | string | boolean | AdvancedFilter[] | TextFilterCondition[] | undefined;

		switch (id) {
			case SearchFilterId.ConsultableOnlyOnLocation: {
				// Info: remove query param if false (= set to undefined)
				const filterValue = (values as ConsultableOnlyOnLocationFilterFormState)[
					IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION
				];
				data = filterValue || undefined;
				break;
			}

			case SearchFilterId.ConsultableMedia: {
				// Info: remove query param if false (= set to undefined)
				const filterValue = (values as ConsultableMediaFilterFormState)[
					IeObjectsSearchFilterField.CONSULTABLE_MEDIA
				];
				data = filterValue || undefined;
				break;
			}

			default: {
				const submitted = (values as Record<string, unknown>)?.[id];
				data = isEmpty(submitted)
					? undefined
					: (submitted as string[] | AdvancedFilter[] | TextFilterCondition[]);
				break;
			}
		}

		const currentPage = isInitialPageLoad ? page : undefined;

		setQuery({
			[id]: data,
			filter: undefined,
			page: currentPage,
			...(searchValue ? searchValue : {}),
		});
		setSearchBarInputValue('');
		isInitialPageLoad && setIsInitialPageLoad(false);
	};

	const onRemoveTag = (tags: MultiValue<TagIdentity>) => {
		// The tag list hands back the tags that survive, so the query is rebuilt from those
		const updatedQuery = getQueryForRemainingTags(tags, query, pillFilters);

		// Destructure to keyword-able filters
		// biome-ignore-start lint/correctness/noUnusedVariables: filter it out of the query
		const {
			format,
			orderProp,
			orderDirection,
			page,
			// Dynamically destructure the maintainer qp using our enum so we don't need to change it every time the qp value changes
			[SearchFilterId.Maintainer]: maintainer,
			...rest
		} = {
			...VISITOR_SPACE_QUERY_PARAM_INIT,
		};
		// biome-ignore-end lint/correctness/noUnusedVariables: filter it out of the query

		setQuery({ ...rest, ...updatedQuery, page: undefined });
	};

	const onSortClick = (orderProp: string, orderDirection?: AvoSearchOrderDirection) => {
		setQuery({ orderProp, orderDirection, page: undefined });
	};

	const onTabClick = (tabId: string | number) => {
		setQuery({ format: String(tabId), page: undefined });
	};

	const onViewToggle = (nextMode: string) => setViewMode(nextMode as MediaCardViewMode);

	const onVisitorSpaceSelected = (id: string): void => {
		setQuery({
			...query,
			page: undefined,
			[SearchFilterId.Maintainer]: id === GLOBAL_ARCHIVE ? undefined : id,
		});
	};

	/**
	 * Computed
	 */

	// Read individually so the result items below only rebuild when these change, not on any query change
	const mentionsFilter = query[SearchFilterId.Mentions];
	const mentionPersonFilter = query[SearchFilterId.MentionPerson];
	const mentionPlaceFilter = query[SearchFilterId.MentionPlace];
	const mentionOrganisationFilter = query[SearchFilterId.MentionOrganisation];
	const isLoadedWithoutResults = !!searchResults && searchResults?.items?.length === 0;
	const isLoadedWithResults = !!searchResults && searchResults?.items?.length > 0;
	const searchResultsNoAccess = (searchResultsError as HTTPError)?.response?.status === 403;
	const showVisitorSpacesDropdown = isUserWithAccount && accessibleVisitorSpaceRequests.length > 0;
	const activeFilters = useMemo(
		() => mapFiltersToTags(query, pillFilters, { themeLabelsBySlug, locale }),
		[query, pillFilters, themeLabelsBySlug, locale]
	);

	const searchResultCardData = useMemo((): IdentifiableMediaCard[] => {
		return (searchResults?.items || []).map((item): IdentifiableMediaCard => {
			const type: HetArchiefIeObjectType | null = item.dctermsFormat;
			const showKeyUserLabel = item.accessThrough?.includes(HetArchiefIeObjectAccessThrough.SECTOR);
			const hasAccessToVisitorSpaceOfObject = !!intersection(item?.accessThrough, [
				HetArchiefIeObjectAccessThrough.VISITOR_SPACE_FOLDERS,
				HetArchiefIeObjectAccessThrough.VISITOR_SPACE_FULL,
			]).length;

			// Only show pill when the public collection is selected (https://meemoo.atlassian.net/browse/ARC-1210?focusedCommentId=39708)
			const hasTempAccess = !isKioskUser && isGlobalArchive && hasAccessToVisitorSpaceOfObject;

			// Search terms can either be:
			// - simple text search or
			// - they can contain logic operators like: (philip AND mathilde) OR (albert)
			const plainTextSearchTerms = searchResults?.searchTerms
				? JSON.stringify(searchResults?.searchTerms)
				: '';

			const link: string | undefined = queryString.stringifyUrl({
				url: getIeObjectDetailPath(locale, item.maintainerSlug, item.schemaIdentifier, item.name),
				query: {
					[QUERY_PARAM_KEY.HIGHLIGHTED_SEARCH_TERMS]: plainTextSearchTerms,
					// Carried over to the object detail page, which uses them to pick the default tab
					...omitEmptyFilters({
						[SearchFilterId.Mentions]: mentionsFilter,
						[SearchFilterId.MentionPerson]: mentionPersonFilter,
						[SearchFilterId.MentionPlace]: mentionPlaceFilter,
						[SearchFilterId.MentionOrganisation]: mentionOrganisationFilter,
					}),
				},
			});

			// Newspapers should use transcript text instead of the description
			const description = isNewspaperType(type)
				? item.transcript || item.description
				: item.description;

			return {
				schemaIdentifier: item.schemaIdentifier,
				maintainerSlug: item.maintainerSlug,
				duration: item.duration,
				description,
				title: item.name,
				publishedOrCreatedDate: item.datePublished ?? item.dateCreated ?? null,
				publishedBy: item.maintainerName || '',
				type,
				thumbnail: item.thumbnailUrl || undefined,
				hasAccessToEssence: !!item.hasAccessToEssence,
				name: item.name,
				hasRelated: (item.related_count || 0) > 0,
				hasTempAccess,
				showKeyUserLabel,
				icon: getIconFromObjectType(type, !!item.hasAccessToEssence),
				link,
				previousPage: ROUTES_BY_LOCALE[locale].search,
				numOfChildren: item.children || 0,
				isPartOfOtherItem: !!item.premisIsPartOf,
			};
		});
	}, [
		isKioskUser,
		locale,
		isGlobalArchive,
		searchResults,
		mentionsFilter,
		mentionPersonFilter,
		mentionPlaceFilter,
		mentionOrganisationFilter,
	]);

	// Selecting multiple objects only makes sense when there is more than one result
	// Kiosk users and anonymous users cannot manage folders, so they never get the multiselect
	const isMultiselectAvailable = !!canManageFolders && searchResultCardData.length >= 2;

	const selectedMultiselectCards = useMemo(
		() =>
			compact(
				multiselect.selectedIds.map((schemaIdentifier) =>
					searchResultCardData.find((card) => card.schemaIdentifier === schemaIdentifier)
				)
			),
		[multiselect.selectedIds, searchResultCardData]
	);

	const objectsToAddToFolder = useMemo(() => {
		if (multiselect.isActive) {
			return selectedMultiselectCards.map((card) => ({
				schemaIdentifier: card.schemaIdentifier,
				title: card.name,
			}));
		}
		if (selectedCard) {
			return [{ schemaIdentifier: selectedCard.schemaIdentifier, title: selectedCard.name }];
		}
		return [];
	}, [multiselect.isActive, selectedMultiselectCards, selectedCard]);

	const focusMultiselectStartCard = () => {
		const startId = multiselectStartId;
		if (!startId) {
			return;
		}
		// Wait for the bookmark button to be rendered again
		setTimeout(() => {
			document
				.querySelector<HTMLElement>(
					`[data-selectable-id="${CSS.escape(startId)}"] [data-bookmark-slot] button`
				)
				?.focus();
		}, 0);
	};

	const startMultiselect = (card: IdentifiableMediaCard) => {
		setMultiselectStartId(card.schemaIdentifier);
		multiselect.open([card.schemaIdentifier]);
	};

	const closeMultiselect = () => {
		multiselect.close();
		focusMultiselectStartCard();
	};

	const onCloseAddToFolderBlade = () => {
		setShowAddToFolderBlade(false);
		setSelectedCard(null);
		if (multiselect.isActive) {
			multiselectSaveButtonRef.current?.focus();
		}
	};

	const saveMultiselectToFolders = async (folderIds: string[]) => {
		const objectSchemaIdentifiers = [...multiselect.selectedIds];
		if (!folderIds.length || !objectSchemaIdentifiers.length) {
			return;
		}
		setIsSavingMultiselect(true);
		setFailedMultiselectFolderIds(null);
		try {
			const response = await FoldersService.addManyToFolders(folderIds, objectSchemaIdentifiers);
			const savedCount = response.objectSchemaIdentifiers.length;
			const notFoundCount = response.notFoundSchemaIdentifiers?.length || 0;

			const folderNames = compact(
				folderIds.map((folderId) => folders?.find((folder) => folder.id === folderId)?.name)
			).join(', ');
			const getSavedDescription = () => {
				const variables = { count: savedCount, folders: folderNames };
				if (savedCount === 1) {
					return folderIds.length === 1
						? tHtml(
								'modules/search/search-page___1-object-is-toegevoegd-aan-de-map-folders',
								variables
							)
						: tHtml(
								'modules/search/search-page___1-object-is-toegevoegd-aan-de-mappen-folders',
								variables
							);
				}
				return folderIds.length === 1
					? tHtml(
							'modules/search/search-page___count-objecten-zijn-toegevoegd-aan-de-map-folders',
							variables
						)
					: tHtml(
							'modules/search/search-page___count-objecten-zijn-toegevoegd-aan-de-mappen-folders',
							variables
						);
			};
			toastService.notify({
				maxLines: 3,
				title: tHtml('modules/search/search-page___objecten-bewaard'),
				description: getSavedDescription(),
			});
			if (notFoundCount > 0) {
				// Objects that no longer exist in the database are skipped by the server
				toastService.notify({
					maxLines: 3,
					title: tHtml('modules/search/search-page___niet-alle-objecten-werden-bewaard'),
					description:
						notFoundCount === 1
							? tHtml(
									'modules/search/search-page___1-object-bestaat-niet-meer-of-is-niet-meer-beschikbaar-en-werd-overgeslagen'
								)
							: tHtml(
									'modules/search/search-page___count-objecten-bestaan-niet-meer-of-zijn-niet-meer-beschikbaar-en-werden-overgeslagen',
									{ count: notFoundCount }
								),
				});
			}

			closeMultiselect();
			// Fill the bookmark icons of the saved objects
			await refetchFolders();
		} catch (err) {
			console.error('Failed to add the selected objects to the folders', err, {
				folderIds,
				objectSchemaIdentifiers,
			});
			// Keep the selection, so the user can retry
			setFailedMultiselectFolderIds(folderIds);
		}
		setIsSavingMultiselect(false);
	};

	const openAndScrollToAdvancedFilters = () => {
		setFilterMenuOpen(true);
		setMobileFilterMenuOpen(true);
		setQuery({ filter: SearchFilterId.Advanced });

		// Wait for filter menu to open before scrolling to the advanced filters
		setTimeout(() => {
			document.getElementById(`c-filter-menu__option__${SearchFilterId.Advanced}`)?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center',
			});
		}, 0);
	};

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
				<Link
					passHref
					href={`/${ROUTE_PARTS_BY_LOCALE[locale].kioskConditions}`}
					aria-label={tText(
						'modules/search/search-page___meer-info-over-enkel-voor-onderzoek-doeleinden-link-aria-label'
					)}
				>
					<Button
						className="u-p-0 u-color-neutral u-font-size-14 u-height-auto"
						label={tHtml('pages/slug/index___meer-info')}
						variants={['text', 'underline']}
						tabIndex={-1}
					/>
				</Link>
			}
		/>
	);

	const renderBreadcrumbs = (): ReactNode => {
		const staticBreadcrumbs: Breadcrumb[] = [
			{
				label: tText('pages/bezoekersruimte/visitor-space-slug/index___breadcrumbs-home'),
				to: ROUTES_BY_LOCALE[locale].home,
			},
			{
				label: tText('pages/bezoekersruimte/visitor-space-slug/index___breadcrumbs-search'),
				to: ROUTES_BY_LOCALE[locale].search,
			},
		];

		const dynamicBreadcrumbs: Breadcrumb[] =
			!isNil(activeVisitRequest) && activeVisitRequest.spaceMaintainerId !== GLOBAL_ARCHIVE
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
				icon={<Icon name={IconNamesLight.AngleRight} aria-hidden />}
				linkComponent={NextLinkWrapper}
			/>
		);
	};

	const renderFilterMenu = () => {
		const filterMenuCls = clsx('p-visitor-space__filter-menu', {
			'u-mr-32-md': viewMode === 'list' && isLoadedWithResults,
		});

		return (
			<div className={filterMenuCls}>
				<FilterMenu
					activeSort={activeSort}
					filters={filters}
					filterValues={query}
					flyoutFilters={flyoutFilters}
					onFlyoutFilterClick={onFlyoutFilterClick}
					label={tText('pages/bezoekersruimte/visitor-space-slug/index___filters')}
					isOpen={filterMenuOpen}
					isMobileOpen={mobileFilterMenuOpen}
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

		const card = item as IdentifiableMediaCard;
		const itemIsInAFolder = isInAFolder(folders, card.schemaIdentifier);

		return (
			<span data-bookmark-slot>
				<ResultCardBookmarkSlot
					title={card.name || card.schemaIdentifier}
					isInFolder={itemIsInAFolder}
					isMultiselectActive={multiselect.isActive}
					isSelected={multiselect.isSelected(card.schemaIdentifier)}
					autoFocus={multiselectStartId === card.schemaIdentifier}
					onBookmarkClick={() => {
						if (isMultiselectAvailable) {
							startMultiselect(card);
							return;
						}
						setSelectedCard(card);
						setShowAddToFolderBlade(true);
					}}
					onToggleSelected={() => multiselect.toggle(card.schemaIdentifier)}
				/>
			</span>
		);
	};

	const renderSelectableCard = (cardNode: ReactNode, item: MediaCardProps): ReactNode => {
		const card = item as IdentifiableMediaCard;
		return (
			<div
				key={`selectable-media-card--${card.schemaIdentifier}`}
				data-selectable-id={card.schemaIdentifier}
			>
				<SelectableMediaCard
					isMultiselectActive={multiselect.isActive}
					isSelected={multiselect.isSelected(card.schemaIdentifier)}
					isInFolder={isInAFolder(folders, card.schemaIdentifier)}
					view={viewMode === 'grid' ? 'grid' : 'list'}
					onToggleSelected={() => multiselect.toggle(card.schemaIdentifier)}
				>
					{cardNode}
				</SelectableMediaCard>
			</div>
		);
	};

	const renderMultiselect = () => {
		if (!multiselect.isActive) {
			return null;
		}
		return (
			<>
				<MultiselectActionBar
					selectedCount={multiselect.selectedIds.length}
					pageCount={searchResultCardData.length}
					isSaving={isSavingMultiselect}
					saveButtonRef={multiselectSaveButtonRef}
					onSelectAllOnPage={() =>
						multiselect.selectMany(searchResultCardData.map((card) => card.schemaIdentifier))
					}
					onDeselectAll={multiselect.deselectAll}
					onSave={() => {
						setSelectedCard(null);
						setShowAddToFolderBlade(true);
					}}
					onClose={closeMultiselect}
				/>
				{failedMultiselectFolderIds && (
					<MultiselectErrorBanner
						objectCount={multiselect.selectedIds.length}
						isRetrying={isSavingMultiselect}
						onRetry={() => saveMultiselectToFolders(failedMultiselectFolderIds)}
					/>
				)}
			</>
		);
	};

	const renderTempAccessLabel = () => {
		if (isMeemooAdmin || !isGlobalArchive || isKioskUser || !isLoggedIn) {
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
				const isPublicCollection = visitorSpace.slug === GLOBAL_ARCHIVE;
				const isOwnVisitorSpace = isCPAdmin && visitorSpace.slug === user?.organisationId;

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
					href={getSearchLink(locale, { [SearchFilterId.Maintainer]: visitorSpace?.slug ?? '' })}
					aria-label={visitorSpace?.label}
				>
					{visitorSpace?.label}
				</Link>
			)
		);

		return (
			<div className="p-visitor-space__temp-access-container">
				<Icon name={IconNamesLight.Clock} aria-hidden />
				<span className="p-visitor-space__temp-access-label">
					{tText(
						'modules/visitor-space/components/visitor-space-search-page/visitor-space-search-page___tijdelijke-toegang'
					)}{' '}
					{visitorSpaceLinks.length === 1 && visitorSpaceLinks[0]}
					{visitorSpaceLinks.length > 1 &&
						visitorSpaceLinks.map((visitorSpaceLink: ReactNode, i: number): ReactNode => {
							const isLast = i === visitorSpaceLinks.length - 1;
							const isSecondLast = i === visitorSpaceLinks.length - 2;

							return (
								<span key={`visitor-space-link--${visitorSpaceLink}`}>
									{visitorSpaceLink}
									{!isLast && !isSecondLast && ', '}
									{isSecondLast && ' en '}
								</span>
							);
						})}
					{'.'}
				</span>
			</div>
		);
	};

	const renderResults = () => {
		return (
			<>
				{renderMultiselect()}
				<MediaCardList
					items={searchResultCardData}
					keywords={searchResults?.searchTerms}
					sidebar={renderFilterMenu()}
					view={viewMode === 'grid' ? 'grid' : 'list'}
					renderButtons={renderCardButtons}
					renderWrapper={canManageFolders ? renderSelectableCard : undefined}
					className="p-media-card-list"
					showManyResultsTile={showManyResultsTile}
				/>
				<PaginationBar
					{...getDefaultPaginationBarProps()}
					className="u-mb-48"
					startItem={(page - 1) * SEARCH_RESULTS_PAGE_SIZE}
					itemsPerPage={SEARCH_RESULTS_PAGE_SIZE}
					totalItems={limitToMaxResults(getItemCounts(format))}
					showBackToTop
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
	};

	const renderSearchInputRightControls = () => {
		return (
			<>
				<TagSearchBarInfo />
				<Button
					className={clsx('u-hide-lt-bp2', styles['c-button--advanced-filters'])}
					variants={['text', 'white']}
					label={tText('modules/search/search-page___geavanceerde-filters')}
					onClick={openAndScrollToAdvancedFilters}
				/>
			</>
		);
	};

	const renderSearchPage = () => {
		return (
			<>
				{accessibleVisitorSpaceRequests && (
					<div className={clsx('p-visitor-space', styles['p-visitor-space'])}>
						<section className="u-bg-black u-pt-8">
							<div className="l-container">
								<FormControl
									className="c-form-control--label-hidden u-mb-24"
									id={`react-select-${labelKeys.search}-input`}
									label={tText('pages/bezoekersruimte/slug___zoek-op-trefwoord-jaartal-aanbieder')}
								>
									<div
										className={clsx('p-visitor-space__searchbar', {
											'p-visitor-space__searchbar--has-dropdown': showVisitorSpacesDropdown,
										})}
									>
										{showVisitorSpacesDropdown && (
											<VisitorSpaceDropdown
												options={visitorSpaceDropdownOptions}
												selectedOptionId={
													isKioskUser
														? (user?.visitorSpaceSlug ?? '')
														: activeVisitorSpaceSlug || GLOBAL_ARCHIVE
												}
												onSelected={onVisitorSpaceSelected}
											/>
										)}
										<TagSearchBar
											allowCreate
											hasDropdown={showVisitorSpacesDropdown}
											clearLabel={tHtml('pages/bezoekersruimte/slug___wis-volledige-zoekopdracht')}
											inputValue={searchBarInputValue}
											setInputValue={setSearchBarInputValue}
											instanceId={labelKeys.search}
											isMulti
											onClear={onResetFilters}
											onRemoveValue={onRemoveTag}
											onSearch={onSearch}
											onTagClick={onPillClick}
											placeholder={tText(
												'pages/bezoekersruimte/slug___zoek-op-trefwoord-jaartal-aanbieder'
											)}
											renderedRight={renderSearchInputRightControls()}
											size="lg"
											value={activeFilters}
											isLoading={searchResultsLoading || searchResultsRefetching}
										/>
									</div>
								</FormControl>
								<ScrollableTabs variants={['dark']} tabs={tabs} onClick={onTabClick} />
							</div>
						</section>

						<aside className="u-bg-platinum">
							<div
								className={clsx('l-container', {
									'u-py-32': showResearchWarning,
								})}
							>
								{showResearchWarning ? renderResearchWarning() : renderBreadcrumbs()}

								{renderTempAccessLabel()}
							</div>
						</aside>

						<section
							className={clsx('p-visitor-space__results u-page-bottom-margin u-bg-platinum', {
								'p-visitor-space__results--placeholder': isLoadedWithoutResults,
								'u-pt-0': showResearchWarning,
							})}
						>
							<div className="l-container">
								{/* Only render filters when there are no results yet, when the results are loaded we render the filter menu using MediaCardList */}
								{!isLoadedWithResults && renderFilterMenu()}
								{isLoadedWithoutResults && (
									<Placeholder
										className="p-visitor-space__placeholder"
										img="/images/looking-glass.svg"
										imgAlt={tText(
											'modules/search/search-page___vergroot-glas-geen-reusltaten-icoon-alt-tekst'
										)}
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
						objectsToAdd={objectsToAddToFolder}
						onRemoveObject={multiselect.isActive ? multiselect.deselect : undefined}
						onAddMultipleObjects={saveMultiselectToFolders}
						onClose={onCloseAddToFolderBlade}
						onSubmit={async () => {
							// Only called when one object was added, multiple objects are saved by saveMultiselectToFolders
							setShowAddToFolderBlade(false);
							setSelectedCard(null);
							if (multiselect.isActive) {
								closeMultiselect();
							}
						}}
						id="search-page__add-to-folder-blade"
						ariaLabel={tText(
							'modules/search/search-page___voeg-object-toe-aan-map-blade-aria-label'
						)}
					/>
				)}
			</>
		);
	};

	const renderPageContent = () => {
		if (searchResultsLoading) {
			return <Loading fullscreen locationId="visitor space search page: render page content" />;
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

		return renderSearchPage();
	};

	return (
		<>
			<SeoTags
				title={tText('pages/zoeken/index___zoeken-pagina-titel')}
				description={tText('pages/zoeken/index___zoek-pagina-seo-omschrijving')}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={canonicalUrl}
			/>
			{renderPageContent()}
		</>
	);
};

export default SearchPage;
