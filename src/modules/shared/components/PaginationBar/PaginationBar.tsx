import { Button, Pagination } from '@meemoo/react-components';
import clsx from 'clsx';
import React, { FC } from 'react';

import { Icon } from '../Icon';
import { PaginationProgress } from '../PaginationProgress';

import styles from './PaginationBar.module.scss';
import { PaginationBarProps } from './PaginationBar.types';

const PaginationBar: FC<PaginationBarProps> = ({
	className,
	start,
	count,
	total,
	onPageChange,
}) => {
	const renderProgress = () => {
		const end = start + count;

		return <PaginationProgress {...{ start, end, total }} />;
	};

	const renderPagination = () => (
		<Pagination
			buttons={{
				next: (
					<Button
						variants={['text', 'neutral']}
						label="Volgende"
						iconEnd={<Icon name="angle-right" />}
					/>
				),
				previous: (
					<Button
						variants={['text', 'neutral']}
						label="Vorige"
						iconStart={<Icon name="angle-left" />}
					/>
				),
			}}
			showFirstLastNumbers
			onPageChange={onPageChange}
			currentPage={start / count}
			pageCount={Math.ceil(total / count)}
		/>
	);

	return (
		<div className={clsx(className, styles['c-pagination-bar'])}>
			{renderProgress()}

			{renderPagination()}

			<Button
				// TODO: smooth scroll to top
				className={styles['c-pagination-bar__back-to-top']}
				variants={['text', 'neutral']}
				label="Terug naar boven"
				iconEnd={<Icon name="arrow-up" />}
			/>
		</div>
	);
};

export default PaginationBar;
