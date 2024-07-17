import { ReactSelect, type ReactSelectProps } from '@meemoo/react-components';
import { type FC } from 'react';

import useTranslation from '@shared/hooks/use-translation/use-translation';
import { IeObjectType } from '@shared/types/ie-objects';

import { type MediaTypeOptions } from '../../types';

const MediaTypeSelect: FC<ReactSelectProps> = (props) => {
	const { tText } = useTranslation();

	const options: MediaTypeOptions = [
		{
			label: tText(
				'modules/visitor-space/components/media-type-select/media-type-select___audio'
			),
			value: IeObjectType.Audio,
		},
		{
			label: tText(
				'modules/visitor-space/components/media-type-select/media-type-select___video'
			),
			value: IeObjectType.Video,
		},
		{
			label: tText(
				'modules/visitor-space/components/media-type-select/media-type-select___krant'
			),
			value: IeObjectType.Newspaper,
		},
	];

	// Bind to defaultProps to access externally
	MediaTypeSelect.defaultProps = { options };

	return <ReactSelect {...props} options={MediaTypeSelect.defaultProps.options} />;
};

export default MediaTypeSelect;
