import { compact, isString } from 'lodash-es';
import { FC, ReactNode } from 'react';
import Highlighter from 'react-highlight-words';
import { useQueryParams } from 'use-query-params';

import { IE_OBJECT_QUERY_PARAM_CONFIG } from '@ie-objects/const';
import {
	HIGHLIGHTED_SEARCH_TERMS_SEPARATOR,
	QUERY_PARAM_KEY,
} from '@shared/const/query-param-keys';

interface HighlightedMetadataProps {
	title?: string | ReactNode;
	data?: string | ReactNode;
}

const HighlightedMetadata: FC<HighlightedMetadataProps> = ({ title, data }) => {
	const [query] = useQueryParams(IE_OBJECT_QUERY_PARAM_CONFIG);

	const highlighted = (toHighlight: string) => (
		<Highlighter
			searchWords={
				query[QUERY_PARAM_KEY.HIGHLIGHTED_SEARCH_TERMS]
					? decodeURIComponent(
							query[QUERY_PARAM_KEY.HIGHLIGHTED_SEARCH_TERMS] as string
					  ).split(HIGHLIGHTED_SEARCH_TERMS_SEPARATOR)
					: []
			}
			autoEscape={true}
			textToHighlight={toHighlight}
		/>
	);

	if (isString(data)) {
		// Split text on new lines and highlight each part separately + put each part in its own paragraph to show new lines
		return compact(data.split(/(\\\\r|\\r)?\\\\n|\\n|<\/?br\/?>/)).map(
			(fieldTextPart, fieldTextPartIndex) => {
				// ARC-1936: if url make it clickable
				if (data.startsWith('https://') || data.startsWith('http://')) {
					return (
						<p key={title + '-' + fieldTextPartIndex}>
							<a href={fieldTextPart} target="_blank" rel="noreferrer">
								{highlighted(fieldTextPart)}
							</a>
						</p>
					);
				}
				return (
					<p
						className="u-line-height-1-4 u-font-size-14"
						key={title + '-' + fieldTextPartIndex}
					>
						{highlighted(fieldTextPart)}
					</p>
				);
			}
		);
	} else {
		return data || null;
	}
};

export default HighlightedMetadata;
