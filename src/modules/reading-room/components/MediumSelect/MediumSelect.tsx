import { ReactSelect, ReactSelectProps } from '@meemoo/react-components';
import { FC } from 'react';

import { MediaSearchAggregationPair } from '@media/types';

const MediumSelect: FC<ReactSelectProps> = (props) => {
	const aggregates: MediaSearchAggregationPair<string>[] = [];

	const options = (aggregates || []).map((bucket) => ({
		// label: `${bucket.key} (${bucket.doc_count})`, // Disabled due to non-representative scale of results
		label: `${bucket.key}`,
		value: bucket.key,
	}));

	// Bind to defaultProps to access externally
	MediumSelect.defaultProps = { options };

	return (
		<ReactSelect
			{...props}
			placeholder='Missing "dcterms_medium"' // https://meemoo.atlassian.net/wiki/spaces/HA2/pages/3402891314/Geavanceerde+search+BZT+versie+1?focusedCommentId=3417604098#comment-3417604098
			options={MediumSelect.defaultProps.options}
		/>
	);
};

export default MediumSelect;
