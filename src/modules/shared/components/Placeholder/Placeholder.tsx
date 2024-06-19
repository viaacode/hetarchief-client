import clsx from 'clsx';
import Image from 'next/image';
import { type FC } from 'react';

import { Icon, type IconTypes } from '../Icon';

import styles from './Placeholder.module.scss';
import { type PlaceholderProps } from './Placeholder.types';

const Placeholder: FC<PlaceholderProps> = ({
	className,
	description,
	icon,
	img,
	imgAlt,
	title,
}) => {
	const iconProps = icon
		? ((typeof icon === 'string' ? { name: icon, type: 'light' } : icon) as IconTypes)
		: null;

	return (
		<div className={clsx(className, styles['c-placeholder'])}>
			{iconProps && <Icon className={styles['c-placeholder__icon']} {...iconProps} />}
			{!icon && img && (
				<div className={styles['c-placeholder__img']}>
					<Image src={img} alt={imgAlt} layout="fill" objectFit="contain" />
				</div>
			)}
			<h3 className={styles['c-placeholder__title']}>{title}</h3>
			<p className={styles['c-placeholder__description']}>{description}</p>
		</div>
	);
};

export default Placeholder;
