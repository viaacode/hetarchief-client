import clsx from 'clsx';
import type { FC } from 'react';

import styles from './Metadata.module.scss';
import type { MetadataListProps } from './Metadata.types';

const Metadata: FC<MetadataListProps> = ({ className, children, allowTwoColumns = true }) => {
	return (
		<div
			className={clsx(className, 'p-object-detail__metadata-component', styles['c-metadata'], {
				[styles['c-metadata--container-query']]: allowTwoColumns,
			})}
		>
			<ul className={styles['c-metadata__list']}>{children}</ul>
		</div>
	);
};

export default Metadata;
