import clsx from 'clsx';
import { type FC } from 'react';

import styles from './Callout.module.scss';
import { type CalloutProps } from './Callout.types';

const Callout: FC<CalloutProps> = ({ className, icon, text, action }) => {
	const rootCls = clsx(className, styles['c-callout']);

	return (
		<div className={rootCls}>
			{icon && <div className={styles['c-callout__icon']}>{icon}</div>}
			<div>
				<span>{text}</span>
				{action || null}
			</div>
		</div>
	);
};

export default Callout;
