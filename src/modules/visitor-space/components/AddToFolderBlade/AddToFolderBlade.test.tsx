import type { Folder } from '@account/types';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import AddToFolderBlade from './AddToFolderBlade';
import type { FolderChanges } from './AddToFolderBlade.types';

vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string) => key.split('___').pop() || '',
	tHtml: (key: string) => key.split('___').pop() || '',
}));

vi.mock('@shared/hooks/has-permission', () => ({
	useHasAllPermission: () => false,
}));

// The real blade needs the redux store, only its content and footer buttons matter here
vi.mock('@shared/components/Blade/Blade', () => ({
	Blade: ({
		children,
		footerButtons,
	}: {
		children: ReactNode;
		footerButtons: { label: string; onClick: () => void; disabled?: boolean }[];
	}) => (
		<div>
			{children}
			{footerButtons.map((button) => (
				<button
					key={button.label}
					type="button"
					onClick={button.onClick}
					disabled={button.disabled}
				>
					{button.label}
				</button>
			))}
		</div>
	),
}));

vi.mock('@account/components', () => ({
	CreateFolderButton: () => null,
}));

const mockFolders: Partial<Folder>[] = [
	{ id: 'folder-none', name: 'Map zonder objecten', objects: [{ schemaIdentifier: 'other' }] },
	{
		id: 'folder-some',
		name: 'Map met een object',
		objects: [{ schemaIdentifier: 'object-1' }],
	},
	{
		id: 'folder-all',
		name: 'Map met alle objecten',
		objects: [{ schemaIdentifier: 'object-1' }, { schemaIdentifier: 'object-2' }],
	},
] as Partial<Folder>[];

vi.mock('@account/hooks/get-folders', () => ({
	useGetFolders: () => ({ data: mockFolders, isError: false, refetch: vi.fn() }),
}));

const objectsToAdd = [
	{ schemaIdentifier: 'object-1', title: 'Object 1' },
	{ schemaIdentifier: 'object-2', title: 'Object 2' },
];

const getCheckbox = (folderName: string) =>
	screen.getByLabelText(`voeg-folder-toe-aan-map`, {
		selector: `input[value="add-to--${mockFolders.find((folder) => folder.name === folderName)?.id}"]`,
	}) as HTMLInputElement;

// The hints that are not hidden, the other hints only reserve space so the list does not jump
const getVisibleHints = (folderName: string) =>
	Array.from(
		getCheckbox(folderName).closest('li')?.querySelectorAll('[aria-hidden="false"]') || []
	).map((hint) => hint.textContent);

const getSaveButton = () =>
	screen.getAllByRole('button').find((button) => /voeg-toe|opslaan/.test(button.textContent || ''));

describe('<AddToFolderBlade /> with multiple objects', () => {
	let onSaveMultipleObjects: Mock<(changes: FolderChanges) => Promise<void>>;

	beforeEach(() => {
		onSaveMultipleObjects = vi
			.fn<(changes: FolderChanges) => Promise<void>>()
			.mockResolvedValue(undefined);
		render(
			<AddToFolderBlade
				isOpen
				objectsToAdd={objectsToAdd}
				onSaveMultipleObjects={onSaveMultipleObjects}
				onClose={vi.fn()}
				id="add-to-folder-blade-test"
				ariaLabel="add to folder"
			/>
		);
	});

	it('shows the folder contents of the selected objects', () => {
		expect(getCheckbox('Map zonder objecten').checked).toBe(false);
		expect(getCheckbox('Map zonder objecten').indeterminate).toBe(false);
		expect(getCheckbox('Map met een object').indeterminate).toBe(true);
		expect(getCheckbox('Map met alle objecten').checked).toBe(true);
		expect(getVisibleHints('Map zonder objecten')).toEqual([]);
		expect(getVisibleHints('Map met een object')).toEqual([
			'count-van-de-total-objecten-zitten-al-in-deze-map',
		]);
		expect(getVisibleHints('Map met alle objecten')).toEqual([]);
	});

	it('cycles an indeterminate folder through checked, unchecked and back to indeterminate', () => {
		const checkbox = getCheckbox('Map met een object');

		fireEvent.click(checkbox);
		expect(checkbox.checked).toBe(true);
		expect(checkbox.indeterminate).toBe(false);
		expect(getVisibleHints('Map met een object')).toEqual([
			'1-object-wordt-aan-deze-map-toegevoegd',
		]);

		fireEvent.click(checkbox);
		expect(checkbox.checked).toBe(false);
		expect(checkbox.indeterminate).toBe(false);
		expect(getVisibleHints('Map met een object')).toEqual([
			'1-object-wordt-uit-deze-map-verwijderd',
		]);

		fireEvent.click(checkbox);
		expect(checkbox.indeterminate).toBe(true);
	});

	it('reserves space for every hint the folder can show', () => {
		// Icons are also aria-hidden, but are not hints
		const hints = Array.from(
			getCheckbox('Map met een object').closest('li')?.querySelectorAll('[aria-hidden]') || []
		).filter((element) => !element.classList.contains('c-icon'));
		expect(hints.map((hint) => hint.textContent)).toEqual([
			'count-van-de-total-objecten-zitten-al-in-deze-map',
			'1-object-wordt-aan-deze-map-toegevoegd',
			'1-object-wordt-uit-deze-map-verwijderd',
		]);
	});

	it('saves the folders to add to and remove from', () => {
		fireEvent.click(getCheckbox('Map zonder objecten'));
		fireEvent.click(getCheckbox('Map met alle objecten'));
		expect(getVisibleHints('Map zonder objecten')).toEqual([
			'count-objecten-worden-aan-deze-map-toegevoegd',
		]);
		expect(getVisibleHints('Map met alle objecten')).toEqual([
			'count-objecten-worden-uit-deze-map-verwijderd',
		]);

		const saveButton = getSaveButton();
		// Removing objects is not "adding"
		expect(saveButton?.textContent).toContain('opslaan');
		fireEvent.click(saveButton as HTMLElement);

		expect(onSaveMultipleObjects).toHaveBeenCalledWith({
			addToFolderIds: ['folder-none'],
			removeFromFolderIds: ['folder-all'],
		});
	});

	it('does not save when nothing changed', () => {
		expect(getSaveButton()).toHaveProperty('disabled', true);
	});
});
