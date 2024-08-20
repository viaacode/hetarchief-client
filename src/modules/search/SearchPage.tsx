import {
	type Breadcrumb,
	Breadcrumbs,
	Button,
	FormControl,
	OrderDirection,
	type TabProps,
} from '@meemoo/react-components';
import clsx from 'clsx';
import { addYears, isAfter } from 'date-fns';
import { type HTTPError } from 'ky';
import { intersection, isEmpty, isNil, kebabCase, sortBy, sum } from 'lodash-es';
import Head from 'next/head';
import Link from 'next/link';
import { stringifyUrl } from 'query-string';
import React, { type FC, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type MultiValue } from 'react-select';
import { useQueryParams } from 'use-query-params';

import { GroupName, Permission } from '@account/const';
import { useGetFolders } from '@account/hooks/get-folders';
import { selectIsLoggedIn, selectUser } from '@auth/store/user/user.select';
import { useGetIeObjectFormatCounts } from '@ie-objects/hooks/get-ie-object-format-counts';
import { useGetIeObjects } from '@ie-objects/hooks/get-ie-objects';
import { IeObjectAccessThrough } from '@ie-objects/ie-objects.types';
import { isInAFolder } from '@ie-objects/utils/folders';
import { Callout } from '@shared/components/Callout';
import { ErrorNoAccess } from '@shared/components/ErrorNoAccess';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight, IconNamesSolid } from '@shared/components/Icon/Icon.enums';
import { Loading } from '@shared/components/Loading';
import {
	type IdentifiableMediaCard,
	type MediaCardProps,
	type MediaCardViewMode,
	TYPE_TO_ICON_MAP,
	TYPE_TO_NO_ICON_MAP,
} from '@shared/components/MediaCard';
import { MediaCardList } from '@shared/components/MediaCardList';
import {
	MAX_COUNT_SEARCH_RESULTS,
	PAGE_NUMBER_OF_MANY_RESULTS_TILE,
} from '@shared/components/MediaCardList/MediaCardList.const';
import NextLinkWrapper from '@shared/components/NextLinkWrapper/NextLinkWrapper';
import { PaginationBar } from '@shared/components/PaginationBar';
import { Placeholder } from '@shared/components/Placeholder';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { ScrollableTabs, TabLabel } from '@shared/components/Tabs';
import TagSearchBar from '@shared/components/TagSearchBar/TagSearchBar';
import { type ToggleOption } from '@shared/components/Toggle';
import {
	VisitorSpaceDropdown,
	type VisitorSpaceDropdownOption,
} from '@shared/components/VisitorSpaceDropdown';
import { ROUTE_PARTS_BY_LOCALE, ROUTES_BY_LOCALE } from '@shared/const';
import {
	HIGHLIGHTED_SEARCH_TERMS_SEPARATOR,
	QUERY_PARAM_KEY,
} from '@shared/const/query-param-keys';
import { numberWithCommas } from '@shared/helpers';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useIsKeyUser } from '@shared/hooks/is-key-user';
import { useLocalStorage } from '@shared/hooks/use-localStorage/use-local-storage';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { selectFolders } from '@shared/store/ie-objects';
import {
	selectLastScrollPosition,
	setBreadcrumbs,
	setLastScrollPosition,
	setShowZendesk,
} from '@shared/store/ui';
import { Breakpoints, type SortObject } from '@shared/types';
import {
	IeObjectsSearchFilterField,
	IeObjectType,
	SearchPageMediaType,
} from '@shared/types/ie-objects';
import { type DefaultSeoInfo } from '@shared/types/seo';
import { type VisitRequest, VisitStatus } from '@shared/types/visit-request';
import { asDate, formatMediumDateWithTime, formatSameDayTimeOrDate } from '@shared/utils/dates';
import { scrollTo } from '@shared/utils/scroll-to-top';
import { useGetActiveVisitRequestForUserAndSpace } from '@visit-requests/hooks/get-active-visit-request-for-user-and-space';
import { useGetVisitRequests } from '@visit-requests/hooks/get-visit-requests';
import { VisitTimeframe } from '@visit-requests/types';
import { AddToFolderBlade } from '@visitor-space/components/AddToFolderBlade';
import { initialFields } from '@visitor-space/components/AdvancedFilterForm/AdvancedFilterForm.const';
import { type AdvancedFilterFormState } from '@visitor-space/components/AdvancedFilterForm/AdvancedFilterForm.types';
import { type ConsultableMediaFilterFormState } from '@visitor-space/components/ConsultableMediaFilterForm/ConsultableMediaFilterForm.types';
import { type ConsultableOnlyOnLocationFilterFormState } from '@visitor-space/components/ConsultableOnlyOnLocationFilterForm/ConsultableOnlyOnLocationFilterForm.types';
import { type ConsultablePublicDomainFilterFormState } from '@visitor-space/components/ConsultablePublicDomainFilterForm/ConsultablePublicDomainFilterForm.types';
import { type CreatorFilterFormState } from '@visitor-space/components/CreatorFilterForm';
import { type DurationFilterFormState } from '@visitor-space/components/DurationFilterForm';
import FilterMenu from '@visitor-space/components/FilterMenu/FilterMenu';
import { type FilterMenuFilterOption } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import { type GenreFilterFormState } from '@visitor-space/components/GenreFilterForm';
import { type KeywordsFilterFormState } from '@visitor-space/components/KeywordsFilterForm/KeywordsFilterForm.types';
import { type LanguageFilterFormState } from '@visitor-space/components/LanguageFilterForm/LanguageFilterForm.types';
import { type MaintainerFilterFormState } from '@visitor-space/components/MaintainerFilterForm/MaintainerFilterForm.types';
import { type MediumFilterFormState } from '@visitor-space/components/MediumFilterForm';
import { type ReleaseDateFilterFormState } from '@visitor-space/components/ReleaseDateFilterForm';
import {
	PUBLIC_COLLECTION,
	SEARCH_PAGE_QUERY_PARAM_CONFIG,
	SEARCH_RESULTS_PAGE_SIZE,
	VISITOR_SPACE_QUERY_PARAM_INIT,
	VISITOR_SPACE_SORT_OPTIONS,
	VISITOR_SPACE_VIEW_TOGGLE_OPTIONS,
} from '@visitor-space/const';
import { SEARCH_PAGE_FILTERS } from '@visitor-space/const/visitor-space-filters.const';
import { SEARCH_PAGE_IE_OBJECT_TABS } from '@visitor-space/const/visitor-space-tabs.const';
import { MetadataProp, SearchFilterId, type TagIdentity } from '@visitor-space/types';
import { mapFiltersToElastic, mapMaintainerToElastic } from '@visitor-space/utils/elastic-filters';
import { mapFiltersToTags, tagPrefix } from '@visitor-space/utils/map-filters';

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

const SearchPage: FC<DefaultSeoInfo> = ({ url }) => {
	const windowSize = useWindowSizeContext();
	const dispatch = useDispatch();
	const locale = useLocale();

	// Get folders, to correctly show the bookmark icon statuses on the search results
	useGetFolders();
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
	const folders = useSelector(selectFolders);
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

	// Keep defaults only in code, not in the query params in the url
	const page = query.page || VISITOR_SPACE_QUERY_PARAM_INIT.page;
	const format = (query.format || VISITOR_SPACE_QUERY_PARAM_INIT.format) as SearchPageMediaType;
	const orderProp = query.orderProp || VISITOR_SPACE_QUERY_PARAM_INIT.orderProp;
	const orderDirection = (query.orderDirection ||
		VISITOR_SPACE_QUERY_PARAM_INIT.orderDirection) as OrderDirection;

	const isUserWithAccount = isLoggedIn && !!user && !isKioskUser && !isAnonymousUser;
	const { data: visitRequestsPaginated } = useGetVisitRequests(
		{
			page: 1,
			size: 10,
			orderProp: 'startAt',
			orderDirection: OrderDirection.desc,
			status: VisitStatus.APPROVED,
			timeframe: VisitTimeframe.ACTIVE,
			personal: true,
		},
		{ enabled: isUserWithAccount }
	);
	const accessibleVisitorSpaceRequests: VisitRequest[] = useMemo(
		() =>
			isUserWithAccount
				? sortBy(
						visitRequestsPaginated?.items || [],
						(visitRequest) => visitRequest.spaceName?.toLowerCase()
				  )
				: [],
		[isUserWithAccount, visitRequestsPaginated?.items]
	);

	const { data: activeVisitRequest, isLoading: isLoadingActiveVisitRequest } =
		useGetActiveVisitRequestForUserAndSpace(query[SearchFilterId.Maintainer], user);

	const [isInitialPageLoad, setIsInitialPageLoad] = useState(false);

	const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.md);
	const activeSort: SortObject = {
		orderProp,
		orderDirection,
	};

	const queryParamMaintainer = query?.[SearchFilterId.Maintainer];
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
		return PUBLIC_COLLECTION;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryParamMaintainer, accessibleVisitorSpaceRequests]);

	const isPublicCollection =
		activeVisitorSpaceSlug === undefined || activeVisitorSpaceSlug === PUBLIC_COLLECTION;

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
			filters: [
				...mapMaintainerToElastic(query, activeVisitRequest),
				...mapFiltersToElastic(query),
			],
			page,
			size: SEARCH_RESULTS_PAGE_SIZE,
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
		// Filter out all disabled query param keys/ids
		const disabledFilterKeys: SearchFilterId[] = SEARCH_PAGE_FILTERS(
			isPublicCollection,
			isKioskUser,
			isKeyUser,
			format
		)
			.filter(
				({ isDisabled, tabs }: FilterMenuFilterOption): boolean =>
					isDisabled?.() || !tabs.includes(format)
			)
			.map(({ id }: FilterMenuFilterOption): SearchFilterId => id as SearchFilterId);

		// Loop over all existing query params and strip out the disabled filters if they exist
		const disabledKeysSet: Set<SearchFilterId> = new Set(disabledFilterKeys);
		const strippedQuery = Object.keys(query).reduce((result, current) => {
			const id = current as SearchFilterId;
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
			lastScrollPosition.page === ROUTES_BY_LOCALE[locale].search &&
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
	}, [dispatch, lastScrollPosition, locale, searchResults?.items]);

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
		(type: SearchPageMediaType): number => {
			if (type === SearchPageMediaType.All) {
				return sum(Object.values(formatCounts || {})) || 0;
			} else {
				return formatCounts?.[type] || 0;
			}
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
			VISITOR_SPACE_VIEW_TOGGLE_OPTIONS.map((option) => ({
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
			? [{ slug: user?.visitorSpaceSlug || '', label: user?.organisationName || '' }]
			: [getDefaultOption(), ...dynamicOptions];
	}, [
		accessibleVisitorSpaceRequests,
		isKioskUser,
		user?.visitorSpaceSlug,
		user?.organisationName,
		isMobile,
	]);

	const filters = useMemo(
		() =>
			SEARCH_PAGE_FILTERS(isPublicCollection, isKioskUser, isKeyUser, format).filter(
				({ isDisabled, tabs }) => !isDisabled?.() && tabs.includes(format)
			),
		[isPublicCollection, isKioskUser, isKeyUser, format]
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
	 * Set one filter with its values
	 * @param id
	 * @param values
	 */
	const onSubmitFilter = (id: SearchFilterId, values: unknown) => {
		const searchValue = prepareSearchValue(searchBarInputValue);
		let data;

		switch (id) {
			case SearchFilterId.Medium:
				data = (values as MediumFilterFormState).mediums;
				break;

			case SearchFilterId.Duration:
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

			case SearchFilterId.ReleaseDate:
				data = values as ReleaseDateFilterFormState;
				data = data.releaseDate
					? [
							{
								prop: MetadataProp.ReleaseDate,
								op: data.operator,
								val: data.releaseDate,
							},
					  ]
					: undefined;
				break;

			case SearchFilterId.Creator:
				data = (values as CreatorFilterFormState).creator;
				break;

			case SearchFilterId.Genre:
				data = (values as GenreFilterFormState).genres;
				break;

			case SearchFilterId.Keywords:
				data = (values as KeywordsFilterFormState).values;
				break;

			case SearchFilterId.Language:
				data = (values as LanguageFilterFormState).languages;
				break;

			case SearchFilterId.Maintainers:
				data = (values as MaintainerFilterFormState).maintainers;
				break;

			case SearchFilterId.ConsultableOnlyOnLocation:
				// Info: remove query param if false (= set to undefined)
				data = (values as ConsultableOnlyOnLocationFilterFormState)[
					IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION
				]
					? (values as ConsultableOnlyOnLocationFilterFormState)[
							IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION
					  ]
					: undefined;
				break;

			case SearchFilterId.ConsultableMedia:
				// Info: remove query param if false (= set to undefined)
				data = (values as ConsultableMediaFilterFormState)[
					IeObjectsSearchFilterField.CONSULTABLE_MEDIA
				]
					? (values as ConsultableMediaFilterFormState)[
							IeObjectsSearchFilterField.CONSULTABLE_MEDIA
					  ]
					: undefined;
				break;

			case SearchFilterId.ConsultablePublicDomain:
				// Info: remove query param if false (= set to undefined)
				data = (values as ConsultablePublicDomainFilterFormState)[
					IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN
				]
					? (values as ConsultablePublicDomainFilterFormState)[
							IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN
					  ]
					: undefined;
				break;

			case SearchFilterId.Advanced:
				data = (values as AdvancedFilterFormState).advanced.filter((advanced) => {
					return !isNil(advanced.val) && advanced.val !== initialFields().val;
				});

				if (data.length === 0) {
					setQuery({ [id]: undefined, filter: undefined, page: undefined });
					return;
				}

				break;

			default:
				console.warn(`[WARN][VisitorSpacePage] No submit handler for ${id}`);
				break;
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
		const updatedQuery: Record<string, unknown> = {};

		tags.forEach((tag) => {
			switch (tag.key) {
				case SearchFilterId.Genre:
				case SearchFilterId.Keywords:
				case SearchFilterId.Language:
				case SearchFilterId.Medium:
				case SearchFilterId.Maintainers:
				case QUERY_PARAM_KEY.SEARCH_QUERY_KEY:
				case SearchFilterId.Creator:
					updatedQuery[tag.key] = [
						...((updatedQuery[tag.key] as Array<unknown>) || []),
						`${tag.value}`.replace(tagPrefix(tag.key), ''),
					];
					break;

				case SearchFilterId.Advanced:
				case SearchFilterId.ReleaseDate:
				case SearchFilterId.Duration:
					updatedQuery[tag.key] = [
						...((updatedQuery[tag.key] as Array<unknown>) || []),
						tag,
					];
					break;

				case SearchFilterId.ConsultableOnlyOnLocation:
				case SearchFilterId.ConsultableMedia:
				case SearchFilterId.ConsultablePublicDomain:
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
			[SearchFilterId.Maintainer]: maintainer,
			...rest
		} = {
			...VISITOR_SPACE_QUERY_PARAM_INIT,
		};
		/* eslint-disable @typescript-eslint/no-unused-vars */

		setQuery({ ...rest, ...updatedQuery, page: undefined });
	};

	const onSortClick = (orderProp: string, orderDirection?: OrderDirection) => {
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
			[SearchFilterId.Maintainer]: id === PUBLIC_COLLECTION ? undefined : id,
		});
	};

	/**
	 * Computed
	 */

	const isLoadedWithoutResults = !!searchResults && searchResults?.items?.length === 0;
	const isLoadedWithResults = !!searchResults && searchResults?.items?.length > 0;
	const searchResultsNoAccess = (searchResultsError as HTTPError)?.response?.status === 403;
	const showVisitorSpacesDropdown =
		isUserWithAccount && accessibleVisitorSpaceRequests.length > 0;
	const activeFilters = useMemo(() => mapFiltersToTags(query), [query]);

	const searchResultCardData = useMemo((): IdentifiableMediaCard[] => {
		return (searchResults?.items || []).map((item): IdentifiableMediaCard => {
			const type: IeObjectType | null = item.dctermsFormat;
			const showKeyUserLabel = item.accessThrough?.includes(IeObjectAccessThrough.SECTOR);
			const hasAccessToVisitorSpaceOfObject = !!intersection(item?.accessThrough, [
				IeObjectAccessThrough.VISITOR_SPACE_FOLDERS,
				IeObjectAccessThrough.VISITOR_SPACE_FULL,
			]).length;

			// Only show pill when the public collection is selected (https://meemoo.atlassian.net/browse/ARC-1210?focusedCommentId=39708)
			const hasTempAccess =
				!isKioskUser && isPublicCollection && hasAccessToVisitorSpaceOfObject;

			const link: string | undefined = stringifyUrl({
				url: `/${ROUTE_PARTS_BY_LOCALE[locale].search}/${item.maintainerSlug}/${
					item.schemaIdentifier
				}/${kebabCase(item.name) || 'titel'}`,
				query: {
					[QUERY_PARAM_KEY.HIGHLIGHTED_SEARCH_TERMS]: searchResults?.searchTerms.join(
						HIGHLIGHTED_SEARCH_TERMS_SEPARATOR
					),
				},
			});

			// Newspapers should use transcript text instead of the description
			const description =
				type === IeObjectType.Newspaper
					? item.transcript || item.description
					: item.description;

			return {
				schemaIdentifier: item.schemaIdentifier,
				maintainerSlug: item.maintainerSlug,
				duration: item.duration,
				description,
				title: item.name,
				publishedOrCreatedDate: asDate(item.datePublished ?? item.dateCreated ?? null),
				publishedBy: item.maintainerName || '',
				type,
				preview: item.thumbnailUrl || undefined,
				name: item.name,
				hasRelated: (item.related_count || 0) > 0,
				hasTempAccess,
				showKeyUserLabel,
				...(!isNil(type) && {
					icon: item.thumbnailUrl ? TYPE_TO_ICON_MAP[type] : TYPE_TO_NO_ICON_MAP[type],
				}),
				link,
				previousPage: ROUTES_BY_LOCALE[locale].search,
			};
		});
	}, [isKioskUser, isPublicCollection, locale, searchResults?.items, searchResults?.searchTerms]);

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
				<Link passHref href={`/${ROUTE_PARTS_BY_LOCALE[locale].kioskConditions}`}>
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
					'pages/bezoekersruimte/visitor-space-slug/index___breadcrumbs-home'
				)}`,
				to: ROUTES_BY_LOCALE[locale].home,
			},
			{
				label: `${tHtml(
					'pages/bezoekersruimte/visitor-space-slug/index___breadcrumbs-search'
				)}`,
				to: ROUTES_BY_LOCALE[locale].search,
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
			folders,
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
					href={`/${ROUTE_PARTS_BY_LOCALE[locale].search}?${SearchFilterId.Maintainer}=${visitorSpace?.slug}`}
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
				start={(page - 1) * SEARCH_RESULTS_PAGE_SIZE}
				count={SEARCH_RESULTS_PAGE_SIZE}
				showBackToTop
				total={limitToMaxResults(getItemCounts(format))}
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

	const renderSearchPage = () => {
		return (
			<>
				<Head>
					<link rel="canonical" href="https://hetarchief.be/zoeken" />
				</Head>
				{accessibleVisitorSpaceRequests && (
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
						objectToAdd={
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
						id="search-page__add-to-folder-blade"
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
			/>
			{renderPageContent()}
		</>
	);
};

export default SearchPage;
