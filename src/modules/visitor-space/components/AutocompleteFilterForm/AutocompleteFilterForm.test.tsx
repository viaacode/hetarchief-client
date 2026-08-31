import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

vi.mock('@visitor-space/hooks/get-search-query-filters', () => ({
	useSearchQueryFilters: () => [],
}));

const getAutocompleteFieldOptions = vi.fn(async () => [
	'Abel Joseph Riviere',
	'Achiel Alberic Devos',
]);

vi.mock('@ie-objects/services', () => ({
	IeObjectsService: {
		getAutocompleteFieldOptions: (...args: unknown[]) =>
			getAutocompleteFieldOptions(...(args as [])),
	},
}));

import { FilterModalType, SearchFilterId } from '@visitor-space/types';
import { AUTOCOMPLETE_MINIMUM_CHARACTERS, AutocompleteFilterForm } from './AutocompleteFilterForm';

const MENTIONS_FILTER = {
	id: SearchFilterId.Mentions,
	label: 'Namenlijst gesneuvelden',
	field: IeObjectsSearchFilterField.MENTIONS,
	modalType: FilterModalType.Autocomplete,
	type: FilterMenuType.Modal,
	inMainPanelByDefault: true,
	tabs: [],
};

const renderForm = () => {
	// biome-ignore lint/suspicious/noExplicitAny: the children callback shape is checked by the form
	let latest: any;
	render(
		<AutocompleteFilterForm filter={MENTIONS_FILTER}>
			{(params) => {
				latest = params;
				return null;
			}}
		</AutocompleteFilterForm>
	);
	return () => latest;
};

const type = (value: string) =>
	fireEvent.change(screen.getByRole('combobox'), { target: { value } });

describe('AutocompleteFilterForm', () => {
	it('asks for three characters before it fetches anything', () => {
		getAutocompleteFieldOptions.mockClear();
		renderForm();

		type('Ab');

		expect(AUTOCOMPLETE_MINIMUM_CHARACTERS).toEqual(3);
		expect(getAutocompleteFieldOptions).not.toHaveBeenCalled();
		expect(screen.getByText('geef minstens 3 karakters in')).toBeInTheDocument();
	});

	it('fetches suggestions from three characters on', async () => {
		getAutocompleteFieldOptions.mockClear();
		renderForm();

		type('Abe');

		await waitFor(() => expect(getAutocompleteFieldOptions).toHaveBeenCalled());
		expect(getAutocompleteFieldOptions).toHaveBeenCalledWith('mentions', 'Abe', expect.anything());
	});

	it('gathers picked values as pills and keeps them while searching again', async () => {
		const getParams = renderForm();

		type('Abe');
		fireEvent.click(await screen.findByText('Abel Joseph Riviere'));

		expect(getParams().values[SearchFilterId.Mentions]).toEqual(['Abel Joseph Riviere']);
		expect(screen.getByText('geselecteerd')).toBeInTheDocument();

		type('Ach');
		fireEvent.click(await screen.findByText('Achiel Alberic Devos'));

		expect(getParams().values[SearchFilterId.Mentions]).toEqual([
			'Abel Joseph Riviere',
			'Achiel Alberic Devos',
		]);
	});

	it('leaves a value that is already picked out of the dropdown', async () => {
		renderForm();

		type('Abe');
		fireEvent.click(await screen.findByText('Abel Joseph Riviere'));

		type('Abe');

		await waitFor(() => expect(screen.queryAllByText('Abel Joseph Riviere')).toHaveLength(1));
	});
});
