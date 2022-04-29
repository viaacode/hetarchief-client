import { Button, Pagination } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import React, { FC } from 'react';

import { Icon } from '../Icon';
import { PaginationProgress } from '../PaginationProgress';

import styles from './PaginationBar.module.scss';
import { PaginationBarProps } from './PaginationBar.types';

const PaginationBar: FC<PaginationBarProps> = ({
	className,
	count,
	onPageChange,
	showBackToTop,
	start,
	total,
}) => {
	const { t } = useTranslation();

	const pageCount = Math.ceil(total / count);
	const currentPage = start / count;

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

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
						label={t(
							'modules/shared/components/pagination-bar/pagination-bar___volgende'
						)}
						iconEnd={<Icon name="angle-right" />}
					/>
				),
				previous: (
					<Button
						className="u-pr-24:sm u-pr-8"
						disabled={currentPage + 1 === 1}
						variants={['text', 'neutral']}
						label={t(
							'modules/shared/components/pagination-bar/pagination-bar___vorige'
						)}
						iconStart={<Icon name="angle-left" />}
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

			{renderPagination()}

			{showBackToTop && (
				<div className={styles['c-pagination-bar__back-to-top-wrapper']}>
					<Button
						className={styles['c-pagination-bar__back-to-top']}
						variants={['text', 'neutral']}
						label={t(
							'modules/shared/components/pagination-bar/pagination-bar___terug-naar-boven'
						)}
						iconEnd={<Icon name="arrow-up" />}
						onClick={scrollToTop}
					/>
				</div>
			)}
		</div>
	);
};

export default PaginationBar;
