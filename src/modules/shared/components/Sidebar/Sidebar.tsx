import clsx from 'clsx';
import { FC } from 'react';

import styles from './Sidebar.module.scss';
import { SidebarProps } from './Sidebar.types';

const Sidebar: FC<SidebarProps> = ({ className, children, title, heading, color = 'white' }) => {
	return (
		<section className={clsx(className, styles['c-sidebar'], styles[`c-sidebar--${color}`])}>
			{heading ? heading : <h2 className={styles['c-sidebar__title']}>{title}</h2>}
			{children}
		</section>
	);
};

export default Sidebar;
