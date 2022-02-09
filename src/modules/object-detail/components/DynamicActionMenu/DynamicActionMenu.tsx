import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useRef } from 'react';

import { Icon } from '@shared/components';
import { useElementSize } from '@shared/hooks';

import styles from './DynamicActionMenu.module.scss';
import { ActionItem, DynamicActionMenuProps } from './DynamicActionMenu.types';

const DynamicActionMenu: FC<DynamicActionMenuProps> = ({
	className,
	actions,
	limit,
	onClickAction,
}) => {
	const listRef = useRef<HTMLUListElement>(null);
	const size = useElementSize(listRef);
	console.log(size?.width);

	const renderButton = (action: ActionItem) => {
		return (
			<li key={`media-action-${action.id}`} role="listitem">
				<Button
					onClick={() => onClickAction(action.id)}
					icon={<Icon name={action.iconName} />}
					variants={['silver']}
				/>
			</li>
		);
	};

	return (
		<ul ref={listRef} className={clsx(className, styles['c-dynamic-action-menu'])} role="list">
			{actions.map(renderButton)}
		</ul>
	);
};

export default DynamicActionMenu;
