import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { DefaultComponentProps } from '@shared/types';

import styles from './Loading.module.scss';

export interface LoadingProps extends DefaultComponentProps {
	fullscreen?: boolean;
}

const Loading: FC<LoadingProps> = ({ fullscreen = false, className, style = {} }) => {
	const { t } = useTranslation();

	return (
		<div
			className={clsx(
				className,
				'c-loading',
				fullscreen ? styles['c-loading--fullscreen'] : {}
			)}
			style={style}
		>
			<span>{t('modules/shared/components/loading/loading___laden')}</span>
		</div>
	);
};

export default Loading;
