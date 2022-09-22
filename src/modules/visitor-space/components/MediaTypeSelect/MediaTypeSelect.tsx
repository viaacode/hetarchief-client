import { ReactSelect, ReactSelectProps } from '@meemoo/react-components';
import { FC } from 'react';

import useTranslation from '@shared/hooks/use-translation/use-translation';

import { MediaTypeOptions } from '../../types';

const MediaTypeSelect: FC<ReactSelectProps> = (props) => {
	const { tText } = useTranslation();

	const options: MediaTypeOptions = [
		{
			label: tText(
				'modules/visitor-space/components/media-type-select/media-type-select___audio'
			),
			value: 'audio',
		},
		{
			label: tText(
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
