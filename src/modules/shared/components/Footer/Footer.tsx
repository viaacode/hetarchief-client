import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import logoMeemoo from '../../../../../public/images/logo_meemoo.svg';

import { footerType } from './Footer.constants';
import styles from './Footer.module.scss';

interface IFooterProps {
	type: footerType;
	onClickFeedback?: () => void;
}

const Footer: FC<IFooterProps> = ({ type, onClickFeedback }) => {
	const renderLinks = () => {
		return (
			<div className={styles['c-footer__links']}>
				<Link href="/">
					<a className={styles['c-footer__link']}>Gebruiksvoorwaarden</a>
				</Link>
				<Link href="/">
					<a className={styles['c-footer__link']}>Privacy</a>
				</Link>
				<Link href="/">
					<a className={styles['c-footer__link']}>Cookiebeleid</a>
				</Link>
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
				${type === footerType.simple ? styles['c-footer__bar--simple'] : ''}
				`}
			>
				<div className={styles['c-footer__left']}>
					<p>Een initiatief van</p>
					<Image src={'/' + logoMeemoo} alt="meemoo logo" width="104" height="44" />
				</div>
				{type !== footerType.simple && renderLinks()}
				<div className={styles['c-footer__right']}>
					<p>Gesteund door</p>
					<Image src={'/' + logoMeemoo} alt="meemoo logo" width="89" height="39" />
				</div>
			</footer>
		</div>
	);
};

export default Footer;
