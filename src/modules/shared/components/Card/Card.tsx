import { Image } from '@viaa/avo2-components';
import clsx from 'clsx';
import { FC } from 'react';

import { getNodeText } from './../../utils/get-node-text';
import styles from './Card.module.scss';

type Renderable = string | number | JSX.Element;

export interface CardProps {
	edge?: 'zinc' | 'none';
	image?: Renderable;
	orientation?: 'horizontal' | 'vertical';
	padding?: 'both' | 'content' | 'vertical' | 'none';
	subtitle?: Renderable;
	title?: Renderable;
	toolbar?: Renderable;
}

const defaultProps: CardProps = {
	edge: 'zinc',
	orientation: 'vertical',
};

const Card: FC<CardProps> = ({
	edge,
	children,
	image,
	orientation,
	padding,
	subtitle,
	title,
	toolbar,
}) => {
	return (
		<article
			className={clsx(
				styles['c-card'],
				styles[`c-card--edge-${edge}`],
				styles[`c-card--orientation-${orientation}`],
				styles[`c-card--padded-${padding}`]
			)}
		>
			<section className={clsx(styles['c-card__top-wrapper'])}>
				{image && (
					<section className={clsx(styles['c-card__image-wrapper'])}>
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
			</section>

			<section className={clsx(styles['c-card__bottom-wrapper'])}>
				<section className={clsx(styles['c-card__header-wrapper'])}>
					{title && <div className={clsx(styles['c-card__title-wrapper'])}>{title}</div>}

					{toolbar && (
						<div className={clsx(styles['c-card__toolbar-wrapper'])}>{toolbar}</div>
					)}
				</section>

				{subtitle && (
					<section className={clsx(styles['c-card__subtitle-wrapper'])}>
						{subtitle}
					</section>
				)}

				{children && (
					<section className={clsx(styles['c-card__children-wrapper'])}>
						{children}
					</section>
				)}
			</section>
		</article>
	);
};

Card.defaultProps = defaultProps;

export default Card;
