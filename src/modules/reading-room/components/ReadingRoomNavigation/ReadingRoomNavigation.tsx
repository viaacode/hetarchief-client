import {
	Button,
	Dropdown,
	DropdownButton,
	DropdownContent,
	MenuContent,
} from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { FC, useState } from 'react';

import { Icon, Navigation } from '@shared/components';

import { READING_ROOM_NAVIGATION__CONTACT_ITEMS } from './ReadingRoomNavigation.const';
import styles from './ReadingRoomNavigation.module.scss';
import { ReadingRoomNavigationProps } from './ReadingRoomNavigation.types';

const ReadingRoomNavigation: FC<ReadingRoomNavigationProps> = ({ title }) => {
	const { t } = useTranslation();
	const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);

	return (
		<Navigation contextual>
			<Navigation.Left placement="left">
				<Link href="/" passHref={true}>
					<Button
						icon={<Icon name="arrow-left" />}
						variants="text"
						className="u-color-white u-ml--12"
					/>
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
							label={t('Contacteer')}
							variants="text"
						/>
					</DropdownButton>

					<DropdownContent>
						<ul className={styles['c-reading-room-navigation__contact-list']}>
							<li className={styles['c-reading-room-navigation__contact-item']}>
								{/* TODO: bind to state */}
								<Button variants="text" label={'info@studiohyperdrive.be'} />
							</li>

							<li className={styles['c-reading-room-navigation__contact-item']}>
								{/* TODO: bind to state */}
								<Button variants="text" label={'+32 487 02 80 55'} />
							</li>
						</ul>
					</DropdownContent>
				</Dropdown>
			</Navigation.Right>
		</Navigation>
	);
};

export default ReadingRoomNavigation;
