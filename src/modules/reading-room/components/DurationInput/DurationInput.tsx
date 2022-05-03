import { TextInput, TextInputProps } from '@meemoo/react-components';
import { FC } from 'react';

import { durationRegex } from '@reading-room/components/DurationInput/DurationInput.consts';

import style from './DurationInput.module.scss';

const DurationInput: FC<TextInputProps> = (props) => (
	<div className={style['c-duration-input']}>
		<TextInput {...props} type="text" pattern={durationRegex} step="1" />
		<span className={style['c-duration-input--placeholder']}>uu:mm:ss</span>
	</div>
);

export const defaultValue = '00:00:00';

export default DurationInput;
