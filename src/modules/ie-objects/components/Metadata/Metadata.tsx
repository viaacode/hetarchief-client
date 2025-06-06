import clsx from 'clsx';
import type { FC } from 'react';

import styles from './Metadata.module.scss';
import type { MetadataProps } from './Metadata.types';

const Metadata: FC<MetadataProps> = ({
	className,
	title,
	children,
	renderRight,
	renderedTitleRight,
}) => {
	if (!children) {
		return null;
	}
	return (
		// biome-ignore lint/a11y/useSemanticElements: role is used to fetch these items in the tests
		<div className={clsx(styles['c-metadata__item'], className, 'u-flex')} role="listitem">
			<div className="u-flex-grow">
				<dt className={styles['c-metadata__item-title']}>
					<span className="u-flex-grow">{title}</span>
					<span>{renderedTitleRight}</span>
				</dt>
				<dd className={styles['c-metadata__item-text']}>{children}</dd>
			</div>
			{renderRight && <div className={styles['c-metadata__item-right']}>{renderRight}</div>}
		</div>
	);
};

export default Metadata;
