import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

import { tHtml } from '@shared/helpers/translate';
import type { DefaultComponentProps } from '@shared/types';

import styles from './Loading.module.scss';

export interface LoadingProps extends DefaultComponentProps {
	children?: ReactNode;
	fullscreen?: boolean;
	mode?: 'light' | 'dark';
	centeredHorizontally?: boolean;
	owner: string; // Used to identify which loader is shown
}

const Loading: FC<LoadingProps> = ({
	fullscreen = false,
	centeredHorizontally = false,
	mode = 'dark',
	className,
	style = {},
}) => {
	return (
		<div
			className={clsx(
				className,
				'c-loading',
				fullscreen ? styles['c-loading--fullscreen'] : {},
				centeredHorizontally ? styles['c-loading--centered-horizontally'] : {},
				mode === 'light' ? styles['c-loading--light'] : {}
			)}
			style={style}
		>
			{/* enable if you want to figure out which loader is misbehaving */}
			{/*<div dangerouslySetInnerHTML={{ __html: `<!-- ${owner} -->` }} />*/}
			<span>{tHtml('modules/shared/components/loading/loading___laden')}</span>
		</div>
	);
};

export default Loading;
