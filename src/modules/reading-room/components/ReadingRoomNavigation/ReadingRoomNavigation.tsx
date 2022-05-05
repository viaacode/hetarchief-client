import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { FC } from 'react';
import { useSelector } from 'react-redux';

import { Permission } from '@account/const';
import { Navigation } from '@navigation/components';
import { DropdownMenu, Icon } from '@shared/components';
import { CopyButton } from '@shared/components/CopyButton';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { selectShowNavigationBorder } from '@shared/store/ui';

import styles from './ReadingRoomNavigation.module.scss';
import { ReadingRoomNavigationProps } from './ReadingRoomNavigation.types';

const ReadingRoomNavigation: FC<ReadingRoomNavigationProps> = ({
	backLink = '/',
	className,
	email,
	phone,
	showAccessEndDate,
	title,
}) => {
	const { t } = useTranslation();
	const showBorder = useSelector(selectShowNavigationBorder);
	const showLinkedSpaceAsHomepage = useHasAllPermission(Permission.SHOW_LINKED_SPACE_AS_HOMEPAGE);

	return (
		<Navigation contextual className={className} showBorder={showBorder}>
			<Navigation.Left placement="left">
				{showLinkedSpaceAsHomepage ? null : (
					<Link href={backLink} passHref={true}>
						<a>
							<Button
								icon={<Icon name="arrow-left" />}
								variants="text"
								className="u-color-white u-ml--12"
							/>
						</a>
					</Link>
				)}
			</Navigation.Left>

			<Navigation.Center title={title} />

			<Navigation.Right placement="right">
				{showAccessEndDate !== undefined ? (
					<span className="u-py-8 u-text-right">{showAccessEndDate}</span>
				) : !!phone || !!email ? (
					<DropdownMenu
						placement="bottom-end"
						triggerButtonProps={{
							className: clsx(
								'u-color-white',
								'u-px-12',
								styles['c-reading-room-navigation__contact-button']
							),
							icon: undefined,
							iconStart: <Icon className="u-font-size-24" name="contact" />,
							label: t(
								'modules/reading-room/components/reading-room-navigation/reading-room-navigation___contacteer'
							),
							variants: 'text',
						}}
					>
						<ul className={styles['c-reading-room-navigation__contact-list']}>
							{email && (
								<li className={styles['c-reading-room-navigation__contact-item']}>
									<Button
										className="u-text-left"
										variants={['text', 'block', 'sm']}
										label={email}
									/>

									<CopyButton text={email} variants={['sm', 'text']} />
								</li>
							)}

							{phone && (
								<li className={styles['c-reading-room-navigation__contact-item']}>
									<Button
										className="u-text-left"
										variants={['text', 'block', 'sm']}
										label={phone}
									/>

									<CopyButton text={phone} variants={['sm', 'text']} />
								</li>
							)}
						</ul>
					</DropdownMenu>
				) : (
					<span className="u-py-8">
						{t(
							'modules/reading-room/components/reading-room-navigation/reading-room-navigation___geen-contactinformatie-beschikbaar'
						)}
					</span>
				)}
			</Navigation.Right>
		</Navigation>
	);
};

export default ReadingRoomNavigation;
