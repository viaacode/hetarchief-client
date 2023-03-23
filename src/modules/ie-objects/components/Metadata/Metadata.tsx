import clsx from 'clsx';
import { FC, ReactNode } from 'react';

import styles from './Metadata.module.scss';
import { MetadataItem, MetadataProps } from './Metadata.types';

const Metadata: FC<MetadataProps> = ({ className, metadata, disableContainerQuery = false }) => {
	const isString = (value: string | ReactNode) => typeof value === 'string';

	const renderMetadataItem = (item: MetadataItem, index: number) => {
		return (
			<li
				key={`metadata-${index}-${item.title}`}
				className={clsx(styles['c-metadata__item'], item.className)}
				role="listitem"
			>
				<b className={styles['c-metadata__item-title']}>{item.title}</b>
				{isString(item.data) ? (
					<p className={styles['c-metadata__item-text']}>{item.data}</p>
				) : (
					item.data
				)}
			</li>
		);
	};

	return (
		<div
			className={clsx(className, styles['c-metadata'], {
				[styles['c-metadata--container-query']]: !disableContainerQuery,
			})}
		>
			<ul className={styles['c-metadata__list']} role="list">
				{metadata.map(renderMetadataItem)}
			</ul>
		</div>
	);
};

export default Metadata;
