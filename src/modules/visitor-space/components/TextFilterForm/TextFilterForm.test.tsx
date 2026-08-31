import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { act, fireEvent, render, screen } from '@testing-library/react';
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

import { FilterModalType, Operator, SearchFilterId } from '@visitor-space/types';
import { TextFilterForm } from './TextFilterForm';

const TITLE_FILTER = {
	id: SearchFilterId.Title,
	label: 'Titel',
	field: IeObjectsSearchFilterField.NAME,
	modalType: FilterModalType.Text,
	type: FilterMenuType.Modal,
	inMainPanelByDefault: false,
	tabs: [],
};

/** The text field of every condition, in render order. */
const valueInputs = (): HTMLInputElement[] => screen.getAllByRole('textbox') as HTMLInputElement[];

const addConditionButton = () => screen.getByText('voeg voorwaarde toe');
const clearButtons = () => screen.getAllByLabelText('voorwaarde wissen');

const renderForm = () => {
	// biome-ignore lint/suspicious/noExplicitAny: the children callback shape is checked by the form
	let latest: any;
	render(
		<TextFilterForm filter={TITLE_FILTER}>
			{(params) => {
				latest = params;
				return null;
			}}
		</TextFilterForm>
	);
	return () => latest;
};

describe('TextFilterForm', () => {
	it('opens with one empty condition', () => {
		renderForm();

		expect(valueInputs()).toHaveLength(1);
		expect(valueInputs()[0].value).toEqual('');
	});

	it('adds a condition per click, without a limit', () => {
		renderForm();

		fireEvent.click(addConditionButton());
		fireEvent.click(addConditionButton());
		fireEvent.click(addConditionButton());

		expect(valueInputs()).toHaveLength(4);
	});

	it('removes the row when one of several conditions is cleared', () => {
		renderForm();

		fireEvent.click(addConditionButton());
		fireEvent.click(addConditionButton());
		fireEvent.click(addConditionButton());
		expect(valueInputs()).toHaveLength(4);

		fireEvent.click(clearButtons()[0]);

		expect(valueInputs()).toHaveLength(3);
	});

	it('only empties the text field when the last condition is cleared', () => {
		renderForm();

		fireEvent.change(valueInputs()[0], { target: { value: 'concert' } });
		expect(valueInputs()[0].value).toEqual('concert');

		fireEvent.click(clearButtons()[0]);

		expect(valueInputs()).toHaveLength(1);
		expect(valueInputs()[0].value).toEqual('');
	});

	it('hands back the conditions that hold a value, and drops the empty ones', () => {
		const getParams = renderForm();

		fireEvent.change(valueInputs()[0], { target: { value: 'concert' } });
		fireEvent.click(addConditionButton());

		expect(getParams().values[SearchFilterId.Title]).toEqual([
			{ op: Operator.CONTAINS, val: 'concert' },
		]);
	});

	it('resets back to one empty condition', () => {
		const getParams = renderForm();

		fireEvent.change(valueInputs()[0], { target: { value: 'concert' } });
		fireEvent.click(addConditionButton());
		act(() => getParams().reset());

		expect(valueInputs()).toHaveLength(1);
		expect(valueInputs()[0].value).toEqual('');
		expect(getParams().values[SearchFilterId.Title]).toEqual([]);
	});
});
