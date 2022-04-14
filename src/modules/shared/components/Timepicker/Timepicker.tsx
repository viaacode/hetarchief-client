import { Timepicker as Base, TimepickerProps } from '@meemoo/react-components';
import { FC } from 'react';

// This component only wraps in the styling
import 'react-datepicker/dist/react-datepicker.min.css';

const Timepicker: FC<TimepickerProps> = (props) => <Base timeFormat="HH:mm" {...props} />;

export default Timepicker;
