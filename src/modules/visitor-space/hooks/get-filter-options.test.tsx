import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { renderHook } from '@testing-library/react';
import { FilterMenuType } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import {
	FILTER_LABEL_VALUE_DELIMITER,
	FilterModalType,
	SearchFilterId,
} from '@visitor-space/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGetFilterOptions } from './get-filter-options';

const useQueryParams = vi.fn();
const useQuery = vi.fn();
const useGetThemeFilterOptions = vi.fn();
const getSearchResults = vi.fn();

vi.mock('use-query-params', async (importOriginal) => ({
	...(await importOriginal<typeof import('use-query-params')>()),
	useQueryParams: (...args: unknown[]) => useQueryParams(...args),
}));
vi.mock('@tanstack/react-query', async (importOriginal) => ({
	...(await importOriginal<typeof import('@tanstack/react-query')>()),
	useQuery: (...args: unknown[]) => useQuery(...args),
}));
vi.mock('@shared/hooks/use-locale/use-locale', () => ({ useLocale: () => 'nl' }));
vi.mock('@visitor-space/hooks/get-search-query-filters', () => ({
	useSearchQueryFilters: () => [],
}));
vi.mock('@visitor-space/hooks/get-content-partner', () => ({
	useGetContentPartners: () => ({ data: undefined }),
}));
vi.mock('@visitor-space/hooks/use-get-theme-filter-options', () => ({
	useGetThemeFilterOptions: (...args: unknown[]) => useGetThemeFilterOptions(...args),
}));
vi.mock('@ie-objects/services', () => ({
	IeObjectsService: { getSearchResults: (...args: unknown[]) => getSearchResults(...args) },
}));

const filter = (id: SearchFilterId, field: IeObjectsSearchFilterField) => ({
	id,
	label: 'Filter',
	field,
	modalType: FilterModalType.Checkbox,
	type: FilterMenuType.Modal,
	inMainPanelByDefault: false,
	tabs: [],
});

const MEDIUM_FILTER = filter(SearchFilterId.Medium, IeObjectsSearchFilterField.MEDIUM);
const THEME_FILTER = filter(SearchFilterId.Theme, IeObjectsSearchFilterField.THEME);
const LANGUAGE_FILTER = filter(SearchFilterId.Language, IeObjectsSearchFilterField.LANGUAGE);
const REUSABILITY_FILTER = {
	...filter(SearchFilterId.Reusability, IeObjectsSearchFilterField.REUSABILITY),
	options: () => [
		{
			label: 'Vrij herbruikbaar',
			value: `freely-reusable${FILTER_LABEL_VALUE_DELIMITER}Vrij herbruikbaar`,
		},
		{
			label: 'Herbruikbaar onder voorwaarden',
			value: `reusable-with-conditions${FILTER_LABEL_VALUE_DELIMITER}Herbruikbaar onder voorwaarden`,
		},
		{
			label: 'Misschien herbruikbaar',
			value: `possibly-reusable${FILTER_LABEL_VALUE_DELIMITER}Misschien herbruikbaar`,
		},
	],
};

describe('useGetFilterOptions()', () => {
	beforeEach(() => {
		useGetThemeFilterOptions.mockReturnValue({ options: [], isLoading: false });
		useQuery.mockReturnValue({ data: { dcterms_medium: { buckets: [] } }, isLoading: false });
		useQueryParams.mockReturnValue([{}, vi.fn()]);
	});

	// The search of another tab has no hits, so the aggregation holds none of the picked values
	it('offers an applied value the aggregation no longer holds', () => {
		useQueryParams.mockReturnValue([{ [SearchFilterId.Medium]: ['DVD'] }, vi.fn()]);

		const { result } = renderHook(() => useGetFilterOptions(MEDIUM_FILTER, true));

		expect(result.current.options).toEqual([{ label: 'DVD', value: 'DVD' }]);
	});

	it('does not offer an applied value twice', () => {
		useQueryParams.mockReturnValue([{ [SearchFilterId.Medium]: ['DVD'] }, vi.fn()]);
		useQuery.mockReturnValue({
			data: { dcterms_medium: { buckets: [{ key: 'DVD' }, { key: 'VHS' }] } },
			isLoading: false,
		});

		const { result } = renderHook(() => useGetFilterOptions(MEDIUM_FILTER, true));

		expect(result.current.options.map((option) => option.value)).toEqual(['DVD', 'VHS']);
	});

	it('labels an applied theme with its name instead of its slug', () => {
		useQueryParams.mockReturnValue([{ [SearchFilterId.Theme]: ['education-learning'] }, vi.fn()]);
		useGetThemeFilterOptions.mockReturnValue({
			options: [{ label: 'Onderwijs en leren', value: 'education-learning' }],
			isLoading: false,
		});
		useQuery.mockReturnValue({ data: { theme: { buckets: [] } }, isLoading: false });

		const { result } = renderHook(() => useGetFilterOptions(THEME_FILTER, true));

		expect(result.current.options).toEqual([
			{ label: 'Onderwijs en leren', value: 'education-learning' },
		]);
	});

	it('labels an applied value that carries its own label with that label', () => {
		const value = `nl${FILTER_LABEL_VALUE_DELIMITER}Nederlands`;
		useQueryParams.mockReturnValue([{ [SearchFilterId.Language]: [value] }, vi.fn()]);
		useQuery.mockReturnValue({ data: { schema_in_language: { buckets: [] } }, isLoading: false });

		const { result } = renderHook(() => useGetFilterOptions(LANGUAGE_FILTER, true));

		expect(result.current.options).toEqual([{ label: 'Nederlands', value }]);
	});

	it('still offers an applied value before the aggregation has loaded', () => {
		useQueryParams.mockReturnValue([{ [SearchFilterId.Medium]: ['DVD'] }, vi.fn()]);
		useQuery.mockReturnValue({ data: undefined, isLoading: true });

		const { result } = renderHook(() => useGetFilterOptions(MEDIUM_FILTER, true));

		expect(result.current.options).toEqual([{ label: 'DVD', value: 'DVD' }]);
		expect(result.current.isLoading).toBe(true);
	});

	it('requests the reusability aggregation from the proxy', async () => {
		getSearchResults.mockResolvedValue({ aggregations: {} });

		renderHook(() => useGetFilterOptions(REUSABILITY_FILTER, true));
		await useQuery.mock.calls.at(-1)?.[0].queryFn();

		expect(getSearchResults).toHaveBeenCalledWith([], 1, 1, undefined, [
			IeObjectsSearchFilterField.REUSABILITY,
		]);
	});

	it('offers an applied reusability category that has no hits', () => {
		const appliedValue = `reusable-with-conditions${FILTER_LABEL_VALUE_DELIMITER}Herbruikbaar onder voorwaarden`;
		useQueryParams.mockReturnValue([{ [SearchFilterId.Reusability]: [appliedValue] }, vi.fn()]);
		useQuery.mockReturnValue({
			data: { reusability: { buckets: [{ key: 'freely-reusable' }] } },
			isLoading: false,
		});

		const { result } = renderHook(() => useGetFilterOptions(REUSABILITY_FILTER, true));

		expect(result.current.options).toEqual([
			{
				label: 'Vrij herbruikbaar',
				value: `freely-reusable${FILTER_LABEL_VALUE_DELIMITER}Vrij herbruikbaar`,
			},
			{ label: 'Herbruikbaar onder voorwaarden', value: appliedValue },
		]);
	});

	it('offers no reusability category when the filter has no options of its own', () => {
		useQuery.mockReturnValue({
			data: { reusability: { buckets: [{ key: 'freely-reusable' }] } },
			isLoading: false,
		});

		const { result } = renderHook(() =>
			useGetFilterOptions(
				filter(SearchFilterId.Reusability, IeObjectsSearchFilterField.REUSABILITY),
				true
			)
		);

		expect(result.current.options).toEqual([]);
	});

	it('only offers the reusability categories the proxy returned', () => {
		useQuery.mockReturnValue({
			data: {
				reusability: {
					buckets: [{ key: 'freely-reusable' }, { key: 'possibly-reusable' }],
				},
			},
			isLoading: false,
		});

		const { result } = renderHook(() => useGetFilterOptions(REUSABILITY_FILTER, true));

		expect(result.current.options.map((option) => option.label)).toEqual([
			'Vrij herbruikbaar',
			'Misschien herbruikbaar',
		]);
	});
});
