import { tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import type { DefaultComponentProps } from '@shared/types';
import { Locale } from '@shared/utils/i18n';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import styles from './Loading.module.scss';

export interface LoadingProps extends DefaultComponentProps {
	children?: ReactNode;
	fullscreen?: boolean;
	mode?: 'light' | 'dark';
	centeredHorizontally?: boolean;
	locationId: string; // Used to identify which loader is shown
}

const Loading: FC<LoadingProps> = ({
	fullscreen = false,
	centeredHorizontally = false,
	mode = 'dark',
	locationId,
	className,
	style = {},
}) => {
	const locale = useLocale();

	const renderLoadingMessage = () => {
		const loadingText = tText('modules/shared/components/loading/loading___laden');

		if (loadingText.includes('***')) {
			if (locale === Locale.en) {
				return 'Load...';
			}
			return 'Laden...';
		}
		return loadingText;
	};

	return (
		<div
			data-loaction-id={locationId}
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
			{/* Hide stars in loader, since translations could not be loaded yet */}
			{/* https://meemoo.atlassian.net/browse/ARC-3169 */}
			<span>{renderLoadingMessage()}</span>
		</div>
	);
};

export default Loading;
