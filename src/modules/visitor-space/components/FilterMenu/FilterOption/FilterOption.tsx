import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, type ReactElement, useCallback, useEffect, useState } from 'react';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Overlay } from '@shared/components/Overlay';
import { tText } from '@shared/helpers/translate';
import { NoServerSideRendering } from '@visitor-space/components/NoServerSideRendering/NoServerSideRendering';
import { SearchFilterId } from '@visitor-space/types';

import { FilterButton } from '../FilterButton';
import FilterForm from '../FilterForm/FilterForm';
import styles from '../FilterMenu.module.scss';
import { FilterMenuType } from '../FilterMenu.types';

import { type FilterOptionProps } from './FilterOption.types';

const FilterOption: FC<FilterOptionProps> = ({
	activeFilter,
	form,
	icon,
	id,
	label,
	type,
	onClick,
	onFormReset,
	onFormSubmit,
	values,
	className,
}) => {
	const filterIsActive = id === activeFilter;

	const onFilterToggle = useCallback(() => onClick?.(id), [id, onClick]);
	const [openedAt, setOpenedAt] = useState<number | undefined>(undefined);

	// re-render form to ensure correct state
	// e.g. open -> reset -> close -> open === values in url, in form
	useEffect(() => {
		setOpenedAt(new Date().valueOf());
	}, [filterIsActive]);

	const renderFilterOptionByType = (): ReactElement => {
		switch (type) {
			case FilterMenuType.Modal:
				return renderModal();
			case FilterMenuType.Checkbox:
				return renderCheckbox();
			default:
				return <></>;
		}
	};

	const renderFilterForm = (cs: string, isInline?: boolean): ReactElement => (
		<FilterForm
			className={clsx(styles['c-filter-menu__option'], cs, {
				[`${className}`]: isInline,
			})}
			form={form}
			id={id}
			key={openedAt}
			onFormReset={onFormReset}
			onFormSubmit={onFormSubmit}
			title={label}
			values={values}
			disabled={!filterIsActive}
			type={type}
		/>
	);

	const renderCheckbox = (): ReactElement =>
		renderFilterForm('c-filter-menu__form--inline', true);

	const FILTER_MENU_HEIGHTS: Partial<Record<SearchFilterId, string>> = {
		[SearchFilterId.Medium]: '63.7rem',
		[SearchFilterId.Duration]: '48.1rem',
		[SearchFilterId.Created]: '61.3rem',
		[SearchFilterId.Published]: '61.3rem',
		[SearchFilterId.Creator]: '33.5rem',
		[SearchFilterId.Language]: '53.7rem',
		[SearchFilterId.Maintainers]: '63.7rem',
		[SearchFilterId.Advanced]: '60.1rem',
	};
	const renderModal = (): ReactElement => {
		return (
			<>
				<div
					className={clsx(styles['c-filter-menu__option'], className)}
					key={`filter-menu-btn-${id}`}
					style={{
						position: 'relative',
					}}
				>
					<FilterButton
						icon={
							filterIsActive
								? IconNamesLight.AngleLeft
								: icon ?? IconNamesLight.AngleRight
						}
						isActive={filterIsActive}
						label={label}
						onClick={() => onClick?.(id)}
					/>

					<NoServerSideRendering>
						<div
							style={{
								position: 'absolute',
								left: '100%',
								width: '46.4rem',
								top: `calc(-${FILTER_MENU_HEIGHTS[id]} / 2 + 2rem)`,
								backgroundColor: 'white',
								zIndex: 5,
								display: filterIsActive ? 'block' : 'none',
							}}
						>
							<Button
								className={styles['c-filter-menu__flyout-close']}
								icon={<Icon name={IconNamesLight.Times} aria-hidden />}
								aria-label={tText(
									'modules/visitor-space/components/filter-menu/filter-option/filter-option___sluiten'
								)}
								onClick={onFilterToggle}
								variants="text"
							/>
							{renderFilterForm('c-filter-menu__form')}
						</div>
					</NoServerSideRendering>
				</div>
				<Overlay
					className={styles['c-filter-menu__overlay']}
					visible={filterIsActive}
					onClick={onFilterToggle}
				/>
			</>
		);
	};

	return renderFilterOptionByType();
};

export default FilterOption;
