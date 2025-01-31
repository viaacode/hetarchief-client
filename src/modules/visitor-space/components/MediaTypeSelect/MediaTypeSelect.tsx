import { ReactSelect, type ReactSelectProps } from '@meemoo/react-components';
import type { FC } from 'react';

import { tText } from '@shared/helpers/translate';
import { IeObjectType } from '@shared/types/ie-objects';

import type { MediaTypeOptions } from '../../types';

const MediaTypeSelect: FC<ReactSelectProps> = (props) => {
	const options: MediaTypeOptions = [
		{
			label: tText('modules/visitor-space/components/media-type-select/media-type-select___audio'),
			value: IeObjectType.Audio,
		},
		{
			label: tText('modules/visitor-space/components/media-type-select/media-type-select___video'),
			value: IeObjectType.Video,
		},
		{
			label: tText('modules/visitor-space/components/media-type-select/media-type-select___krant'),
			value: IeObjectType.Newspaper,
		},
	];

	return <ReactSelect {...props} options={options} />;
};

export default MediaTypeSelect;
