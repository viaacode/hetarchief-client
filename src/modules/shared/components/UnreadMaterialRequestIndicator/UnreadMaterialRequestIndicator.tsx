import { Badge } from '@meemoo/react-components';
import type { DefaultComponentProps } from '@shared/types';
import clsx from 'clsx';
import type { FC } from 'react';

import styles from './UnreadMaterialRequestIndicator.module.scss';

interface UnreadMaterialRequestIndicatorProps extends DefaultComponentProps {
	count?: number;
}

/**
 * Plain red dot flagging unread conversation messages - no count, no tooltip. Used next to the
 * avatar and wherever a nav item (dropdown or sidebar) needs to signal "you have unread messages
 * here". The actual per-request count lives in the overview tables' Badge column instead - a real
 * number, a different UI from this plain indicator.
 */
export const UnreadMaterialRequestIndicator: FC<UnreadMaterialRequestIndicatorProps> = ({
	count,
	className,
}) =>
	!count ? (
		<span
			className={clsx(styles['c-unread-material-request-indicator'], className)}
			aria-hidden="true"
		/>
	) : (
		<Badge
			text={count}
			variants={['error', 'small']}
			className={clsx(styles['c-unread-material-request-indicator'], className)}
		/>
	);

/**
 * Flex row wrapper for a label + UnreadDot pair - only use this when a dot is actually being
 * rendered, since it's what gives UnreadDot's `margin-left: auto` real free space to push
 * against (see UnreadDot.module.scss for why a floor and `auto` can't be expressed as one value).
 */
export const UnreadMaterialRequestIndicatorRow: FC<DefaultComponentProps> = ({
	children,
	className,
}) => (
	<span className={clsx(styles['c-unread-material-request-indicator-row'], className)}>
		{children}
		<UnreadMaterialRequestIndicator />
	</span>
);
