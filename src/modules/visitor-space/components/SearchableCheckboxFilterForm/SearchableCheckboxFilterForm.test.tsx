import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { fireEvent, render, screen } from '@testing-library/react';
import { FilterMenuType } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string) => key.split('___').pop()?.replaceAll('-', ' ') || '',
	tHtml: (key: string) => key.split('___').pop()?.replaceAll('-', ' ') || '',
}));

vi.mock('use-query-params', async (importOriginal) => ({
	...(await importOriginal<typeof import('use-query-params')>()),
	useQueryParams: () => [{}, vi.fn()],
}));

vi.mock('@visitor-space/hooks/get-filter-options', () => ({
	useGetFilterOptions: () => ({
		options: [
			{ label: 'A Two Dogs Company', value: 'A Two Dogs Company' },
			{ label: 'Compagnie Cecilia', value: 'Compagnie Cecilia' },
			{ label: 'Amsab-ISG', value: 'Amsab-ISG' },
		],
		isLoading: false,
	}),
}));

import { FilterModalType, SearchFilterId } from '@visitor-space/types';
import { SearchableCheckboxFilterForm } from './SearchableCheckboxFilterForm';

const MAINTAINERS_FILTER = {
	id: SearchFilterId.Maintainers,
	label: 'Aanbieder',
	field: IeObjectsSearchFilterField.MAINTAINER_ID,
	modalType: FilterModalType.SearchableCheckbox,
	type: FilterMenuType.Modal,
	inMainPanelByDefault: true,
	tabs: [],
};

const renderForm = () => {
	// biome-ignore lint/suspicious/noExplicitAny: the children callback shape is checked by the form
	let latest: any;
	render(
		<SearchableCheckboxFilterForm filter={MAINTAINERS_FILTER}>
			{(params) => {
				latest = params;
				return null;
			}}
		</SearchableCheckboxFilterForm>
	);
	return () => latest;
};

const searchField = () => screen.getByRole('textbox');
const selectedValues = (getParams: () => { values: Record<string, string[]> }) =>
	getParams().values[SearchFilterId.Maintainers];

describe('SearchableCheckboxFilterForm', () => {
	it('lists every option it is given', () => {
		renderForm();

		expect(screen.getByText('A Two Dogs Company')).toBeInTheDocument();
		expect(screen.getByText('Amsab-ISG')).toBeInTheDocument();
		expect(screen.getByText('Compagnie Cecilia')).toBeInTheDocument();
	});

	it('sorts the options alphabetically', () => {
		renderForm();

		const labels = screen
			.getAllByText(/A Two Dogs Company|Amsab-ISG|Compagnie Cecilia/)
			.map((element) => element.textContent);

		expect(labels).toEqual(['A Two Dogs Company', 'Amsab-ISG', 'Compagnie Cecilia']);
	});

	// The FA of ARC-3806: searching and then selecting must not undo the earlier selection
	it('keeps a selection made before a search', () => {
		const getParams = renderForm();

		fireEvent.click(screen.getByText('A Two Dogs Company'));
		expect(selectedValues(getParams)).toEqual(['A Two Dogs Company']);

		fireEvent.change(searchField(), { target: { value: 'compa' } });
		expect(screen.queryByText('Amsab-ISG')).not.toBeInTheDocument();

		fireEvent.click(screen.getByText('Compagnie Cecilia'));

		expect(selectedValues(getParams)).toEqual(['A Two Dogs Company', 'Compagnie Cecilia']);
	});

	it('shows nothing found when the search matches no option', () => {
		renderForm();

		fireEvent.change(searchField(), { target: { value: 'zzz' } });

		expect(screen.getByText('geen waarden gevonden')).toBeInTheDocument();
	});

	it('takes a value out of the selection when it is unticked', () => {
		const getParams = renderForm();

		fireEvent.click(screen.getByText('Amsab-ISG'));
		expect(selectedValues(getParams)).toEqual(['Amsab-ISG']);

		fireEvent.click(screen.getByText('Amsab-ISG'));

		expect(selectedValues(getParams)).toEqual([]);
	});
});
