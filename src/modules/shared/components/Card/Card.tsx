import classnames from 'classnames';
import { FC } from 'react';

import styles from './Card.module.scss';

export interface CardProps {
	edge: 'zinc' | 'none' | undefined;
	title?: string | JSX.Element;
}

const defaultProps: CardProps = {
	edge: 'zinc',
};

// TODO: change `classnames` to `clsx` after https://github.com/viaacode/hetarchief-client/pull/14
const Card: FC<CardProps> = ({ edge, title }) => {
	return (
		<article className={classnames(styles['c-card'], styles[`c-card--edge-${edge}`])}>
			<section className={classnames(styles['c-card__title-wrapper'])}>{title}</section>
		</article>
	);
};

Card.defaultProps = defaultProps;

export default Card;
