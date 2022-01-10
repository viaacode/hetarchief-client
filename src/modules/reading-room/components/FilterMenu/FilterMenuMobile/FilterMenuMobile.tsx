import { FC } from 'react';

import { FilterMenuMobileProps } from './FilterMenuMobile.types';

const FilterMenuMobile: FC<FilterMenuMobileProps> = ({ isOpen }) => {
	if (!isOpen) {
		return null;
	}

	return null;
};

export default FilterMenuMobile;
