import { ReactSelect, ReactSelectProps } from '@meemoo/react-components';
import { FC } from 'react';
import { useSelector } from 'react-redux';

import useTranslation from '@shared/hooks/use-translation/use-translation';
import { selectIeObjectsFilterOptions } from '@shared/store/ie-objects/ie-objects.select';
import { IeObjectsSearchFilterField } from '@shared/types';

const ObjectTypeSelect: FC<ReactSelectProps> = (props) => {
	const { tText } = useTranslation();
	const filterOptions: string[] = useSelector(selectIeObjectsFilterOptions)?.[
		IeObjectsSearchFilterField.OBJECT_TYPE
	];

	const options = filterOptions.map((option) => ({
		// label: `${bucket.key} (${bucket.doc_count})`, // Disabled due to non-representative scale of results
		label: option,
		value: option,
	}));

	// Bind to defaultProps to access externally
	ObjectTypeSelect.defaultProps = { options };

	const getPlaceholder = (): string | undefined => {
		return options.length === 0
			? tText(
					'modules/visitor-space/components/object-type-select/object-type-select___geen-object-types-gevonden'
			  )
			: tText(
					'modules/visitor-space/components/object-type-select/object-type-select___kies-een-object-type'
			  );
	};

	return (
		<ReactSelect
			{...props}
			placeholder={getPlaceholder()}
			options={ObjectTypeSelect.defaultProps.options}
		/>
	);
};

export default ObjectTypeSelect;
