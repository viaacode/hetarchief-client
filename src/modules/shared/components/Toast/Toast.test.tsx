import { fireEvent, render } from '@testing-library/react';

import Toast from './Toast';
import { ToastProps } from './Toast.types';
import { toastMock } from './__mocks__';

const renderToast = (mock: ToastProps, { ...rest }) => {
	return render(<Toast {...mock} {...rest} />);
};

describe('Component: <Toast /> (default)', () => {
	it('Should render title', () => {
		const { getByTestId } = renderToast(toastMock, {});

		const title = getByTestId('toast-title');

		expect(title).toBeInTheDocument();
	});

	it('Should render description', () => {
		const { getByTestId } = renderToast(toastMock, {});

		const description = getByTestId('toast-description');

		expect(description).toBeInTheDocument();
	});

	it('Should render button', () => {
		const { getByText } = renderToast(toastMock, {});

		const button = getByText(toastMock.buttonLabel);

		expect(button).toBeInTheDocument();
	});

	it('Should render label on hover', () => {
		const buttonLabelHover = 'hover';
		const { getByText } = renderToast(toastMock, { buttonLabelHover });

		const button = getByText(toastMock.buttonLabel);

		fireEvent.mouseOver(button);

		expect(button.textContent).toBe(buttonLabelHover);
	});

	it('should call onClose function on button click', () => {
		const onClose = jest.fn();
		const { getByText } = renderToast(toastMock, { onClose });

		const button = getByText(toastMock.buttonLabel);

		fireEvent.click(button);

		expect(onClose).toHaveBeenCalled();
		expect(onClose).toBeCalledTimes(1);
	});

	it('should set the correct visibility class when visible = false', () => {
		const { container } = renderToast(toastMock, { visible: false });

		const toast = container.firstChild;

		expect(toast).toHaveClass('c-toast--hidden');
	});

	it('should set the correct visibility class when visible = true', () => {
		const { container } = renderToast(toastMock, { visible: true });

		const toast = container.firstChild;

		expect(toast).toHaveClass('c-toast--visible');
	});
});
