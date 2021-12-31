import { getByDisplayValue, render, screen } from '@testing-library/react';

import Toast from './Toast';
import { toastMock } from './__mocks__';

const renderToast = ({
	title = toastMock.title,
	description = toastMock.description,
	buttonLabel = toastMock.buttonLabel,
	maxLines = toastMock.maxLines,
	...rest
}) => {
	return render(
		<Toast
			title={title}
			description={description}
			buttonLabel={buttonLabel}
			maxLines={maxLines}
			{...rest}
		/>
	);
};

describe('Component: <Toast /> (default)', () => {
	it('Should render title', () => {
		const { getByTestId } = renderToast({});

		const title = getByTestId('toast-title');

		expect(title).toBeInTheDocument();
	});

	it('Should render description', () => {
		const { getByTestId } = renderToast({});

		const description = getByTestId('toast-description');

		expect(description).toBeInTheDocument();
	});

	it('Should render button', () => {
		const { getByText } = renderToast({});

		const description = getByText(toastMock.buttonLabel);

		expect(description).toBeInTheDocument();
	});
});
