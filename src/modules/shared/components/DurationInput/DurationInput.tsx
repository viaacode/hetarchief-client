import { TextInput as Base, TextInputProps } from '@meemoo/react-components';
import { FC } from 'react';

const DurationInput: FC<TextInputProps> = (props) => (
	<Base {...props} type="time" pattern="[[0-9]{1,}]*" step="0.001" />
);

export default DurationInput;
