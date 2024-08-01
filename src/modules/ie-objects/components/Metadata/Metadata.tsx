import clsx from 'clsx';
import { type FC } from 'react';

import styles from './Metadata.module.scss';
import { type MetadataProps } from './Metadata.types';

const Metadata: FC<MetadataProps> = ({ className, title, children, renderRight }) => {
	return (
		<div className={clsx(styles['c-metadata__item'], className, 'u-flex')} role="listitem">
			<div className="u-flex-grow">
				<dt className={styles['c-metadata__item-title']}>{title}</dt>
				<dd className={styles['c-metadata__item-text']}>{children}</dd>
			</div>
			{renderRight && <div className={styles['c-metadata__item-right']}>{renderRight}</div>}
		</div>
	);
};

export default Metadata;
