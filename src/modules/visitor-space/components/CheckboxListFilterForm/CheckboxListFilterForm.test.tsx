import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { FilterMenuType } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import { FilterModalType, SearchFilterId } from '@visitor-space/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckboxListFilterForm, MAX_OPTIONS_WITHOUT_SEARCH } from './CheckboxListFilterForm';

vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string) => key.split('___').pop()?.replaceAll('-', ' ') || '',
	tHtml: (key: string) => key.split('___').pop()?.replaceAll('-', ' ') || '',
}));

vi.mock('use-query-params', async (importOriginal) => ({
	...(await importOriginal<typeof import('use-query-params')>()),
	useQueryParams: () => [{}, vi.fn()],
}));

const useGetFilterOptions = vi.fn();

vi.mock('@visitor-space/hooks/get-filter-options', () => ({
	useGetFilterOptions: (...args: unknown[]) =>
		(useGetFilterOptions as unknown as (...a: unknown[]) => unknown)(...args),
}));

const LANGUAGE_FILTER = {
	id: SearchFilterId.Language,
	// No tText since this is a test file
	label: 'Taal',
	field: IeObjectsSearchFilterField.LANGUAGE,
	modalType: FilterModalType.Checkbox,
	type: FilterMenuType.Modal,
	inMainPanelByDefault: false,
	tabs: [],
};

/** Herbruikbaarheid brings its own list, so it never queries the aggregations. */
const REUSABILITY_FILTER = {
	id: SearchFilterId.Reusability,
	// No tText since this is a test file
	label: 'Herbruikbaarheid',
	field: IeObjectsSearchFilterField.REUSABILITY,
	options: () => [
		{ label: 'Publiek domein', value: 'public-domain' },
		{ label: 'Copyright onbepaald', value: 'copyright-undetermined' },
	],
	modalType: FilterModalType.Checkbox,
	type: FilterMenuType.Modal,
	inMainPanelByDefault: false,
	tabs: [],
};

const MAINTAINERS_FILTER = {
	id: SearchFilterId.Maintainers,
	// No tText since this is a test file
	label: 'Aanbieder',
	field: IeObjectsSearchFilterField.MAINTAINER_ID,
	modalType: FilterModalType.Checkbox,
	type: FilterMenuType.Modal,
	inMainPanelByDefault: true,
	tabs: [],
};

const renderForm = (filter = LANGUAGE_FILTER) => {
	// biome-ignore lint/suspicious/noExplicitAny: the children callback shape is checked by the form
	let latest: any;
	render(
		<CheckboxListFilterForm filter={filter}>
			{(params) => {
				latest = params;
				return null;
			}}
		</CheckboxListFilterForm>
	);
	return () => latest;
};

const searchField = () => screen.getByRole('textbox');
const selectedValues = (getParams: () => { values: Record<string, string[]> }, id: string) =>
	getParams().values[id];

const AGGREGATED_OPTIONS = [
	{ label: 'Nederlands', value: 'nl' },
	{ label: 'Frans', value: 'fr' },
];

/** Three named options the search tests use, padded out past the search threshold. */
const MAINTAINER_OPTIONS = [
	{ label: 'A Two Dogs Company', value: 'A Two Dogs Company' },
	{ label: 'Compagnie Cecilia', value: 'Compagnie Cecilia' },
	{ label: 'Amsab-ISG', value: 'Amsab-ISG' },
	...Array.from({ length: MAX_OPTIONS_WITHOUT_SEARCH - 2 }, (_, index) => ({
		label: `Filler ${index}`,
		value: `filler-${index}`,
	})),
];

describe('CheckboxListFilterForm', () => {
	beforeEach(() => {
		useGetFilterOptions.mockReset();
		useGetFilterOptions.mockReturnValue({ options: AGGREGATED_OPTIONS, isLoading: false });
	});

	it('lists the aggregated options alphabetically', () => {
		renderForm();

		const labels = screen.getAllByText(/Nederlands|Frans/).map((element) => element.textContent);

		expect(labels).toEqual(['Frans', 'Nederlands']);
	});

	it('takes its options from the registry when the filter carries its own list', () => {
		renderForm(REUSABILITY_FILTER);

		expect(screen.getByText('Copyright onbepaald')).toBeInTheDocument();
		expect(screen.getByText('Publiek domein')).toBeInTheDocument();
		expect(screen.queryByText('Nederlands')).not.toBeInTheDocument();
	});

	// A filter with its own list must not fire the extra aggregation request of ARC-3806 goal 6
	it('does not query the aggregations for a filter that carries its own list', () => {
		renderForm(REUSABILITY_FILTER);

		expect(useGetFilterOptions).toHaveBeenCalledWith(REUSABILITY_FILTER, false);
	});

	it('hands the ticked values back, and drops one that is unticked again', () => {
		const getParams = renderForm();

		fireEvent.click(screen.getByText('Nederlands'));
		expect(selectedValues(getParams, SearchFilterId.Language)).toEqual(['nl']);

		fireEvent.click(screen.getByText('Frans'));
		expect(selectedValues(getParams, SearchFilterId.Language)).toEqual(['nl', 'fr']);

		fireEvent.click(screen.getByText('Nederlands'));
		expect(selectedValues(getParams, SearchFilterId.Language)).toEqual(['fr']);
	});

	it('empties the selection on a reset', () => {
		const getParams = renderForm();

		fireEvent.click(screen.getByText('Nederlands'));
		expect(selectedValues(getParams, SearchFilterId.Language)).toEqual(['nl']);

		act(() => getParams().reset());

		expect(selectedValues(getParams, SearchFilterId.Language)).toEqual([]);
	});

	it('says so when there is nothing to tick', () => {
		useGetFilterOptions.mockReturnValue({ options: [], isLoading: false });

		renderForm();

		expect(screen.getByText('geen waarden gevonden')).toBeInTheDocument();
	});

	// It used to claim there was nothing to tick while the aggregation was still on its way
	it('waits rather than saying there is nothing to tick, while the options load', () => {
		useGetFilterOptions.mockReturnValue({ options: [], isLoading: true });

		renderForm();

		expect(screen.getByLabelText('Bezig met laden')).toBeInTheDocument();
		expect(screen.queryByText('geen waarden gevonden')).not.toBeInTheDocument();
	});

	// The list decides for itself whether it needs a search field: ARC-3806
	describe('the search field', () => {
		it('stays away for a list of at most ten options', () => {
			useGetFilterOptions.mockReturnValue({
				options: MAINTAINER_OPTIONS.slice(0, MAX_OPTIONS_WITHOUT_SEARCH),
				isLoading: false,
			});

			renderForm(MAINTAINERS_FILTER);

			expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
		});

		it('appears once the list holds more than ten options', () => {
			useGetFilterOptions.mockReturnValue({
				options: MAINTAINER_OPTIONS,
				isLoading: false,
			});

			renderForm(MAINTAINERS_FILTER);

			expect(MAINTAINER_OPTIONS.length).toBeGreaterThan(MAX_OPTIONS_WITHOUT_SEARCH);
			expect(searchField()).toBeInTheDocument();
		});
	});

	describe('a list with a search field', () => {
		beforeEach(() => {
			useGetFilterOptions.mockReturnValue({ options: MAINTAINER_OPTIONS, isLoading: false });
		});

		it('lists every option it is given, alphabetically', () => {
			renderForm(MAINTAINERS_FILTER);

			const labels = screen
				.getAllByText(/A Two Dogs Company|Amsab-ISG|Compagnie Cecilia/)
				.map((element) => element.textContent);

			expect(labels).toEqual(['A Two Dogs Company', 'Amsab-ISG', 'Compagnie Cecilia']);
		});

		// The FA of ARC-3806: searching and then selecting must not undo the earlier selection
		it('keeps a selection made before a search', () => {
			const getParams = renderForm(MAINTAINERS_FILTER);

			fireEvent.click(screen.getByText('A Two Dogs Company'));
			expect(selectedValues(getParams, SearchFilterId.Maintainers)).toEqual(['A Two Dogs Company']);

			fireEvent.change(searchField(), { target: { value: 'compa' } });
			expect(screen.queryByText('Amsab-ISG')).not.toBeInTheDocument();

			fireEvent.click(screen.getByText('Compagnie Cecilia'));

			expect(selectedValues(getParams, SearchFilterId.Maintainers)).toEqual([
				'A Two Dogs Company',
				'Compagnie Cecilia',
			]);
		});

		it('shows nothing found when the search matches no option', () => {
			renderForm(MAINTAINERS_FILTER);

			fireEvent.change(searchField(), { target: { value: 'zzz' } });

			expect(screen.getByText('geen waarden gevonden')).toBeInTheDocument();
		});

		it('takes a value out of the selection when it is unticked', () => {
			const getParams = renderForm(MAINTAINERS_FILTER);

			fireEvent.click(screen.getByText('Amsab-ISG'));
			expect(selectedValues(getParams, SearchFilterId.Maintainers)).toEqual(['Amsab-ISG']);

			fireEvent.click(screen.getByText('Amsab-ISG'));

			expect(selectedValues(getParams, SearchFilterId.Maintainers)).toEqual([]);
		});
	});
});
