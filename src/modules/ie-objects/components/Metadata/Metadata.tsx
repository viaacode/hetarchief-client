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
	contentClassName,
}) => {
	// Boolean, not `children &&`: a falsy child like 0 must not be rendered as text
	const hasChildren = !!children;

	const renderDtAndDd = () => {
		return (
			<>
				{(title || renderedTitleRight) && (
					<dt className={styles['c-metadata__item-title']}>
						<span className="u-flex-grow">{title}</span>
						<span>{renderedTitleRight}</span>
					</dt>
				)}
				{hasChildren && (
					<dd className={clsx(styles['c-metadata__item-text'], contentClassName)}>{children}</dd>
				)}
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

	if (!hasChildren && !title) {
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
