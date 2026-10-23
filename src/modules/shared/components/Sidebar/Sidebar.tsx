import clsx from 'clsx';
import type { FC } from 'react';

import styles from './Sidebar.module.scss';
import type { SidebarProps } from './Sidebar.types';

const Sidebar: FC<SidebarProps> = ({
	className,
	children,
	title,
	heading,
	titleActions,
	subtitle,
	color = 'white',
}) => {
	const renderHeading = () => {
		if (heading) {
			return heading;
		}
		if (!titleActions && !subtitle) {
			return <h2 className={styles['c-sidebar__title']}>{title}</h2>;
		}
		return (
			<div className={styles['c-sidebar__header']}>
				<div className={styles['c-sidebar__header-row']}>
					<h2 className={clsx(styles['c-sidebar__title'], styles['c-sidebar__title--in-header'])}>
						{title}
					</h2>
					{titleActions}
				</div>
				{subtitle && <div className={styles['c-sidebar__subtitle']}>{subtitle}</div>}
			</div>
		);
	};

	return (
		<section className={clsx(className, styles['c-sidebar'], styles[`c-sidebar--${color}`])}>
			{renderHeading()}
			{children}
		</section>
	);
};

export default Sidebar;
