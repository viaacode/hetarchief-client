import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import { footerType } from './Footer.constants';
import styles from './Footer.module.scss';
import { IFooterProps } from './Footer.types';

const Footer: FC<IFooterProps> = ({ type, links, onClickFeedback }) => {
	const renderLinks = () => {
		return (
			<div className={styles['c-footer__links']}>
				{links.map((link, index) => (
					<Link key={index} href={link.to}>
						<a
							className={styles['c-footer__link']}
							target={link.external ? '_blank' : '_self'}
						>
							{link.label}
						</a>
					</Link>
				))}
			</div>
		);
	};

	const renderFeedbackButton = () => {
		return (
			<button className={styles['c-footer__feedback-button']} onClick={onClickFeedback}>
				Feedback
			</button>
		);
	};

	return (
		<div className={styles['c-footer']}>
			{type === footerType.feedback && renderFeedbackButton()}
			<footer
				className={`${styles['c-footer__bar']}
				${type === footerType.simple ? styles['c-footer__bar--simple'] : ''}`}
			>
				<div className={styles['c-footer__left']}>
					<p data-testid="meemoo-text">Een initiatief van</p>
					{/* Image will not display in Storybook. Open issue: https://github.com/vercel/next.js/issues/18393*/}
					{/* Images work fine in the next.js app */}
					<Image
						data-testid="meemoo-img"
						src={'/images/logo_meemoo.svg'}
						alt="meemoo logo"
						width="104"
						height="44"
					/>
				</div>
				{type !== footerType.simple && renderLinks()}
				<div data-testid="c-footer__right" className={styles['c-footer__right']}>
					<p data-testid="vlaanderen-text">Gesteund door</p>
					{/* See comment above */}
					<Image
						data-testid="vlaanderen-image"
						src={'/images/logo_vlaanderen.png'}
						alt="vlaanderen logo"
						width="89"
						height="39"
					/>
				</div>
			</footer>
		</div>
	);
};

export default Footer;
