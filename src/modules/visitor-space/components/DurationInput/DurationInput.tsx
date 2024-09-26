import { TextInput, type TextInputProps } from '@meemoo/react-components';
import { type FC } from 'react';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';

import { durationRegex } from '../../components/DurationInput/DurationInput.consts';

import style from './DurationInput.module.scss';

const DurationInput: FC<TextInputProps> = (props) => (
	<TextInput
		{...props}
		type="text"
		pattern={durationRegex}
		step="1"
		iconStart={<Icon name={IconNamesLight.Clock} />}
		iconEnd={
			<span className={style['c-duration-input--placeholder']}>
				{tText('modules/visitor-space/components/duration-input/duration-input___uu-mm-ss')}
			</span>
		}
	/>
);

export const defaultValue = '00:00:00';

export default DurationInput;
