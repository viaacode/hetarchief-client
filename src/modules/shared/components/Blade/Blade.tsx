import clsx from 'clsx';
import { FC } from 'react';

import styles from './Blade.module.scss';
import { BladeProps } from './Blade.types';

const Blade: FC<BladeProps> = ({ className }) => {
	return <div className={clsx(className, styles['c-blade'])}>hey</div>;
};

export default Blade;
