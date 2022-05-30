import { ReactSelect, ReactSelectProps } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';
import { useSelector } from 'react-redux';

import { selectMediaFilterOptions } from '@shared/store/media';

const GenreSelect: FC<ReactSelectProps> = (props) => {
	const { t } = useTranslation();
	const aggregates = useSelector(selectMediaFilterOptions)?.schema_genre.buckets;

	const options = (aggregates || []).map((bucket) => ({
		// label: `${bucket.key} (${bucket.doc_count})`, // Disabled due to non-representative scale of results
		label: `${bucket.key}`,
		value: bucket.key,
	}));

	// Bind to defaultProps to access externally
	GenreSelect.defaultProps = { options };

	const getPlaceholder = (): string | undefined => {
		return options.length > 0
			? t('modules/visitor-space/components/genre-select/genre-select___geen-genres-gevonden')
			: t('modules/visitor-space/components/genre-select/genre-select___kies-een-genre');
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
