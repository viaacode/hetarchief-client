import { Button, Pagination } from '@meemoo/react-components';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml } from '@shared/helpers/translate';
import { scrollTo } from '@shared/utils/scroll-to-top';

import { PaginationProgress } from '../PaginationProgress';

import { TABLE_PAGE_SIZE } from './PaginationBar.const';
import styles from './PaginationBar.module.scss';
import { type PaginationBarProps } from './PaginationBar.types';

const PaginationBar: FC<PaginationBarProps> = ({
	className,
	count,
	onPageChange,
	showBackToTop,
	start,
	total,
}) => {
	const pageCount = Math.ceil(total / count);
	const currentPage = start / count;

	const renderProgress = () => {
		const end = start + count;

		return <PaginationProgress {...{ start: start + 1, end, total }} />;
	};

	const renderPagination = () => (
		<Pagination
			buttons={{
				next: (
					<Button
						className="u-pl-24:sm u-pl-8"
						disabled={currentPage + 1 === pageCount}
						variants={['text', 'neutral']}
						label={tHtml(
							'modules/shared/components/pagination-bar/pagination-bar___volgende'
						)}
						iconEnd={<Icon name={IconNamesLight.AngleRight} />}
					/>
				),
				previous: (
					<Button
						className="u-pr-24:sm u-pr-8"
						disabled={currentPage + 1 === 1}
						variants={['text', 'neutral']}
						label={tHtml(
							'modules/shared/components/pagination-bar/pagination-bar___vorige'
						)}
						iconStart={<Icon name={IconNamesLight.AngleLeft} />}
					/>
				),
			}}
			showFirstLastNumbers
			onPageChange={onPageChange}
			currentPage={currentPage}
			pageCount={pageCount}
		/>
	);

	return (
		<div
			className={clsx(
				className,
				styles['c-pagination-bar'],
				showBackToTop && styles['c-pagination-bar--back-to-top']
			)}
		>
			{renderProgress()}

			{total > TABLE_PAGE_SIZE && renderPagination()}

			{showBackToTop && (
				<div className={styles['c-pagination-bar__back-to-top-wrapper']}>
					<Button
						className={styles['c-pagination-bar__back-to-top']}
						variants={['text', 'neutral']}
						label={tHtml(
							'modules/shared/components/pagination-bar/pagination-bar___terug-naar-boven'
						)}
						iconEnd={<Icon name={IconNamesLight.AngleUp} />}
						onClick={() => scrollTo(0)}
					/>
				</div>
			)}
		</div>
	);
};

export default PaginationBar;
