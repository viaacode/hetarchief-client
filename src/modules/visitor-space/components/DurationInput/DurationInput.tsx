import { TextInput, TextInputProps } from '@meemoo/react-components';
import { FC } from 'react';

import { Icon } from '@shared/components';

import { durationRegex } from '../../components/DurationInput/DurationInput.consts';

import style from './DurationInput.module.scss';

const DurationInput: FC<TextInputProps> = (props) => (
	<TextInput
		{...props}
		type="text"
		pattern={durationRegex}
		step="1"
		iconStart={<Icon name="clock" />}
		iconEnd={<span className={style['c-duration-input--placeholder']}>uu:mm:ss</span>}
	/>
);

export const defaultValue = '00:00:00';

export default DurationInput;
