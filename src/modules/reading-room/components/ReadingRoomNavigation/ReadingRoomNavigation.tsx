import { Button, Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';

import { Navigation } from '@navigation/components';
import { Icon } from '@shared/components';
import { CopyButton } from '@shared/components/CopyButton';
import { selectShowNavigationBorder } from '@shared/store/ui';

import styles from './ReadingRoomNavigation.module.scss';
import { ReadingRoomNavigationProps } from './ReadingRoomNavigation.types';

const ReadingRoomNavigation: FC<ReadingRoomNavigationProps> = ({ title, className }) => {
	const { t } = useTranslation();
	const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);
	const showBorder = useSelector(selectShowNavigationBorder);

	// TODO: replace with model
	const { phone, email } = {
		phone: '+32 487 02 80 55',
		email: 'info@studiohyperdrive.be',
	};

	return (
		<Navigation contextual className={className} showBorder={showBorder}>
			<Navigation.Left placement="left">
				<Link href="/" passHref={true}>
					<a>
						<Button
							icon={<Icon name="arrow-left" />}
							variants="text"
							className="u-color-white u-ml--12"
						/>
					</a>
				</Link>
			</Navigation.Left>

			<Navigation.Center title={title} />

			<Navigation.Right placement="right">
				<Dropdown
					isOpen={isContactDropdownOpen}
					placement="bottom-end"
					onOpen={() => setIsContactDropdownOpen(true)}
					onClose={() => setIsContactDropdownOpen(false)}
				>
					<DropdownButton>
						<Button
							className={clsx(
								'u-color-white',
								'u-px-12',
								styles['c-reading-room-navigation__contact-button']
							)}
							iconStart={<Icon className="u-font-size-24" name="contact" />}
							label={t(
								'modules/reading-room/components/reading-room-navigation/reading-room-navigation___contacteer'
							)}
							variants="text"
						/>
					</DropdownButton>

					<DropdownContent>
						<ul className={styles['c-reading-room-navigation__contact-list']}>
							<li className={styles['c-reading-room-navigation__contact-item']}>
								<Link href={`mailto:${email}`} passHref={true}>
									<a>
										<Button
											className="u-text-left"
											iconStart={
												<Icon
													className="u-font-size-24 u-mr-8"
													name="email"
												/>
											}
											variants={['text', 'block', 'sm']}
											label={email}
										/>
									</a>
								</Link>

								<CopyButton text={email} variants={['sm', 'text']} />
							</li>

							<li className={styles['c-reading-room-navigation__contact-item']}>
								<Link href={`tel:${phone}`} passHref={true}>
									<a>
										<Button
											className="u-text-left"
											iconStart={
												<Icon
													className="u-font-size-24 u-mr-8"
													name="phone"
												/>
											}
											variants={['text', 'block', 'sm']}
											label={phone}
										/>
									</a>
								</Link>

								<CopyButton text={phone} variants={['sm', 'text']} />
							</li>
						</ul>
					</DropdownContent>
				</Dropdown>
			</Navigation.Right>
		</Navigation>
	);
};

export default ReadingRoomNavigation;
