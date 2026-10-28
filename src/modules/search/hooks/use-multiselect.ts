import { uniq } from 'es-toolkit/compat';
import { useCallback, useEffect, useState } from 'react';

export interface Multiselect {
	isActive: boolean;
	/**
	 * Schema identifiers of the selected objects, in the order they were selected
	 */
	selectedIds: string[];
	isSelected: (id: string) => boolean;
	/**
	 * Enter the multiselect mode, optionally with some objects already selected
	 */
	open: (initialSelectedIds?: string[]) => void;
	toggle: (id: string) => void;
	selectMany: (ids: string[]) => void;
	/**
	 * Replaces the current selection with these objects
	 */
	selectOnly: (ids: string[]) => void;
	deselect: (id: string) => void;
	deselectAll: () => void;
	/**
	 * Clears the selection and exits the multiselect mode
	 */
	close: () => void;
}

/**
 * Keeps track of the objects that are selected on the search page to add them to folders at once
 * The selection is stored as schema identifiers, not as DOM state, so selecting across pages could be added later
 * @param resetKey the selection is silently cleared and the mode is closed whenever this key changes, eg: the search query, filters, tab or page
 */
export function useMultiselect(resetKey: string): Multiselect {
	const [isActive, setIsActive] = useState(false);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);

	const close = useCallback(() => {
		setIsActive(false);
		setSelectedIds([]);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: close the multiselect mode when the search changes
	useEffect(() => {
		close();
	}, [resetKey, close]);

	const open = useCallback((initialSelectedIds: string[] = []) => {
		setIsActive(true);
		setSelectedIds(uniq(initialSelectedIds));
	}, []);

	const toggle = useCallback((id: string) => {
		setSelectedIds((ids) => (ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]));
	}, []);

	const selectMany = useCallback((ids: string[]) => {
		setSelectedIds((currentIds) => uniq([...currentIds, ...ids]));
	}, []);

	const selectOnly = useCallback((ids: string[]) => {
		setSelectedIds(uniq(ids));
	}, []);

	const deselect = useCallback((id: string) => {
		setSelectedIds((ids) => ids.filter((i) => i !== id));
	}, []);

	const deselectAll = useCallback(() => {
		setSelectedIds([]);
	}, []);

	const isSelected = useCallback((id: string) => selectedIds.includes(id), [selectedIds]);

	return {
		isActive,
		selectedIds,
		isSelected,
		open,
		toggle,
		selectMany,
		selectOnly,
		deselect,
		deselectAll,
		close,
	};
}
