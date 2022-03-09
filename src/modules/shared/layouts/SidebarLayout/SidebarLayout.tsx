import clsx from 'clsx';
import { FC } from 'react';

import { ListNavigation, Sidebar } from '@shared/components';
import { SidebarLayoutTitle } from '@shared/components/SidebarLayoutTitle';

import styles from './SidebarLayout.module.scss';
import { SidebarLayoutProps } from './SidebarLayout.types';

const SidebarLayout: FC<SidebarLayoutProps> = ({
	children,
	className,
	contentTitle,
	sidebarLinks,
	sidebarTitle,
	color = 'white',
}) => {
	return (
		<div className={clsx(styles['l-sidebar'], 'u-bg-platinum', className)}>
			<div className={clsx(styles['l-sidebar__navigation'], `u-bg-${color}`)}>
				<Sidebar
					color={color}
					className={styles['l-sidebar__sidebar']}
					title={sidebarTitle}
				>
					<ListNavigation color={color} listItems={sidebarLinks} />
				</Sidebar>
			</div>

			<div className={styles['l-sidebar__main']}>
				{contentTitle && (
					<div
						className={clsx(
							styles['l-sidebar__content'],
							'l-container u-mt-32 u-mt-64:md'
						)}
					>
						<SidebarLayoutTitle>{contentTitle}</SidebarLayoutTitle>
					</div>
				)}

				{children}
			</div>
		</div>
	);
};

export default SidebarLayout;
