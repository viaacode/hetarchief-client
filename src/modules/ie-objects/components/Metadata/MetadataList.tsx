import clsx from 'clsx';
import type { FC } from 'react';

import styles from './Metadata.module.scss';
import type { MetadataListProps } from './Metadata.types';

const Metadata: FC<MetadataListProps> = ({
	className,
	listClassName,
	children,
	allowTwoColumns = true,
}) => {
	return (
		<div
			className={clsx(className, 'p-object-detail__metadata-component', styles['c-metadata'], {
				[styles['c-metadata--container-query']]: allowTwoColumns,
			})}
		>
			<dl className={clsx(styles['c-metadata__list'], listClassName)}>{children}</dl>
		</div>
	);
};

export default Metadata;
