import clsx from 'clsx';
import { type FC } from 'react';

import { type DefaultComponentProps } from '@shared/types';

import styles from './SidebarLayoutTitle.module.scss';

const Sidebar: FC<DefaultComponentProps> = ({ className, children }) => {
	return <h1 className={clsx(className, styles['c-sidebar-layout-title'])}>{children}</h1>;
};

export default Sidebar;
