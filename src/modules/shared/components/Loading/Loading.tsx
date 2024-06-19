import clsx from 'clsx';
import { type FC, type ReactNode } from 'react';

import useTranslation from '@shared/hooks/use-translation/use-translation';
import { type DefaultComponentProps } from '@shared/types';

import styles from './Loading.module.scss';

export interface LoadingProps extends DefaultComponentProps {
	children?: ReactNode;
	fullscreen?: boolean;
	owner: string; // Used to identify which loader is shown
}

const Loading: FC<LoadingProps> = ({ fullscreen = false, className, style = {} }) => {
	const { tHtml } = useTranslation();

	return (
		<div
			className={clsx(
				className,
				'c-loading',
				fullscreen ? styles['c-loading--fullscreen'] : {}
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
