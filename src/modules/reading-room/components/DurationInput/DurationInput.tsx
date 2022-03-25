import { TextInput as Base, TextInputProps } from '@meemoo/react-components';
import { FC } from 'react';

const DurationInput: FC<TextInputProps> = (props) => (
	<Base {...props} type="time" pattern="([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])" step="1" />
);

export default DurationInput;
