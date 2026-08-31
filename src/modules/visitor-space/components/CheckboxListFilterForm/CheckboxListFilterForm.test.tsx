import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { FilterMenuType } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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

import { FilterModalType, SearchFilterId } from '@visitor-space/types';
import { CheckboxListFilterForm } from './CheckboxListFilterForm';

const LANGUAGE_FILTER = {
	id: SearchFilterId.Language,
	label: 'Taal',
	field: IeObjectsSearchFilterField.LANGUAGE,
	modalType: FilterModalType.CheckboxList,
	type: FilterMenuType.Modal,
	inMainPanelByDefault: false,
	tabs: [],
};

/** Herbruikbaarheid brings its own list, so it never queries the aggregations. */
const REUSABILITY_FILTER = {
	...LANGUAGE_FILTER,
	id: SearchFilterId.Reusability,
	label: 'Herbruikbaarheid',
	field: IeObjectsSearchFilterField.REUSABILITY,
	options: () => [
		{ label: 'Publiek domein', value: 'public-domain' },
		{ label: 'Copyright onbepaald', value: 'copyright-undetermined' },
	],
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

const selectedValues = (getParams: () => { values: Record<string, string[]> }, id: string) =>
	getParams().values[id];

const AGGREGATED_OPTIONS = [
	{ label: 'Nederlands', value: 'nl' },
	{ label: 'Frans', value: 'fr' },
];

describe('CheckboxListFilterForm', () => {
	beforeEach(() => {
		useGetFilterOptions.mockReset();
		useGetFilterOptions.mockReturnValue({ options: AGGREGATED_OPTIONS, isLoading: false });
	});

	it('has no search field, unlike the searchable checkbox filter', () => {
		renderForm();

		expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
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
});
