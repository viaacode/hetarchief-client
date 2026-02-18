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
	const renderDtAndDd = () => {
		return (
			<>
				<dt className={styles['c-metadata__item-title']}>
					<span className="u-flex-grow">{title}</span>
					<span>{renderedTitleRight}</span>
				</dt>
				<dd className={styles['c-metadata__item-text']}>{children}</dd>
			</>
		);
	};

	const renderItem = () => {
		if (renderRight) {
			return (
				<>
					<dl className="u-flex-grow">{renderDtAndDd()}</dl>
					<div className={styles['c-metadata__item-right']}>{renderRight}</div>
				</>
			);
		}

		return renderDtAndDd();
	};

	if (!children) {
		return null;
	}
	const completeClassName: string = clsx(
		styles['c-metadata__item'],
		className,
		'u-flex',
		renderRight ? 'u-flex-row' : 'u-flex-col'
	);
	return <div className={completeClassName}>{renderItem()}</div>;
};

export default Metadata;
