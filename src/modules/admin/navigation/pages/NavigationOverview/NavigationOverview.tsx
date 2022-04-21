import { Table } from '@meemoo/react-components';
import React, { FC, useCallback, useEffect, useState } from 'react';

import { NavigationInfo, navigationService } from '@navigation/services/navigation-service';
import { sortingIcons } from '@shared/components';

import { NAVIGATION_CONFIG } from '../../const';

import { NAVIGATION_OVERVIEW_COLS } from './NavigationOverview.const';

const NavigationOverview: FC = () => {
	const [navigations, setNavigations] = useState<NavigationInfo[]>([]);

	const fetchNavigations = useCallback(async () => {
		const response = await navigationService.getAll();

		const navigationItems: NavigationInfo[] = Object.values(response).flat();

		if (!navigationItems?.length) {
			// TODO: Set error view
		}
		setNavigations(navigationItems ?? []);
	}, []);

	useEffect(() => {
		fetchNavigations();
	}, [fetchNavigations]);

	return (
		<div>
			<h2 className="u-mb-40">Navigatie</h2>
			<Table
				sortingIcons={sortingIcons}
				options={
					{
						data: navigations,
						columns: NAVIGATION_OVERVIEW_COLS(
							NAVIGATION_CONFIG.views.overview.labels.tableHeads
						),
						disableSortBy: true,
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
					} as any
				} // TODO: fix table types
			/>
		</div>
	);
};

export default NavigationOverview;
