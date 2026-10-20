import { Icon } from '@shared/components/Icon';
import { IconNamesSolid } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import type { FC, MouseEvent, ReactNode } from 'react';
import { MULTISELECT_CONTROL_ATTRIBUTE } from '../ResultCardBookmarkSlot';

import styles from './SelectableMediaCard.module.scss';

interface SelectableMediaCardProps {
	children: ReactNode;
	isMultiselectActive: boolean;
	isSelected: boolean;
	isInFolder: boolean;
	view: 'grid' | 'list';
	onToggleSelected: () => void;
}

/**
 * Wraps a search result card, so the whole card toggles the selection instead of navigating while selecting multiple objects
 */
export const SelectableMediaCard: FC<SelectableMediaCardProps> = ({
	children,
	isMultiselectActive,
	isSelected,
	isInFolder,
	view,
	onToggleSelected,
}) => {
	const handleClickCapture = (evt: MouseEvent<HTMLDivElement>) => {
		if (!isMultiselectActive) {
			return;
		}
		if ((evt.target as HTMLElement).closest(`[${MULTISELECT_CONTROL_ATTRIBUTE}]`)) {
			// The checkbox handles its own clicks
			return;
		}
		// Do not navigate to the detail page, select the object instead
		evt.preventDefault();
		evt.stopPropagation();
		onToggleSelected();
	};

	return (
		// The checkbox in the card is the keyboard accessible control, clicking the card is a shortcut for mouse and touch users
		<div
			className={clsx(styles['c-selectable-media-card'], {
				[styles['c-selectable-media-card--active']]: isMultiselectActive,
				[styles['c-selectable-media-card--selected']]: isMultiselectActive && isSelected,
			})}
			onClickCapture={handleClickCapture}
		>
			{children}
			{isMultiselectActive && isInFolder && view === 'grid' && (
				<span className={styles['c-selectable-media-card__in-folder']}>
					<Icon name={IconNamesSolid.Bookmark} aria-hidden />
					<span className="u-sr-only">
						{tText(
							'modules/search/components/selectable-media-card/selectable-media-card___dit-object-zit-al-in-een-map'
						)}
					</span>
				</span>
			)}
		</div>
	);
};
