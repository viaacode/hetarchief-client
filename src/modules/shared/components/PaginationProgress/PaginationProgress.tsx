import React, { FC } from 'react';

import styles from './PaginationProgress.module.scss';
import { PaginationProgressProps } from './PaginationProgress.types';

const PaginationProgress: FC<PaginationProgressProps> = ({ start, end, total }) => {
	const text = `${start}-${end > total ? total : end} van ${total}`;

	return <span className={styles['c-pagination-progress']}>{text}</span>;
};

export default PaginationProgress;
