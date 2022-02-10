import { fireEvent, render } from '@testing-library/react';

import ObjectPlaceholder from './ObjectPlaceholder';
import { objectPlaceholderMock } from './__mocks__/object-placeholder';

const renderObjectPlaceholder = ({ ...rest }) => {
	return render(<ObjectPlaceholder {...objectPlaceholderMock} {...rest} />);
};

describe('Components', () => {
	describe('<ObjectPlaceholder />', () => {
		it('Should set the correct class name', () => {
			const className = 'custom class name';
			const { container } = renderObjectPlaceholder({ className });

			expect(container.firstChild).toHaveClass(className);
		});

		it('Should display a description', () => {
			const descriptionMock = 'This is a description';
			const { getByText } = renderObjectPlaceholder({ description: descriptionMock });

			const description = getByText(descriptionMock);
			expect(description).toBeInTheDocument();
		});

		it('Should display a button to open the modal', () => {
			const openModalButtonLabelMock = 'This is a button';
			const { getByText } = renderObjectPlaceholder({
				openModalButtonLabel: openModalButtonLabelMock,
			});

			const button = getByText(openModalButtonLabelMock);
			expect(button).toBeInTheDocument();
		});

		it('Should open the modal on button click', () => {
			const openModalButtonLabelMock = 'This is a button';
			const { container, getByText } = renderObjectPlaceholder({
				openModalButtonLabel: openModalButtonLabelMock,
			});

			const button = getByText(openModalButtonLabelMock);

			fireEvent.click(button);

			const overlay =
				container.parentElement &&
				container.parentElement.querySelector('.ReactModal__Overlay');

			expect(overlay).toBeInTheDocument();
		});

		it('Should display a modal title', () => {
			const openModalButtonLabelMock = 'This is a button';
			const reasonTitleMock = 'This is a reason title';
			const { getByText } = renderObjectPlaceholder({
				reasonTitle: reasonTitleMock,
				openModalButtonLabel: openModalButtonLabelMock,
			});

			const button = getByText(openModalButtonLabelMock);

			fireEvent.click(button);

			const reasonTitle = getByText(reasonTitleMock);

			expect(reasonTitle).toBeInTheDocument();
		});

		it('Should display a modal description', () => {
			const openModalButtonLabelMock = 'This is a button';
			const reasonDescriptionMock = 'This is a reason description';
			const { getByText } = renderObjectPlaceholder({
				reasonDescription: reasonDescriptionMock,
				openModalButtonLabel: openModalButtonLabelMock,
			});

			const button = getByText(openModalButtonLabelMock);

			fireEvent.click(button);

			const reasonDescription = getByText(reasonDescriptionMock);

			expect(reasonDescription).toBeInTheDocument();
		});

		it('Should display a modal close button', () => {
			const openModalButtonLabelMock = 'This is a button';
			const closeModalButtonLabelMock = 'This is a close button';
			const { container, getByText } = renderObjectPlaceholder({
				closeModalButtonLabel: closeModalButtonLabelMock,
				openModalButtonLabel: openModalButtonLabelMock,
			});

			const openButton = getByText(openModalButtonLabelMock);

			fireEvent.click(openButton);

			const overlay =
				container.parentElement &&
				container.parentElement.querySelector('.ReactModal__Overlay');

			expect(overlay).toBeInTheDocument();

			const closeButton = getByText(closeModalButtonLabelMock);

			fireEvent.click(closeButton);

			expect(overlay).not.toBeInTheDocument();
		});

		it('Should close modal when onClose is called', () => {
			const openModalButtonLabelMock = 'This is a button';
			const { container, getByText } = renderObjectPlaceholder({
				openModalButtonLabel: openModalButtonLabelMock,
			});

			const openButton = getByText(openModalButtonLabelMock);

			fireEvent.click(openButton);

			const overlay =
				container.parentElement &&
				container.parentElement.querySelector('.ReactModal__Overlay');

			expect(overlay).toBeInTheDocument();

			overlay && fireEvent.click(overlay);

			expect(overlay).not.toBeInTheDocument();
		});
	});
});
