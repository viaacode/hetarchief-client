import { ReactSelect, ReactSelectProps } from '@meemoo/react-components';
import { FC } from 'react';
import { useSelector } from 'react-redux';

import useTranslation from '@shared/hooks/use-translation/use-translation';
import { selectMediaFilterOptions } from '@shared/store/media';

const GenreSelect: FC<ReactSelectProps> = (props) => {
	const { tText } = useTranslation();
	const aggregates = useSelector(selectMediaFilterOptions)?.schema_genre.buckets;

	const options = (aggregates || []).map((bucket) => ({
		// label: `${bucket.key} (${bucket.doc_count})`, // Disabled due to non-representative scale of results
		label: `${bucket.key}`,
		value: bucket.key,
	}));

	// Bind to defaultProps to access externally
	GenreSelect.defaultProps = { options };

	const getPlaceholder = (): string | undefined => {
		return options.length === 0
			? tText(
					'modules/visitor-space/components/genre-select/genre-select___geen-genres-gevonden'
			  )
			: tText('modules/visitor-space/components/genre-select/genre-select___kies-een-genre');
	};

	return (
		<ReactSelect
			{...props}
			placeholder={getPlaceholder()}
			options={GenreSelect.defaultProps.options}
		/>
	);
};

export default GenreSelect;
