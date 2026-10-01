import clsx from 'clsx';
import type { FC } from 'react';

import styles from './Metadata.module.scss';
import type { MetadataListProps } from './Metadata.types';

const MetadataList: FC<MetadataListProps> = ({
	className,
	children,
	allowTwoColumns = true,
	noDivider = false,
	grow = false,
}) => {
	return (
		<div
			className={clsx(className, 'p-object-detail__metadata-component', styles['c-metadata'], {
				[styles['c-metadata--container-query']]: allowTwoColumns,
				[styles['c-metadata--no-divider']]: noDivider,
				[styles['c-metadata--grow']]: grow,
			})}
		>
			<dl className={styles['c-metadata__list']}>{children}</dl>
		</div>
	);
};

export default MetadataList;
