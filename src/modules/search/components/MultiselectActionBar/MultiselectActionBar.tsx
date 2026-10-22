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
	 * Shows "deselect all" instead of "select all" when all results on the current page are selected
	 */
	isAllOnPageSelected: boolean;
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
	 * Whether the results of the other pages are being fetched to select them
	 */
	isSelectingAllResults?: boolean;
	isSaving?: boolean;
	onSelectAllOnPage: () => void;
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
	isAllOnPageSelected,
	pageCount,
	totalCount,
	isAllResultsSelected,
	isSelectingAllResults = false,
	isSaving = false,
	onSelectAllOnPage,
	onSelectAllResults,
	onDeselectAll,
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

	const renderSelectAllResults = () => {
		// All results are already on this page, so "select all" covers them
		if (totalCount <= pageCount) {
			return null;
		}
		if (totalCount > MAX_SELECT_ALL_RESULTS) {
			return (
				<p className={styles['c-multiselect-action-bar__too-many-results']}>
					{tText(
						'modules/search/components/multiselect-action-bar/multiselect-action-bar___te-veel-resultaten-om-alles-te-selecteren',
						{ max: MAX_SELECT_ALL_RESULTS }
					)}
				</p>
			);
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
				disabled={isAllResultsSelected || isSelectingAllResults}
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
			<p className={styles['c-multiselect-action-bar__count']} aria-live="polite" role="status">
				{selectedCount === 1
					? tText(
							'modules/search/components/multiselect-action-bar/multiselect-action-bar___1-object-geselecteerd'
						)
					: tText(
							'modules/search/components/multiselect-action-bar/multiselect-action-bar___count-objecten-geselecteerd',
							{ count: selectedCount }
						)}
			</p>
			<div className={styles['c-multiselect-action-bar__actions']}>
				<div className={styles['c-multiselect-action-bar__selection-actions']}>
					{isAllOnPageSelected ? (
						<Button
							className={styles['c-multiselect-action-bar__button']}
							variants={['outline']}
							label={tText(
								'modules/search/components/multiselect-action-bar/multiselect-action-bar___deselecteer-alles'
							)}
							onClick={onDeselectAll}
						/>
					) : (
						<Button
							className={styles['c-multiselect-action-bar__button']}
							variants={['outline']}
							label={tText(
								'modules/search/components/multiselect-action-bar/multiselect-action-bar___selecteer-alles'
							)}
							onClick={onSelectAllOnPage}
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
							'modules/search/components/multiselect-action-bar/multiselect-action-bar___bewaren-in-map-pen'
						)}
						onClick={onSave}
						disabled={selectedCount === 0 || isSaving}
					/>
					<Button
						className={clsx(
							styles['c-multiselect-action-bar__button'],
							styles['c-multiselect-action-bar__button--close']
						)}
						variants={['text']}
						iconStart={<Icon name={IconNamesLight.Times} aria-hidden />}
						label={tText(
							'modules/search/components/multiselect-action-bar/multiselect-action-bar___sluiten'
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
