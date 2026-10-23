import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import { type FC, type RefObject, useEffect, useRef } from 'react';

import { MAX_SELECT_ALL_RESULTS } from './MultiselectActionBar.const';
import styles from './MultiselectActionBar.module.scss';

interface MultiselectActionBarProps {
	className?: string;
	selectedCount: number;
	/**
	 * Number of results on the current page
	 */
	pageCount: number;
	/**
	 * Number of results of the search over all pages
	 */
	totalCount: number;
	/**
	 * Disables "select all results" when all results of the search, up to the maximum, are already selected
	 */
	isAllResultsSelected: boolean;
	/**
	 * Whether all results of the current page are selected
	 */
	isPageSelected: boolean;
	/**
	 * Whether the results of the other pages are being fetched to select them
	 */
	isSelectingResults?: boolean;
	isSaving?: boolean;
	/**
	 * Select only the results of the current page, replacing the current selection
	 */
	onSelectAllOnPage: () => void;
	onSelectAllResults: () => void;
	onSave: () => void;
	onClose: () => void;
	saveButtonRef?: RefObject<HTMLButtonElement>;
}

/**
 * Bar shown above the search results while objects are being selected to save them in folders at once
 */
export const MultiselectActionBar: FC<MultiselectActionBarProps> = ({
	className,
	selectedCount,
	pageCount,
	totalCount,
	isAllResultsSelected,
	isPageSelected,
	isSelectingResults = false,
	isSaving = false,
	onSelectAllOnPage,
	onSelectAllResults,
	onSave,
	onClose,
	saveButtonRef,
}) => {
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;

	// Escape exits the multiselect mode, unless a blade or modal is open, those handle escape themselves
	useEffect(() => {
		const handleKeyDown = (evt: KeyboardEvent) => {
			if (evt.key !== 'Escape' || evt.defaultPrevented) {
				return;
			}
			if (
				document.querySelector(
					'.c-blade--active, .ReactModal__Content--after-open, .c-dropdown__content-open'
				)
			) {
				return;
			}
			onCloseRef.current();
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, []);

	const renderSelectAllButton = () => {
		// Once the page is selected, the button offers to select the results of all pages,
		// large searches only select the first results up to the maximum
		const canSelectAllResults = isPageSelected && totalCount > pageCount;
		const isOverMax = totalCount > MAX_SELECT_ALL_RESULTS;
		const selectAllResultsLabel = isOverMax
			? tText(
					'modules/search/components/multiselect-action-bar/multiselect-action-bar___alle-count-max-resultaten-selecteren',
					{ count: MAX_SELECT_ALL_RESULTS }
				)
			: tText(
					'modules/search/components/multiselect-action-bar/multiselect-action-bar___alle-count-resultaten-selecteren',
					{ count: totalCount }
				);
		return (
			<Button
				className={clsx(
					styles['c-multiselect-action-bar__button'],
					styles['c-multiselect-action-bar__button--link']
				)}
				variants={['text']}
				label={
					canSelectAllResults
						? selectAllResultsLabel
						: tText(
								'modules/search/components/multiselect-action-bar/multiselect-action-bar___alles-selecteren'
							)
				}
				onClick={canSelectAllResults ? onSelectAllResults : onSelectAllOnPage}
				disabled={
					isAllResultsSelected || isSelectingResults || (isPageSelected && !canSelectAllResults)
				}
			/>
		);
	};

	return (
		<section
			className={clsx(className, styles['c-multiselect-action-bar'])}
			aria-label={tText(
				'modules/search/components/multiselect-action-bar/multiselect-action-bar___meerdere-objecten-selecteren'
			)}
		>
			<div className={styles['c-multiselect-action-bar__actions']}>
				<div className={styles['c-multiselect-action-bar__selection-actions']}>
					<p className={styles['c-multiselect-action-bar__count']} aria-live="polite" role="status">
						{tText(
							'modules/search/components/multiselect-action-bar/multiselect-action-bar___count-geselecteerd',
							{ count: selectedCount }
						)}
					</p>
					{renderSelectAllButton()}
				</div>
				<div className={styles['c-multiselect-action-bar__save-actions']}>
					<Button
						ref={saveButtonRef}
						className={clsx(
							styles['c-multiselect-action-bar__button'],
							styles['c-multiselect-action-bar__button--save']
						)}
						label={tText(
							'modules/search/components/multiselect-action-bar/multiselect-action-bar___bewaar-in-mappen'
						)}
						onClick={onSave}
						disabled={selectedCount === 0 || isSaving}
					/>
					<Button
						className={clsx(
							styles['c-multiselect-action-bar__button'],
							styles['c-multiselect-action-bar__button--close']
						)}
						variants={['text', 'icon']}
						icon={<Icon name={IconNamesLight.Times} aria-hidden />}
						title={tText(
							'modules/search/components/multiselect-action-bar/multiselect-action-bar___sluit-de-multi-select-modus'
						)}
						ariaLabel={tText(
							'modules/search/components/multiselect-action-bar/multiselect-action-bar___sluit-het-selecteren-van-meerdere-objecten'
						)}
						onClick={onClose}
					/>
				</div>
			</div>
		</section>
	);
};
