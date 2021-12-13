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
			<div className={styles['c-reading-room-card__background']}>
				{!backgroundImage && (
					<div
						className={styles['c-reading-room-card__background--color']}
						style={{ backgroundColor: backgroundColor ? backgroundColor : '#009690' }}
					/>
				)}
				{backgroundImage && (
					<div className={styles['c-reading-room-card__background--image']}>
						<Image
							src={`/images/${backgroundImage}`}
							alt=""
							layout="fill"
							objectFit="cover"
						/>
					</div>
				)}
				<div className={styles['c-reading-room-card__logo']}>
					<Image
						className={styles['c-reading-room-card__logo-image']}
						src={`/images/${logo}`}
						alt=""
						layout="fill"
						objectFit="contain"
					/>
				</div>
			</div>
			<b className={styles['c-reading-room-card__title']}>{title}</b>
			<p className={styles['c-reading-room-card__description']}>{description}</p>
		</article>
	);
};

export default ReadingRoomCard;
