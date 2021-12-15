import { Image } from '@viaa/avo2-components';
import classnames from 'classnames';
import { FC } from 'react';

import { getNodeText } from './../../utils/get-node-text';
import styles from './Card.module.scss';

export interface CardProps {
	edge?: 'zinc' | 'none';
	image?: string | JSX.Element;
	padding?: 'both' | 'content' | 'none';
	title?: string | JSX.Element;
}

const defaultProps: CardProps = {
	edge: 'zinc',
};

// TODO: change `classnames` to `clsx` after https://github.com/viaacode/hetarchief-client/pull/14
const Card: FC<CardProps> = ({ edge, image, padding, title }) => {
	return (
		<article
			className={classnames(
				styles['c-card'],
				styles[`c-card--edge-${edge}`],
				styles[`c-card--padded-${padding}`]
			)}
		>
			{image && (
				<section className={classnames(styles['c-card__image-wrapper'])}>
					{typeof image === 'string' ? (
						<Image
							wide={true}
							src={image}
							alt={(title && getNodeText(title)) || "The card's image"}
						/>
					) : (
						image
					)}
				</section>
			)}

			{title && (
				<section className={classnames(styles['c-card__title-wrapper'])}>{title}</section>
			)}
		</article>
	);
};

Card.defaultProps = defaultProps;

export default Card;
