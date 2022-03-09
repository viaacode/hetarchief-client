import clsx from 'clsx';
import { FC } from 'react';

import { DefaultComponentProps } from '@shared/types';

import styles from './SidebarLayoutTitle.module.scss';

const Sidebar: FC<DefaultComponentProps> = ({ className, children }) => {
	return (
		<h1 className={clsx(className, styles['c-sidebar-layout-title'], 'u-mb-24 u-mb-48:md')}>
			{children}
		</h1>
	);
};

export default Sidebar;
