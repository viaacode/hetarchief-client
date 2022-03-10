import clsx from 'clsx';
import { FC, useState } from 'react';

import { Icon, ListNavigation, Sidebar } from '@shared/components';
import { SidebarLayoutTitle } from '@shared/components/SidebarLayoutTitle';

import styles from './SidebarLayout.module.scss';
import { SidebarLayoutProps } from './SidebarLayout.types';

const SidebarLayout: FC<SidebarLayoutProps> = ({
	children,
	className,
	contentTitle,
	sidebarLinks,
	sidebarTitle,
	color = 'white',
	responsiveTo = undefined,
}) => {
	const [isExpanded, setExpanded] = useState(false);
	const isResponsive = !!responsiveTo;

	return (
		<div
			className={clsx(styles['l-sidebar'], 'u-bg-platinum', className, {
				[styles[`l-sidebar--collapse-to-${responsiveTo}px`]]: isResponsive,
				[styles['l-sidebar--open']]: isResponsive && isExpanded,
			})}
		>
			<div
				{...(isResponsive ? { onClick: () => setExpanded(false) } : {})}
				className={clsx(styles['l-sidebar__navigation'], {
					[`u-bg-${color}`]: !!color,
				})}
			>
				<Sidebar
					color={color}
					className={styles['l-sidebar__sidebar']}
					title={sidebarTitle}
				>
					<ListNavigation color={color} listItems={sidebarLinks} />
				</Sidebar>
			</div>

			<div className={styles['l-sidebar__main']}>
				{isResponsive && (
					<div
						role="button"
						tabIndex={0}
						onClick={() => setExpanded(true)}
						className={clsx(
							styles['l-sidebar__content-header'],
							'u-bg-white',
							'l-container',
							'u-py-16'
						)}
					>
						<Icon name="arrow-left" />
						{sidebarTitle}
					</div>
				)}

				{contentTitle && (
					<div
						className={clsx(
							styles['l-sidebar__content'],
							'l-container u-mt-32 u-mt-64:md'
						)}
					>
						<SidebarLayoutTitle>{contentTitle}</SidebarLayoutTitle>
					</div>
				)}

				{children}
			</div>
		</div>
	);
};

export default SidebarLayout;
