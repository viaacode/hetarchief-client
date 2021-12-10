import Image from 'next/image';
import { FC } from 'react';

import styles from './ReadingRoomCard.module.scss';
import { IReadingRoomProps } from './ReadingRoomCard.types';

const ReadingRoomCard: FC<IReadingRoomProps> = ({
	type,
	backgroundColor,
	backgroundImage,
	logo,
	title,
	description,
}) => {
	return (
		<article className={styles['c-reading-room-card']}>
			{!backgroundImage && (
				<div
					className={styles['c-reading-room-card__background--color']}
					style={{ backgroundColor: backgroundColor ? backgroundColor : '#009690' }}
				/>
			)}
			{backgroundImage && (
				<div className={styles['c-reading-room-card__background--image']}>
					<img src={`/images/${backgroundImage}`} alt="" layout="fill" />
				</div>
			)}
			<img className={styles['c-reading-room-card__logo']} src={`/images/${logo}`} alt="" />
			<b className={styles['c-reading-room-card__title']}>{title}</b>
			<p className={styles['c-reading-room-card__description']}>{description}</p>
		</article>
	);
};

export default ReadingRoomCard;
