import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { isNil } from 'lodash-es';
import { FC, ReactNode } from 'react';

import { Permission } from '@account/const';
import { Navigation } from '@navigation/components';
import { DropdownMenu, Icon, IconNamesLight } from '@shared/components';
import { CopyButton } from '@shared/components/CopyButton';
import { isVisitorSpaceSearchPage } from '@shared/helpers/is-visitor-space-search-page';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { VisitorSpaceNavigationProps } from '@visitor-space/components';

import styles from './VisitorSpaceNavigation.module.scss';

const VisitorSpaceNavigation: FC<VisitorSpaceNavigationProps> = ({
	className,
	email,
	phone,
	accessEndDate,
	title,
	showContactInfo,
}) => {
	const { tHtml, tText } = useTranslation();
	const showLinkedSpaceAsHomepage = useHasAllPermission(Permission.SHOW_LINKED_SPACE_AS_HOMEPAGE);
	// Check if the url is of the format: /vrt and not of the format: /vrt/some-id
	const isSearchPage = isVisitorSpaceSearchPage(window.location.pathname);

	const renderContact = (): ReactNode => {
		if (!phone && !email) {
			return (
				<span className="u-py-8">
					{tHtml(
						'modules/visitor-space/components/visitor-space-navigation/visitor-space-navigation___geen-contactinformatie-beschikbaar'
					)}
				</span>
			);
		}

		return (
			<DropdownMenu
				placement="bottom-end"
				triggerButtonProps={{
					className: clsx(
						'u-color-white',
						'u-px-12',
						styles['c-visitor-space-navigation__contact-button']
					),
					icon: undefined,
					iconStart: (
						<Icon
							className="u-font-size-24"
							name={IconNamesLight.Contact}
							aria-hidden
						/>
					),
					label: tHtml(
						'modules/visitor-space/components/visitor-space-navigation/visitor-space-navigation___contacteer'
					),
					'aria-label': tText(
						'modules/visitor-space/components/visitor-space-navigation/visitor-space-navigation___contacteer'
					),
					variants: 'text',
				}}
			>
				<ul className={styles['c-visitor-space-navigation__contact-list']}>
					{email && (
						<li className={styles['c-visitor-space-navigation__contact-item']}>
							<Button
								className="u-text-left"
								variants={['text', 'block', 'sm']}
								label={email}
							/>

							<CopyButton text={email} variants={['sm', 'text']} />
						</li>
					)}

					{phone && (
						<li className={styles['c-visitor-space-navigation__contact-item']}>
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
		);
	};

	return (
		<Navigation contextual className={className}>
			<Navigation.Left placement="left">
				{showLinkedSpaceAsHomepage && isSearchPage ? null : (
					<Button
						icon={<Icon name={IconNamesLight.ArrowLeft} aria-hidden />}
						variants="text"
						className="u-color-white u-ml--12"
						onClick={() => window.history.back()}
					/>
				)}
			</Navigation.Left>

			<Navigation.Center title={title} />

			<Navigation.Right placement="right">
				{!isNil(accessEndDate) && (
					<span className="u-py-8 u-text-right">{accessEndDate}</span>
				)}
				{showContactInfo && renderContact()}
			</Navigation.Right>
		</Navigation>
	);
};

export default VisitorSpaceNavigation;
