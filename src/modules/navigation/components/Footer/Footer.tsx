import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';

import { tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import type { ComponentLink } from '@shared/types';

import styles from './Footer.module.scss';
import type { FooterProps } from './Footer.types';

const Footer: FC<FooterProps> = ({ linkSections }) => {
	const locale = useLocale();

	const renderLinks = (links: ComponentLink[], key: string) => {
		return (
			<div className={styles['c-footer__links__section']} key={key}>
				{links.map((link, index) => {
					return (
						<Link
							key={`${link.to}-${index}`}
							href={link.to}
							className={styles['c-footer__link']}
							target={link.external ? '_blank' : '_self'}
						>
							{link.label}
						</Link>
					);
				})}
			</div>
		);
	};

	const renderFooterLeft = () => {
		return (
			<div className={styles['c-footer__links__left']}>
				<Link
					href="/"
					className={clsx(styles['c-footer__image-link'])}
					aria-label={'Link naar hetarchief.be'}
				>
					<Image
						unoptimized
						src={`/images/logo_hetarchief_${locale}.svg`}
						alt={tText('modules/navigation/components/footer/footer___hetarchief-logo')}
						width={178}
						height={65}
						style={{
							maxWidth: '100%',
							height: 'auto',
							objectFit: 'contain',
							objectPosition: 'center',
						}}
					/>
				</Link>
			</div>
		);
	};

	const renderFooterRight = () => {
		return (
			<div className={styles['c-footer__links__right']}>
				<div>{tText('modules/navigation/components/footer/footer___gesteund-door')}</div>
				<Link
					href="https://www.vlaanderen.be"
					className={styles['c-footer__image-link']}
					target="_blank"
					aria-label={tText(
						'modules/navigation/components/footer/footer___link-naar-vlaanderen-be'
					)}
				>
					<Image
						unoptimized
						src={`/images/logo_vlaanderen_${locale}.svg`}
						alt={tText('modules/navigation/components/footer/footer___vlaanderen-logo')}
						width={89}
						height={44}
						style={{
							maxWidth: '100%',
							height: 'auto',
							objectFit: 'contain',
							objectPosition: 'center',
						}}
					/>
				</Link>

				<div>{tText('modules/navigation/components/footer/footer___een-initiatief-van')}</div>
				<Link
					href={`https://meemoo.be/${locale}/hetarchiefbe`}
					className={styles['c-footer__image-link']}
					target="_blank"
					aria-label={tText('modules/navigation/components/footer/footer___link-naar-meemoo-be')}
				>
					<Image
						unoptimized
						src={`/images/logo_meemoo_${locale}.svg`}
						alt={tText('modules/navigation/components/footer/footer___meemoo-logo')}
						width={104}
						height={44}
						style={{
							maxWidth: '100%',
							height: 'auto',
							objectFit: 'contain',
							objectPosition: 'center',
						}}
					/>
				</Link>
			</div>
		);
	};

	const sectionTitle1 =
		tText('modules/navigation/components/footer/footer___footer-sectie-titel-1') || null;
	const sectionTitle2 =
		tText('modules/navigation/components/footer/footer___footer-sectie-titel-2') || null;
	return (
		<footer className={styles['c-footer']}>
			<div className={styles['c-footer__wrapper']}>
				{renderFooterLeft()}
				<div className={styles['c-footer__links__section1']}>
					{sectionTitle1 && (
						<div className={styles['c-footer__links__section-title']}>{sectionTitle1}</div>
					)}
					{renderLinks(linkSections?.[0] || [], 'footer-section-1')}
				</div>
				<div className={styles['c-footer__links__section2']}>
					{sectionTitle2 && (
						<div className={styles['c-footer__links__section-title']}>{sectionTitle2}</div>
					)}
					{renderLinks(linkSections?.[1] || [], 'footer-section-2')}
				</div>
				<div className={styles['c-footer__links__section3']}>
					{renderLinks(linkSections?.[2] || [], 'footer-section-3')}
				</div>
				{renderFooterRight()}
			</div>
		</footer>
	);
};

export default Footer;
