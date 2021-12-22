import clsx from 'clsx';
import { FC, ReactNode } from 'react';

import styles from './Card.module.scss';

type Renderable = ReactNode;

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
					<div className={clsx(styles['c-card__image-wrapper'])}>
						{typeof image === 'string' ? (
							<img className='u-image-responsive' src={image} alt={title?.toString() || "The card's image"} /> //eslint-disable-line
						) : (
							image
						)}
					</div>
				)}
			</section>

			<section className={clsx(styles['c-card__bottom-wrapper'])}>
				<div className={clsx(styles['c-card__header-wrapper'])}>
					{title && <div className={clsx(styles['c-card__title-wrapper'])}>{title}</div>}

					{toolbar && (
						<div className={clsx(styles['c-card__toolbar-wrapper'])}>{toolbar}</div>
					)}
				</div>

				{subtitle && (
					<div className={clsx(styles['c-card__subtitle-wrapper'])}>{subtitle}</div>
				)}

				{children && (
					<div className={clsx(styles['c-card__children-wrapper'])}>{children}</div>
				)}
			</section>
		</article>
	);
};

Card.defaultProps = defaultProps;

export default Card;
