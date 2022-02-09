import { Datepicker as Base, DatepickerProps } from '@meemoo/react-components';
import { FC } from 'react';

// This component only wraps in the styling
import 'react-datepicker/dist/react-datepicker.min.css';

const Datepicker: FC<DatepickerProps> = (props) => <Base {...props} />;

export default Datepicker;
