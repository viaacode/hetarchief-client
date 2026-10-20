import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { ListNavigation } from '@shared/components/ListNavigation';
import { Sidebar } from '@shared/components/Sidebar';
import clsx from 'clsx';
import { type FC, useState } from 'react';

import styles from './SidebarLayout.module.scss';
import type { SidebarLayoutProps } from './SidebarLayout.types';

const SidebarLayout: FC<SidebarLayoutProps> = ({
	children,
	className,
	sidebarLinks = [],
	sidebarTitle,
	sidebarTitleActions,
	sidebarSubtitle,
	color = 'white',
	responsiveTo = undefined,
}) => {
	const [isExpanded, setExpanded] = useState(true);
	const isResponsive = !!responsiveTo;

	return (
		<div
			className={clsx(styles['l-sidebar'], 'u-bg-platinum', className, {
				[styles[`l-sidebar--collapse-to-${responsiveTo}px`]]: isResponsive,
				[styles['l-sidebar--open']]: isResponsive && isExpanded,
			})}
		>
			<div
				{...(isResponsive
					? {
							onClick: (evt) => {
								// Only collapse the sidebar when navigating, not when using controls in the sidebar, eg: sort or create folder
								if ((evt.target as HTMLElement).closest('a')) {
									setExpanded(false);
								}
							},
						}
					: {})}
				className={clsx(styles['l-sidebar__navigation'], {
					[`u-bg-${color}`]: !!color,
				})}
			>
				<Sidebar
					color={color}
					className={styles['l-sidebar__sidebar']}
					title={sidebarTitle}
					titleActions={sidebarTitleActions}
					subtitle={sidebarSubtitle}
				>
					<ListNavigation
						className={styles['l-sidebar__sidebar--top']}
						color={color}
						listItems={sidebarLinks}
					/>
				</Sidebar>
			</div>

			<div className={styles['l-sidebar__main']}>
				{isResponsive && (
					// biome-ignore lint/a11y/useSemanticElements: _
					<div
						role="button"
						tabIndex={0}
						onClick={() => setExpanded(true)}
						onKeyUp={(evt) => {
							if (evt.key === 'Enter') {
								setExpanded(true);
							}
						}}
						className={clsx(
							styles['l-sidebar__content-header'],
							'u-bg-white',
							'l-container',
							'u-py-16'
						)}
					>
						<Icon name={IconNamesLight.ArrowLeft} aria-hidden />
						{sidebarTitle}
					</div>
				)}

				{children}
			</div>
		</div>
	);
};

export default SidebarLayout;
