import { Button, TagList } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { FC, ReactElement } from 'react';

import { Navigation } from '@navigation/components';
import { Icon } from '@shared/components';

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
	const { t } = useTranslation();

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
		<div
			className={clsx(styles['c-filter-menu-mobile'], {
				[styles['c-filter-menu-mobile--active']]: activeFilter,
			})}
		>
			{!activeFilter ? (
				<>
					<Navigation className={styles['c-filter-menu-mobile__nav']}>
						<Button
							key="filter-menu-mobile-nav-close"
							className={styles['c-filter-menu-mobile__back']}
							iconStart={<Icon name="arrow-left" />}
							label="Zoekresultaten"
							variants={['text']}
							onClick={onClose}
						/>
					</Navigation>

					<div className="l-container">
						<h4 className="u-text-center u-mt-24">
							{t(
								'modules/reading-room/components/filter-menu/filter-menu-mobile/filter-menu-mobile___filters'
							)}
						</h4>

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
				</>
			) : (
				<>
					<Navigation className={styles['c-filter-menu-mobile__nav']}>
						<Button
							key="filter-menu-mobile-nav-filter"
							className={styles['c-filter-menu-mobile__back']}
							iconStart={<Icon name="arrow-left" />}
							label="Filters"
							variants={['text']}
							onClick={() => onFilterClick(activeFilter)}
						/>
					</Navigation>

					<div className="l-container">
						<h4 className="u-text-center u-mt-24">Filter title</h4>
					</div>
				</>
			)}
		</div>
	);
};

export default FilterMenuMobile;
