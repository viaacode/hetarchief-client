import {
	Datepicker,
	futureDatepicker,
	historicDatepicker,
	TextInput,
} from '@meemoo/react-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useState } from 'react';

import { Icon } from '../Icon';

export default {
	title: 'Components/Datepicker',
	component: Datepicker,
} as ComponentMeta<typeof Datepicker>;

const Template: ComponentStory<typeof Datepicker> = (props) => {
	const [date, setDate] = useState(new Date());

	return <Datepicker {...props} selected={date} onChange={(date) => date && setDate(date)} />;
};

export const Future = Template.bind({});
Future.args = {
	...futureDatepicker,
};

export const Historic = Template.bind({});
Historic.args = {
	...historicDatepicker,
};

export const WithInput = Template.bind({});
WithInput.args = {
	...futureDatepicker,
	customInput: <TextInput iconStart={<Icon name="calendar" />} />,
};
