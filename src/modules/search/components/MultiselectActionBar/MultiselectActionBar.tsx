import { Button, Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { ListNavigation, type ListNavigationItem } from '@shared/components/ListNavigation';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import { type FC, type RefObject, useEffect, useRef, useState } from 'react';

import { MAX_SELECT_ALL_RESULTS, SELECT_PAGES_OPTIONS } from './MultiselectActionBar.const';
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
	 * Disables "select all results" when all results of the search are already selected
	 */
	isAllResultsSelected: boolean;
	/**
	 * Number of pages from the current page up to the last page, including the current page
	 */
	remainingPageCount: number;
	/**
	 * Whether the results of the other pages are being fetched to select them
	 */
	isSelectingResults?: boolean;
	isSaving?: boolean;
	/**
	 * Select only the results of the current page, replacing the current selection
	 */
	onSelectAllOnPage: () => void;
	/**
	 * Select the results of the current page and the pages after it
	 */
	onSelectPages: (pageCount: number) => void;
	onSelectAllResults: () => void;
	onDeselectAll: () => void;
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
	remainingPageCount,
	isSelectingResults = false,
	isSaving = false,
	onSelectAllOnPage,
	onSelectPages,
	onSelectAllResults,
	onDeselectAll,
	onSave,
	onClose,
	saveButtonRef,
}) => {
	const [isSelectPagesOpen, setIsSelectPagesOpen] = useState(false);
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

	const renderSelectPagesDropdown = () => {
		// Only offer the options that still leave pages unselected
		const options = SELECT_PAGES_OPTIONS.filter((count) => count < remainingPageCount);
		// The first option that reaches the last page is replaced by "select all"
		const canSelectAll =
			totalCount <= MAX_SELECT_ALL_RESULTS &&
			SELECT_PAGES_OPTIONS.some((count) => count >= remainingPageCount);
		const renderOption = (id: string, label: string, onClick: () => void) => ({
			id,
			node: ({ buttonClassName }: { buttonClassName?: string }) => (
				<Button
					className={buttonClassName}
					label={label}
					variants={['text', 'block']}
					disabled={isSelectingResults}
					onClick={() => {
						onClick();
						setIsSelectPagesOpen(false);
					}}
				/>
			),
		});
		const listItems: ListNavigationItem[] = options.map((count) =>
			renderOption(
				`select-pages--${count}`,
				tText(
					'modules/search/components/multiselect-action-bar/multiselect-action-bar___selecteer-count-paginas',
					{ count }
				),
				() => onSelectPages(count)
			)
		);
		if (canSelectAll) {
			listItems.push(
				renderOption(
					'select-pages--all',
					tText(
						'modules/search/components/multiselect-action-bar/multiselect-action-bar___selecteer-alles'
					),
					onSelectAllResults
				)
			);
		}
		if (!listItems.length) {
			return null;
		}
		return (
			<Dropdown
				id="multiselect-action-bar__select-pages"
				className={styles['c-multiselect-action-bar__select-pages']}
				flyoutClassName={styles['c-multiselect-action-bar__select-pages-flyout']}
				isOpen={isSelectPagesOpen}
				onOpen={() => setIsSelectPagesOpen(true)}
				onClose={() => setIsSelectPagesOpen(false)}
				placement="bottom-end"
				keyboard="menu"
			>
				<DropdownButton>
					<Button
						className={clsx(
							styles['c-multiselect-action-bar__button'],
							styles['c-multiselect-action-bar__button--dropdown']
						)}
						variants={['outline', 'icon']}
						icon={<Icon name={IconNamesLight.AngleDown} aria-hidden />}
						ariaLabel={tText(
							'modules/search/components/multiselect-action-bar/multiselect-action-bar___meerdere-paginas-selecteren'
						)}
					/>
				</DropdownButton>
				<DropdownContent>
					<ListNavigation listItems={listItems} />
				</DropdownContent>
			</Dropdown>
		);
	};

	const renderSelectAllResults = () => {
		// All results are already on this page, so "select all" covers them
		if (totalCount <= pageCount) {
			return null;
		}
		// Selecting all results is only offered for searches with a limited number of results
		if (totalCount > MAX_SELECT_ALL_RESULTS) {
			return null;
		}
		return (
			<Button
				className={clsx(
					styles['c-multiselect-action-bar__button'],
					styles['c-multiselect-action-bar__button--link']
				)}
				variants={['text']}
				label={tText(
					'modules/search/components/multiselect-action-bar/multiselect-action-bar___selecteer-alle-count-resultaten',
					{ count: totalCount }
				)}
				onClick={onSelectAllResults}
				disabled={isAllResultsSelected || isSelectingResults}
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
					<div className={styles['c-multiselect-action-bar__select-page']}>
						<Button
							className={styles['c-multiselect-action-bar__button']}
							variants={['outline']}
							label={tText(
								'modules/search/components/multiselect-action-bar/multiselect-action-bar___selecteer-pagina'
							)}
							onClick={onSelectAllOnPage}
						/>
						{renderSelectPagesDropdown()}
					</div>
					<p className={styles['c-multiselect-action-bar__count']} aria-live="polite" role="status">
						<span className={styles['c-multiselect-action-bar__count-badge']}>{selectedCount}</span>
						{selectedCount === 1
							? tText(
									'modules/search/components/multiselect-action-bar/multiselect-action-bar___object-geselecteerd'
								)
							: tText(
									'modules/search/components/multiselect-action-bar/multiselect-action-bar___objecten-geselecteerd'
								)}
					</p>
					{selectedCount > 0 && (
						<Button
							className={clsx(
								styles['c-multiselect-action-bar__button'],
								styles['c-multiselect-action-bar__button--link']
							)}
							variants={['text']}
							label={tText(
								'modules/search/components/multiselect-action-bar/multiselect-action-bar___deselecteer'
							)}
							onClick={onDeselectAll}
						/>
					)}
					{renderSelectAllResults()}
				</div>
				<div className={styles['c-multiselect-action-bar__save-actions']}>
					<Button
						buttonRef={saveButtonRef}
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
