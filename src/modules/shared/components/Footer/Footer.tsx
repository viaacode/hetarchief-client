import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import { footerType } from './Footer.constants';
import styles from './Footer.module.scss';
import { IFooterItem, IFooterProps } from './Footer.types';

const Footer: FC<IFooterProps> = ({ type, links, leftItem, rightItem, onClickFeedback }) => {
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

	const renderFooterItem = (item: IFooterItem, side: string) => {
		return (
			<div className={styles[`c-footer__${side}`]}>
				<p data-testid="vlaanderen-text">{item.label}</p>
				<Link href={item.link.to}>
					<a target={item.link.external ? '_blank' : '_self'}>
						{/* Image will not display in Storybook. Open issue: https://github.com/vercel/next.js/issues/18393*/}
						{/* Images work fine in the next.js app */}
						<Image
							src={`/images/${item.image.name}`}
							alt={item.image.alt}
							width={item.image.width}
							height={item.image.height}
						/>
					</a>
				</Link>
			</div>
		);
	};

	return (
		<div className={styles['c-footer']}>
			{type === footerType.feedback && renderFeedbackButton()}
			<footer
				className={`${styles['c-footer__bar']}
				${type === footerType.simple ? styles['c-footer__bar--simple'] : ''}`}
			>
				{renderFooterItem(leftItem, 'left')}
				{type !== footerType.simple && renderLinks()}
				{renderFooterItem(rightItem, 'right')}
			</footer>
		</div>
	);
};

export default Footer;
