import { ReactSelect, ReactSelectProps } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { MediaTypeOptions } from '../../types';

const MediaTypeSelect: FC<ReactSelectProps> = (props) => {
	const { t } = useTranslation();

	const options: MediaTypeOptions = [
		{
			label: t(
				'modules/visitor-space/components/media-type-select/media-type-select___audio'
			),
			value: 'audio',
		},
		{
			label: t(
				'modules/visitor-space/components/media-type-select/media-type-select___video'
			),
			value: 'video',
		},
	];

	// Bind to defaultProps to access externally
	MediaTypeSelect.defaultProps = { options };

	return <ReactSelect {...props} options={MediaTypeSelect.defaultProps.options} />;
};

export default MediaTypeSelect;
