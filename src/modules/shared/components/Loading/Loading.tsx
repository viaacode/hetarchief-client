import clsx from 'clsx';
import { FC } from 'react';

import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultComponentProps } from '@shared/types';

import styles from './Loading.module.scss';

export interface LoadingProps extends DefaultComponentProps {
	fullscreen?: boolean;
	owner: string; // Used to identify which loader is shown
}

const Loading: FC<LoadingProps> = ({ fullscreen = false, owner, className, style = {} }) => {
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
			<div dangerouslySetInnerHTML={{ __html: `<!-- ${owner} -->` }} />
			<span>{tHtml('modules/shared/components/loading/loading___laden')}</span>
		</div>
	);
};

export default Loading;
