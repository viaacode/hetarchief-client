import clsx from 'clsx';
import { FC } from 'react';

import styles from './Metadata.module.scss';
import { MetadataListProps } from './Metadata.types';

const Metadata: FC<MetadataListProps> = ({
	className,
	children,
	disableContainerQuery = false,
}) => {
	return (
		<div
			className={clsx(
				className,
				'p-object-detail__metadata-component',
				styles['c-metadata'],
				{
					[styles['c-metadata--container-query']]: !disableContainerQuery,
				}
			)}
		>
			<dl className={styles['c-metadata__list']} role="list">
				{children}
			</dl>
		</div>
	);
};

export default Metadata;
