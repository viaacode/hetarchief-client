import { TagList } from '@meemoo/react-components';
import Link from 'next/link';
import type { FC } from 'react';

import type { SearchLinkTagProps } from '@ie-objects/components/SearchLinkTag/SearchLinkTag.types';
import { mapKeywordsToTags } from '@ie-objects/utils/map-metadata';
import { NoServerSideRendering } from '@visitor-space/components/NoServerSideRendering/NoServerSideRendering';

import styles from './SearchLinkTag.module.scss';

export const SearchLinkTag: FC<SearchLinkTagProps> = ({ label, link }) => {
	// Skip server side rendering, since tags don't play nice with server side rendering
	return (
		<NoServerSideRendering>
			<div className={styles['c-metadata-search-link']}>
				<Link href={link}>
					<TagList
						className="u-pt-12"
						tags={mapKeywordsToTags([label])}
						variants={['clickable', 'silver', 'medium']}
					/>
				</Link>
			</div>
		</NoServerSideRendering>
	);
};
