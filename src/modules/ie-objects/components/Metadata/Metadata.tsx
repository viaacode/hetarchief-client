import clsx from 'clsx';
import { FC } from 'react';

import styles from './Metadata.module.scss';
import { MetadataItem, MetadataProps } from './Metadata.types';

const Metadata: FC<MetadataProps> = ({ className, metadata, disableContainerQuery = false }) => (
	<div
		className={clsx(className, styles['c-metadata'], {
			[styles['c-metadata--container-query']]: !disableContainerQuery,
		})}
	>
		<dl className={styles['c-metadata__list']} role="list">
			{metadata.map((item: MetadataItem, index: number) => (
				<div
					key={`metadata-${index}-${item.title}`}
					className={clsx(styles['c-metadata__item'], item.className)}
					role="listitem"
				>
					<dt className={styles['c-metadata__item-title']}>{item.title}</dt>
					<dd className={styles['c-metadata__item-text']}>{item.data}</dd>
				</div>
			))}
		</dl>
	</div>
);

export default Metadata;
