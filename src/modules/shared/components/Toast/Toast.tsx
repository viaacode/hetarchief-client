import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC } from 'react';
import TruncateMarkup from 'react-truncate-markup';

import styles from './Toast.module.scss';
import { ToastProps } from './Toast.types';

const Toast: FC<ToastProps> = ({ className, title, description, buttonLabel, maxLines = 1 }) => {
	return (
		<div className={clsx(className, styles['c-toast'])}>
			<TruncateMarkup lines={maxLines}>
				<p className={styles['c-toast__title']}>{title}</p>
			</TruncateMarkup>
			<TruncateMarkup lines={maxLines}>
				<p className={styles['c-toast__description']}>{description}</p>
			</TruncateMarkup>
			<Button className={styles['c-toast__button']} label={buttonLabel} variants="white" />
		</div>
	);
};

export default Toast;
