import { fireEvent, render } from '@testing-library/react';

import { Icon } from '../Icon';

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
		const icon = <Icon name="info" />;
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
		const action = {
			label: 'button',
			onClick: () => null,
		};
		const { getByText } = renderCallout({ ...calloutMock, action });

		const button = getByText(action.label);

		expect(button).toBeInTheDocument();
	});

	it('Should handle action click', () => {
		const action = {
			label: 'button',
			onClick: jest.fn(),
		};
		const { getByText } = renderCallout({ ...calloutMock, action });

		const button = getByText(action.label);

		fireEvent.click(button);

		expect(action.onClick).toHaveBeenCalled();
		expect(action.onClick).toHaveBeenCalledTimes(1);
	});
});
