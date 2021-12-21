import Image from 'next/image';
import { FC } from 'react';

import { Card } from '..';

import styles from './ReadingRoomCard.module.scss';
import { ReadingRoomProps } from './ReadingRoomCard.types';

const ReadingRoomCard: FC<ReadingRoomProps> = ({
	backgroundColor,
	backgroundImage,
	logo,
	title,
	description,
}) => {
	const renderDescription = () => <p>{description}</p>;
	const renderImage = () => {
		return (
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
		);
	};

	return (
		<Card image={renderImage()} edge="none" padding="vertical" title={title}>
			{renderDescription()}
		</Card>
	);
};

export default ReadingRoomCard;
