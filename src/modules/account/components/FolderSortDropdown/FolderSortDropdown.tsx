import { type FolderSortOption, GET_FOLDER_SORT_OPTIONS } from '@account/const';
import { Button, Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { ListNavigation, type ListNavigationItem } from '@shared/components/ListNavigation';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import { type FC, useState } from 'react';

import styles from './FolderSortDropdown.module.scss';

interface FolderSortDropdownProps {
	id: string;
	className?: string;
	activeSort: FolderSortOption;
	onSortChange: (sort: FolderSortOption) => void;
}

/**
 * Icon button with a dropdown to choose the sort order of a list of folders
 */
export const FolderSortDropdown: FC<FolderSortDropdownProps> = ({
	id,
	className,
	activeSort,
	onSortChange,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const sortOptions = GET_FOLDER_SORT_OPTIONS();
	const activeSortLabel = sortOptions.find((option) => option.id === activeSort)?.label || '';

	const listItems: ListNavigationItem[] = sortOptions.map((option) => ({
		id: `folder-sort--${option.id}`,
		active: option.id === activeSort,
		node: ({ buttonClassName }) => (
			<Button
				className={buttonClassName}
				label={option.label}
				variants={['text', 'block']}
				onClick={() => {
					onSortChange(option.id);
					setIsOpen(false);
				}}
			/>
		),
	}));

	return (
		<Dropdown
			id={`folder-sort-dropdown--${id}`}
			className={clsx(className, styles['c-folder-sort-dropdown'])}
			flyoutClassName={styles['c-folder-sort-dropdown__flyout']}
			isOpen={isOpen}
			onOpen={() => setIsOpen(true)}
			onClose={() => setIsOpen(false)}
			placement="bottom-start"
			keyboard="menu"
		>
			<DropdownButton>
				<Button
					className={styles['c-folder-sort-dropdown__button']}
					variants={['text', 'icon', 'sm']}
					icon={<Icon name={IconNamesLight.SortTable} aria-hidden />}
					ariaLabel={tText(
						'modules/account/components/folder-sort-dropdown/folder-sort-dropdown___sorteer-mappen-sort',
						{ sort: activeSortLabel }
					)}
					tooltipText={tText(
						'modules/account/components/folder-sort-dropdown/folder-sort-dropdown___sorteer-mappen'
					)}
				/>
			</DropdownButton>
			<DropdownContent>
				<ListNavigation listItems={listItems} />
			</DropdownContent>
		</Dropdown>
	);
};
