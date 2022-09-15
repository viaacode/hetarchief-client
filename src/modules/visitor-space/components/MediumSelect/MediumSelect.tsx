import { ReactSelect, ReactSelectProps } from '@meemoo/react-components';
import { FC } from 'react';
import { useSelector } from 'react-redux';

import useTranslation from '@shared/hooks/use-translation/use-translation';
import { selectMediaFilterOptions } from '@shared/store/media';

const MediumSelect: FC<ReactSelectProps> = (props) => {
	const { tText } = useTranslation();
	const aggregates = useSelector(selectMediaFilterOptions)?.dcterms_medium.buckets;

	const options = (aggregates || []).map((bucket) => ({
		// label: `${bucket.key} (${bucket.doc_count})`, // Disabled due to non-representative scale of results
		label: `${bucket.key}`,
		value: bucket.key,
	}));

	// Bind to defaultProps to access externally
	MediumSelect.defaultProps = { options };

	const getPlaceholder = (): string | undefined => {
		return options.length === 0
			? tText(
					'modules/visitor-space/components/medium-select/medium-select___geen-analoge-dragers-gevonden'
			  )
			: tText(
					'modules/visitor-space/components/medium-select/medium-select___kies-een-analoge-drager'
			  );
	};

	return (
		<ReactSelect
			{...props}
			placeholder={getPlaceholder()}
			options={MediumSelect.defaultProps.options}
		/>
	);
};

export default MediumSelect;
