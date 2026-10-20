import { ROUTES_BY_LOCALE } from '@shared/const';
import { tHtml } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import clsx from 'clsx';
import type { FC } from 'react';

import styles from './FolderLevelDisclaimer.module.scss';

interface FolderLevelDisclaimerProps {
	/**
	 * Which overview this disclaimer is shown on, it links to the other overview
	 */
	level: 'personal' | 'organisation';
	className?: string;
}

/**
 * Explains the difference between personal and organisation folders and links to the other overview
 */
export const FolderLevelDisclaimer: FC<FolderLevelDisclaimerProps> = ({ level, className }) => {
	const locale = useLocale();

	return (
		<div className={clsx(className, styles['c-folder-level-disclaimer'])}>
			{level === 'organisation'
				? tHtml(
						'modules/account/components/folder-level-disclaimer/folder-level-disclaimer___deze-mappen-behoren-tot-de-organisatie-en-worden-gedeeld-met-alle-beheerders-van-je-organisatie-a-href-url-klik-hier-voor-je-persoonlijke-mappen-a',
						{ url: ROUTES_BY_LOCALE[locale].accountMyFolders }
					)
				: tHtml(
						'modules/account/components/folder-level-disclaimer/folder-level-disclaimer___deze-mappen-zijn-persoonlijk-a-href-url-klik-hier-voor-de-mappen-van-je-organisatie-a',
						{ url: ROUTES_BY_LOCALE[locale].cpAdminOrganisationFolders }
					)}
		</div>
	);
};
