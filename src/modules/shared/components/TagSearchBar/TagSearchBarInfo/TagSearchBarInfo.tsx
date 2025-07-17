import { type FC, useRef, useState } from 'react';

import { Icon } from '../../Icon';

import { useClickOutside } from '@meemoo/react-components';
import clsx from 'clsx';
import styles from './TagSearchBarInfo.module.scss';
import type { TagSearchBarInfoProps } from './TagSearchBarInfo.types';

const TagSearchBarInfo: FC<TagSearchBarInfoProps> = ({ icon, content }) => {
	const [showContent, setShowContent] = useState(false);
	const tagSearchBarInfoRef = useRef<HTMLDivElement>(null);
	const [isTimeoutClickAfterHover, setIsTimeoutClickAfterHover] = useState(false);

	useClickOutside(tagSearchBarInfoRef.current as Element, () => setShowContent(false));

	const toggleContent = () => {
		if (isTimeoutClickAfterHover) {
			// Prevent toggling content if the user clicked right after hovering the button
			return;
		}
		setShowContent(!showContent);
	};

	return (
		<aside
			className={clsx(
				styles['c-tag-search-bar-info'],
				showContent && styles['c-tag-search-bar-info--open']
			)}
			ref={tagSearchBarInfoRef}
		>
			<Icon
				name={icon}
				className={styles['c-tag-search-bar-info__icon']}
				onClick={toggleContent}
				onMouseEnter={() => {
					setIsTimeoutClickAfterHover(true);
					setShowContent(true);
					setTimeout(() => setIsTimeoutClickAfterHover(false), 1000);
				}}
			/>
			{showContent && <div className={styles['c-tag-search-bar-info__content']}>{content}</div>}
		</aside>
	);
};

export default TagSearchBarInfo;
