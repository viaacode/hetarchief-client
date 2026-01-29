import type { PaginationBarProps } from '@meemoo/react-components';

import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';

import Icon from '../Icon/Icon';

export const getDefaultPaginationBarProps = (): Pick<
	PaginationBarProps,
	| 'nextLabel'
	| 'nextIcon'
	| 'previousLabel'
	| 'previousIcon'
	| 'firstLabel'
	| 'firstIcon'
	| 'lastLabel'
	| 'lastIcon'
	| 'backToTopLabel'
	| 'backToTopIcon'
	| 'labelBetweenPageStartAndEnd'
	| 'labelBetweenPageEndAndTotal'
	| 'className'
> => ({
	nextLabel: tText('modules/shared/components/pagination-bar/pagination-bar___volgende'),
	nextIcon: <Icon name={IconNamesLight.AngleRight} />,
	previousLabel: tText('modules/shared/components/pagination-bar/pagination-bar___vorige'),
	previousIcon: <Icon name={IconNamesLight.AngleLeft} />,
	firstLabel: tText('modules/shared/components/pagination-bar/pagination-bar___eerste'),
	firstIcon: <Icon name={IconNamesLight.ChevronsLeft} />,
	lastLabel: tText('modules/shared/components/pagination-bar/pagination-bar___laatste'),
	lastIcon: <Icon name={IconNamesLight.ChevronsRight} />,
	backToTopLabel: tText(
		'modules/shared/components/pagination-bar/pagination-bar___terug-naar-boven'
	),
	backToTopIcon: <Icon name={IconNamesLight.ArrowUp} />,
	labelBetweenPageStartAndEnd: tText(
		'modules/shared/components/filter-table/filter-table___label-between-start-and-end-page-in-pagination-bar'
	),
	labelBetweenPageEndAndTotal: tText(
		'modules/shared/components/filter-table/filter-table___label-between-end-page-and-total-in-pagination-bar'
	),
	className: 'u-mt-16 u-mb-16',
});
