import { ReactSelect, ReactSelectProps } from '@meemoo/react-components';
import { FC } from 'react';
import { useSelector } from 'react-redux';

import { selectMediaResults } from '@shared/store/media';

const GenreSelect: FC<ReactSelectProps> = (props) => {
	const aggregates = useSelector(selectMediaResults)?.aggregations.schema_genre.buckets;

	const options = (aggregates || []).map((bucket) => ({
		// label: `${bucket.key} (${bucket.doc_count})`, // Disabled due to non-representative scale of results
		label: `${bucket.key}`,
		value: bucket.key,
	}));

	// Bind to defaultProps to access externally
	GenreSelect.defaultProps = { options };

	return <ReactSelect {...props} options={GenreSelect.defaultProps.options} />;
};

export default GenreSelect;
