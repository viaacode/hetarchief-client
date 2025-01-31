import clsx from 'clsx';
import type { FC } from 'react';
import Highlighter from 'react-highlight-words';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import {
	HIGHLIGHTED_SEARCH_TERMS_SEPARATOR,
	QUERY_PARAM_KEY,
} from '@shared/const/query-param-keys';

import styles from './HighlightSearchTerms.module.scss';

interface HighlightSearchTermsProps {
	toHighlight: string;
	searchTerms?: string[];
	activeSearchTermIndex?: number;
	enabled?: boolean;
	fullHeight?: boolean;
	className?: string;
}

const HighlightSearchTerms: FC<HighlightSearchTermsProps> = ({
	toHighlight,
	searchTerms,
	activeSearchTermIndex,
	enabled = true,
	fullHeight = false,
	className,
}) => {
	const [highlightedSearchTerms] = useQueryParam(
		QUERY_PARAM_KEY.HIGHLIGHTED_SEARCH_TERMS,
		withDefault(StringParam, '')
	);

	const getSearchWords = (): string[] => {
		let searchWords: string[];
		if (searchTerms) {
			searchWords = searchTerms;
		} else if (highlightedSearchTerms) {
			searchWords = decodeURIComponent(highlightedSearchTerms).split(
				HIGHLIGHTED_SEARCH_TERMS_SEPARATOR
			);
		} else {
			searchWords = [];
		}
		return searchWords;
	};

	if (!enabled) {
		return <>{toHighlight}</>;
	}
	return (
		<Highlighter
			className={clsx(
				styles['c-highlight-search-terms'],
				{
					[styles['c-highlight-search-terms__full-height']]: fullHeight,
				},
				className
			)}
			searchWords={getSearchWords()}
			autoEscape={true}
			textToHighlight={toHighlight}
			activeIndex={activeSearchTermIndex}
			activeClassName={styles['c-highlight-search-terms__active']}
		/>
	);
};

export default HighlightSearchTerms;
