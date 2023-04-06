import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC } from 'react';

import useTranslation from '@shared/hooks/use-translation/use-translation';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { Breakpoints } from '@shared/types';

import styles from './Metadata.module.scss';
import { MetadataItem, MetadataProps } from './Metadata.types';

const Metadata: FC<MetadataProps> = ({
	className,
	metadata,
	disableContainerQuery = false,
	onOpenRequestAccess,
}) => {
	const { tText } = useTranslation();
	const windowSize = useWindowSizeContext();
	const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.md);

	return (
		<div
			className={clsx(className, styles['c-metadata'], {
				[styles['c-metadata--container-query']]: !disableContainerQuery,
			})}
		>
			<dl className={styles['c-metadata__list']} role="list">
				{metadata.map((item: MetadataItem, index: number) => {
					const showVisitButton = index === 0 && isMobile && onOpenRequestAccess;
					return (
						<div
							key={`metadata-${index}-${item.title}`}
							className={clsx(styles['c-metadata__item'], item.className)}
							role="listitem"
						>
							<dt className={styles['c-metadata__item-title']}>{item.title}</dt>
							<dd className={styles['c-metadata__item-text']}>{item.data}</dd>
							{showVisitButton && (
								<Button
									label={tText(
										'modules/ie-objects/components/metadata/metadata___plan-een-bezoek'
									)}
									variants={['dark']}
									className={styles['c-metadata__visit-button']}
									onClick={() => onOpenRequestAccess()}
								/>
							)}
						</div>
					);
				})}
			</dl>
		</div>
	);
};

export default Metadata;
