import clsx from 'clsx';
import { type FC } from 'react';

import styles from './Metadata.module.scss';
import { type MetadataProps } from './Metadata.types';

const Metadata: FC<MetadataProps> = ({ className, title, children }) => {
	return (
		<div className={clsx(styles['c-metadata__item'], className)} role="listitem">
			<dt className={styles['c-metadata__item-title']}>{title}</dt>
			<dd className={styles['c-metadata__item-text']}>{children}</dd>
		</div>
	);
};

export default Metadata;
