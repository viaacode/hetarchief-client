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
					<div className="u-flex-grow">{renderDtAndDd()}</div>
					<div className={styles['c-metadata__item-right']}>{renderRight}</div>
				</>
			);
		}

		return renderDtAndDd();
	};

	if (!children) {
		return null;
	}
	return (
		<div
			className={clsx(
				styles['c-metadata__item'],
				className,
				'u-flex',
				renderRight ? 'u-flex-row' : 'u-flex-col'
			)}
		>
			{renderItem()}
		</div>
	);
};

export default Metadata;
