import { type FC } from 'react';

import { Icon } from '../../Icon';

import styles from './TagSearchBarInfo.module.scss';
import { type TagSearchBarInfoProps } from './TagSearchBarInfo.types';

const TagSearchBarInfo: FC<TagSearchBarInfoProps> = ({ icon, content }) => (
	<aside tabIndex={0} className={styles['c-tag-search-bar-info']}>
		<Icon name={icon} className={styles['c-tag-search-bar-info__icon']} />
		<div className={styles['c-tag-search-bar-info__content']}>{content}</div>
	</aside>
);

export default TagSearchBarInfo;
