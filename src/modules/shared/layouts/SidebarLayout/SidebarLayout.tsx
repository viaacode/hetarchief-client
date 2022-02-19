import clsx from 'clsx';
import { FC } from 'react';

import { ListNavigation, Sidebar } from '@shared/components';

import styles from './SidebarLayout.module.scss';
import { SidebarLayoutProps } from './SidebarLayout.types';

const SidebarLayout: FC<SidebarLayoutProps> = ({
	children,
	className,
	contentTitle,
	sidebarLinks,
	sidebarTitle,
}) => {
	return (
		<div className={clsx(styles['l-sidebar'], 'u-bg-platinum', className)}>
			<div className={clsx(styles['l-sidebar__navigation'], 'u-bg-white')}>
				<Sidebar className={styles['l-sidebar__sidebar']} title={sidebarTitle}>
					<ListNavigation listItems={sidebarLinks} />
				</Sidebar>
			</div>

			<div className={styles['l-sidebar__main']}>
				<div
					className={clsx(styles['l-sidebar__content'], 'l-container u-mt-32 u-mt-64:md')}
				>
					{contentTitle && (
						<h1 className={clsx(styles['l-sidebar__title'], 'u-mb-24 u-mb-48:md')}>
							{contentTitle}
						</h1>
					)}
				</div>

				{children}
			</div>
		</div>
	);
};

export default SidebarLayout;
