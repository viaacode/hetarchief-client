import clsx from 'clsx';
import { type ReactNode } from 'react';

import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';

import Icon from '../Icon/Icon';

import styles from './PaginationBar.module.scss';

export interface DefaultPaginationBarProps {
	nextLabel: string;
	nextIcon: ReactNode;
	previousLabel: string;
	previousIcon: ReactNode;
	backToTopLabel: string;
	backToTopIcon: ReactNode;
	labelBetweenPageStartAndEnd?: string;
	labelBetweenPageEndAndTotal?: string;
	className: string;
}

export const getDefaultPaginationBarProps = (): DefaultPaginationBarProps => ({
	nextLabel: tText('modules/shared/components/pagination-bar/pagination-bar___volgende'),
	nextIcon: <Icon name={IconNamesLight.AngleRight} />,
	previousLabel: tText('modules/shared/components/pagination-bar/pagination-bar___vorige'),
	previousIcon: <Icon name={IconNamesLight.AngleLeft} />,
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
	className: clsx(styles['c-pagination-bar'], 'u-mt-16 u-mb-16'),
});
