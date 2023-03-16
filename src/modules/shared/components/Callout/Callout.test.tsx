import { Button } from '@meemoo/react-components';
import { fireEvent, render } from '@testing-library/react';

import { Icon, IconNamesLight } from '@shared/components';

import Callout from './Callout';
import { CalloutProps } from './Callout.types';
import { calloutMock } from './__mocks__/callout';

const renderCallout = (mock: CalloutProps = calloutMock) => {
	return render(<Callout {...mock} />);
};

describe('Component: <Callout /> (default)', () => {
	it('Should render the correct class name', () => {
		const className = 'custom-class';
		const { container } = renderCallout({ ...calloutMock, className });

		expect(container.firstChild).toHaveClass(className);
	});

	it('Should render icon', () => {
		const icon = <Icon name={IconNamesLight.Info} />;
		const { getByText } = renderCallout({ ...calloutMock, icon });

		const iconNode = getByText('info');

		expect(iconNode).toBeInTheDocument();
	});

	it('Should render text', () => {
		const text = 'text';
		const { getByText } = renderCallout({ ...calloutMock, text });

		const textNode = getByText(text);

		expect(textNode).toBeInTheDocument();
	});

	it('Should render action button', () => {
		const action = <Button label="foo" />;
		const { getByText } = renderCallout({ ...calloutMock, action });

		const button = getByText('foo');

		expect(button).toBeInTheDocument();
	});

	it('Should handle action click', () => {
		const onClick = jest.fn();
		const action = <Button label="foo" onClick={onClick} />;
		const { getByText } = renderCallout({ ...calloutMock, action });

		const button = getByText('foo');

		fireEvent.click(button);

		expect(onClick).toHaveBeenCalled();
		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
