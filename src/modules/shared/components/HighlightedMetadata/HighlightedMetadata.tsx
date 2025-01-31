import { compact, isString } from 'lodash-es';
import type { FC, ReactElement, ReactNode } from 'react';

import HighlightSearchTerms from '@shared/components/HighlightedMetadata/HighlightSearchTerms';

interface HighlightedMetadataProps {
	title?: string | ReactNode;
	data?: string | ReactNode;
	enabled?: boolean;
}

const HighlightedMetadata: FC<HighlightedMetadataProps> = ({ title, data, enabled = true }) => {
	if (isString(data)) {
		// Split text on new lines and highlight each part separately + put each part in its own paragraph to show new lines
		return (
			<>
				{compact(data.split(/(\\\\r|\\r)?\\\\n|\\n|<\/?br\/?>/)).map((fieldTextPart): ReactNode => {
					// ARC-1936: if url make it clickable
					if (data.startsWith('https://') || data.startsWith('http://')) {
						return (
							<p key={`${title}-${fieldTextPart}`}>
								<a href={fieldTextPart} target="_blank" rel="noreferrer">
									<HighlightSearchTerms toHighlight={fieldTextPart} />
								</a>
							</p>
						);
					}
					return (
						<p className="u-line-height-1-4 u-font-size-14" key={`${title}-${fieldTextPart}`}>
							<HighlightSearchTerms toHighlight={fieldTextPart} enabled={enabled} />
						</p>
					);
				})}
			</>
		);
	}
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return (data || null) as ReactElement<any, any> | null;
};

export default HighlightedMetadata;
