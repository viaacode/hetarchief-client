import { FC } from 'react';
import Highlighter from 'react-highlight-words';
import { useQueryParams } from 'use-query-params';

import { IE_OBJECT_QUERY_PARAM_CONFIG } from '@ie-objects/ie-objects.consts';
import {
	HIGHLIGHTED_SEARCH_TERMS_SEPARATOR,
	QUERY_PARAM_KEY,
} from '@shared/const/query-param-keys';

interface HighlightSearchTermsProps {
	toHighlight: string;
	searchTerms?: string[];
	enabled?: boolean;
}

const HighlightSearchTerms: FC<HighlightSearchTermsProps> = ({
	toHighlight,
	searchTerms,
	enabled = true,
}) => {
	const [query] = useQueryParams(IE_OBJECT_QUERY_PARAM_CONFIG);

	const getSearchWords = (): string[] => {
		let searchWords: string[];
		const queryParamSearchTerms = query[QUERY_PARAM_KEY.HIGHLIGHTED_SEARCH_TERMS] as
			| string
			| undefined;
		if (searchTerms) {
			searchWords = searchTerms;
		} else if (queryParamSearchTerms) {
			searchWords = decodeURIComponent(queryParamSearchTerms).split(
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
			searchWords={getSearchWords()}
			autoEscape={true}
			textToHighlight={toHighlight}
		/>
	);
};

export default HighlightSearchTerms;
