import { Button } from '@meemoo/react-components';
import { FC } from 'react';

import { Icon, Navigation } from '@shared/components';

import styles from './FilterMenuMobile.module.scss';
import { FilterMenuMobileProps } from './FilterMenuMobile.types';

const FilterMenuMobile: FC<FilterMenuMobileProps> = ({ isOpen, onClose }) => {
	if (!isOpen) {
		return null;
	}

	return (
		<div className={styles['c-filter-menu-mobile']}>
			<Navigation>
				<Navigation.Left>
					<Button
						className={styles['c-filter-menu-mobile__back']}
						iconStart={<Icon name="arrow-left" />}
						label="Zoekresultaten"
						variants={['text']}
						onClick={onClose}
					/>
				</Navigation.Left>
			</Navigation>
		</div>
	);
};

export default FilterMenuMobile;
