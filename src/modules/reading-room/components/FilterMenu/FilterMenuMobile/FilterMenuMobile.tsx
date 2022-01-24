import { Button, TagList } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, ReactElement } from 'react';

import { Icon, Navigation } from '@shared/components';

import { FilterMenuFilterOption } from '../FilterMenu.types';

import styles from './FilterMenuMobile.module.scss';
import { FilterMenuMobileProps } from './FilterMenuMobile.types';

const FilterMenuMobile: FC<FilterMenuMobileProps> = ({
	activeFilter,
	isOpen,
	filters,
	onClose,
	onFilterClick = () => null,
}) => {
	if (!isOpen) {
		return null;
	}

	// TODO: move to separate component
	const renderFilterButton = ({ icon, id, label }: FilterMenuFilterOption): ReactElement => {
		const filterIsActive = id === activeFilter;
		const filterBtnCls = clsx(styles['c-filter-menu__filter'], {
			[styles['c-filter-menu__filter--active']]: filterIsActive,
		});
		const iconName = filterIsActive ? 'angle-left' : icon ?? 'angle-right';

		return (
			<Button
				key={`filter-menu-btn-${id}`}
				className={filterBtnCls}
				iconEnd={<Icon name={iconName} />}
				label={label}
				variants={['black', 'block']}
				onClick={() => onFilterClick(id)}
			/>
		);
	};

	return (
		<div className={styles['c-filter-menu-mobile']}>
			<Navigation className={styles['c-filter-menu-mobile__nav']}>
				<Button
					className={styles['c-filter-menu-mobile__back']}
					iconStart={<Icon name="arrow-left" />}
					label="Zoekresultaten"
					variants={['text']}
					onClick={onClose}
				/>
			</Navigation>

			<div className="l-container">
				<h4 className="u-text-center u-mt-24">Filters</h4>

				<TagList
					closeIcon={<Icon name="times" />}
					tags={[]}
					variants="large"
					onTagClosed={() => null}
				/>
			</div>

			<div className={clsx(styles['c-filter-menu-mobile__filters'], 'u-mt-24')}>
				{(filters ?? []).map(renderFilterButton)}
			</div>
		</div>
	);
};

export default FilterMenuMobile;
