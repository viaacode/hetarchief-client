import { Button, Checkbox } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight, IconNamesSolid } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import { type FC, useEffect, useRef } from 'react';

import styles from './ResultCardBookmarkSlot.module.scss';

/**
 * Elements with this attribute handle their own clicks while selecting multiple objects
 * see SelectableMediaCard
 */
export const MULTISELECT_CONTROL_ATTRIBUTE = 'data-multiselect-control';

interface ResultCardBookmarkSlotProps {
	title: string;
	isInFolder: boolean;
	isMultiselectActive: boolean;
	isSelected: boolean;
	/**
	 * Move the focus to the checkbox, eg: when the multiselect mode was started from this card
	 */
	autoFocus?: boolean;
	onBookmarkClick: () => void;
	onToggleSelected: () => void;
}

/**
 * Rendered over the top of a search result:
 * - bookmark icon in the top left corner, filled when the object is already in one of your folders
 * - bar over the full width of the card with a checkbox while selecting multiple objects
 */
export const ResultCardBookmarkSlot: FC<ResultCardBookmarkSlotProps> = ({
	title,
	isInFolder,
	isMultiselectActive,
	isSelected,
	autoFocus = false,
	onBookmarkClick,
	onToggleSelected,
}) => {
	const slotRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isMultiselectActive && autoFocus) {
			slotRef.current?.querySelector('input')?.focus();
		}
	}, [isMultiselectActive, autoFocus]);

	if (isMultiselectActive) {
		// Clicking the bar outside of the checkbox toggles the selection through the card, see SelectableMediaCard
		return (
			<div
				ref={slotRef}
				className={clsx(
					styles['c-result-card-bookmark-slot__bar'],
					isSelected && styles['c-result-card-bookmark-slot__bar--selected']
				)}
			>
				<div
					className={styles['c-result-card-bookmark-slot__checkbox-wrapper']}
					{...{ [MULTISELECT_CONTROL_ATTRIBUTE]: true }}
				>
					<Checkbox
						className={styles['c-result-card-bookmark-slot__checkbox']}
						checked={isSelected}
						checkIcon={<Icon name={IconNamesLight.Check} aria-hidden />}
						onChange={onToggleSelected}
						variants={['no-label']}
						aria-label={tText(
							'modules/search/components/result-card-bookmark-slot/result-card-bookmark-slot___selecteer-title',
							{ title }
						)}
					/>
				</div>
				{isSelected && (
					<span aria-hidden>
						{tText(
							'modules/search/components/result-card-bookmark-slot/result-card-bookmark-slot___geselecteerd'
						)}
					</span>
				)}
			</div>
		);
	}

	return (
		<Button
			className={styles['c-result-card-bookmark-slot__bookmark']}
			onClick={onBookmarkClick}
			icon={
				<Icon name={isInFolder ? IconNamesSolid.Bookmark : IconNamesLight.Bookmark} aria-hidden />
			}
			variants={['text', 'xxs']}
			title={tText(
				'modules/visitor-space/components/visitor-space-search-page/visitor-space-search-page___sla-dit-item-op'
			)}
			ariaLabel={
				isInFolder
					? tText(
							'modules/search/components/result-card-bookmark-slot/result-card-bookmark-slot___bewaar-title-in-een-map-dit-object-zit-al-in-een-map',
							{ title }
						)
					: tText(
							'modules/search/components/result-card-bookmark-slot/result-card-bookmark-slot___bewaar-title-in-een-map',
							{ title }
						)
			}
		/>
	);
};
