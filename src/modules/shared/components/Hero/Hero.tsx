import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import { ReadingRoomCard, ReadingRoomCardType } from '..';
import { AccessGranted } from '../ReadingRoomCard/__mocks__/reading-room-card';

import styles from './Hero.module.scss';
import { HeroProps } from './Hero.types';

const Hero: FC<HeroProps> = ({ title, description, link, image, requests = [], user }) => {
	const { t } = useTranslation();

	const isLoggedIn = !!user;
	const rootCls = clsx(styles['c-hero'], { [styles['c-hero--logged-in']]: isLoggedIn });

	const renderNotLoggedIn = () => {
		return (
			<>
				<div className={styles['c-hero__image']}>
					<Image src={image.src} layout="fill" alt={image.alt} objectFit="contain" />
				</div>
				<div className={styles['c-hero__content']}>
					<h1 className={styles['c-hero__title']}>{title}</h1>
					<p className={styles['c-hero__description']}>{description}</p>
					<b>
						<Link href={link.to}>
							<a
								className={styles['c-hero__link']}
								target={link.external ? '_blank' : '_self'}
							>
								{link.label}
							</a>
						</Link>
					</b>
				</div>
			</>
		);
	};

	const renderLoggedIn = () => {
		const accessGranted = requests.filter((request) => request.status === 'access');
		const planned = requests.filter((request) => request.status === 'planned');
		const requested = requests.filter((request) => request.status === 'requested');

		return (
			<div className="l-container">
				<section className="u-flex u-flex-col u-flex-row:md u-justify-between:md u-align-center:md u-mb-48 u-mb-64:md">
					<h1 className={styles['c-hero__title']}>
						{t('modules/shared/components/hero/hero___dag-user', {
							user: user?.firstName,
						})}
					</h1>
					<p className={styles['c-hero__description']}>
						{t(
							'Plan een nieuw bezoek, stap fysiek binnen en krijg meteen toegang tot het digitale archief van de leeszaal.'
						)}
					</p>
				</section>
				{accessGranted.length > 0 && (
					<section
						className={clsx(
							styles['c-hero__section'],
							styles['c-hero__section--access']
						)}
					>
						<div className={styles['c-hero__access-cards']}>
							{accessGranted.map((room, i) => (
								<ReadingRoomCard
									key={`hero-access-${i}`}
									access={AccessGranted}
									room={room}
									type={ReadingRoomCardType['access']}
								/>
							))}
						</div>
					</section>
				)}
				{planned.length > 0 && (
					<section className={clsx(styles['c-hero__section'])}>
						<h5 className={clsx(styles['c-hero__section-title'], 'u-mb-16')}>
							{t('modules/shared/components/hero/hero___geplande-bezoeken')}
						</h5>
						<div className={styles['c-hero__requests']}>
							{planned.map((room, i) => (
								<ReadingRoomCard
									key={`hero-planned-${i}`}
									access={AccessGranted}
									room={room}
									type={ReadingRoomCardType['future--approved']}
								/>
							))}
						</div>
					</section>
				)}
				{requested.length > 0 && (
					<section className={clsx(styles['c-hero__section'])}>
						<h5 className={clsx(styles['c-hero__section-title'], 'u-mb-16')}>
							{t('modules/shared/components/hero/hero___aanvragen')}
						</h5>
						<div className={styles['c-hero__requests']}>
							{requested.map((room, i) => (
								<ReadingRoomCard
									key={`hero-requested-${i}`}
									access={AccessGranted}
									room={room}
									type={ReadingRoomCardType['future--requested']}
								/>
							))}
						</div>
					</section>
				)}
			</div>
		);
	};

	return (
		<header className={rootCls}>{isLoggedIn ? renderLoggedIn() : renderNotLoggedIn()}</header>
	);
};

export default Hero;
