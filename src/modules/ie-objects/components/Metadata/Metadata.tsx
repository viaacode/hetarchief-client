import clsx from 'clsx';
import type { FC } from 'react';

import styles from './Metadata.module.scss';
import type { MetadataProps } from './Metadata.types';

const Metadata: FC<MetadataProps> = ({
	className,
	title,
	children,
	renderRight,
	renderTitleRight,
}) => {
	if (!children) {
		return null;
	}
	return (
		<div className={clsx(styles['c-metadata__item'], className, 'u-flex')}>
			<div className="u-flex-grow">
				<dt className={styles['c-metadata__item-title']}>
					<span className="u-flex-grow">{title}</span>
					<span>{renderTitleRight}</span>
				</dt>
				<dd className={styles['c-metadata__item-text']}>{children}</dd>
			</div>
			{renderRight && <div className={styles['c-metadata__item-right']}>{renderRight}</div>}
		</div>
	);
};

export default Metadata;
