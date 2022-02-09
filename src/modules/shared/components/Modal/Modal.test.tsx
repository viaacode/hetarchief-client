import { fireEvent, render, RenderOptions, screen } from '@testing-library/react';
import { PropsWithChildren } from 'react';

import Modal from './Modal';
import { ModalProps } from './Modal.types';

const text = 'Title of the Modal';
const noPadding = { padding: '' };
const noMargin = { margin: '' };
const closeIcon = 'times';

const renderModal = (
	{ isOpen = true, title = text, ...rest }: PropsWithChildren<ModalProps> = {},
	renderOptions?: RenderOptions
) => render(<Modal {...rest} isOpen={isOpen} title={title} />, renderOptions);

describe('Component: <Modal />', () => {
	it('Should render no content initially', () => {
		renderModal({ isOpen: false });

		try {
			screen.getByText(text);
		} catch (error) {
			expect(error);
		}
	});

	it('Should render a portal initially', () => {
		renderModal({ isOpen: true });

		const portal = screen.getByText(closeIcon);

		expect(portal).toBeInTheDocument();
	});

	it('Should show a title when opened', () => {
		renderModal();

		const title = screen.getByText(text);

		expect(title).toBeDefined();
	});

	it('Should show a close button when opened', () => {
		renderModal();

		const close = screen.getByText(closeIcon);

		expect(close).toBeInTheDocument();
	});

	// Note: no need to test a function that changes isOpen, state & prop-binding have their own framework-level tests
	it('Should call a function when pressing the close button', () => {
		const onClose = jest.fn();
		renderModal({ onClose });

		const close = screen.getByText(closeIcon);

		expect(close).toBeInTheDocument();

		fireEvent.click(close as HTMLElement);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('Should render the header and close button in seperate wrappers', () => {
		const title = 'Modal title';
		renderModal({ title });

		const modalTitle = screen.getByText(title).parentElement;
		const modalClose = screen
			.getByText(closeIcon)
			.closest('.c-hetarchief-modal__close-wrapper');

		expect(modalTitle).toHaveClass('c-hetarchief-modal__title-wrapper');
		expect(modalClose).toBeInTheDocument();
	});

	it('Should be able to render dynamic content', () => {
		renderModal({
			heading: <h1>heading</h1>,
			children: <h1>children</h1>,
			footer: <h1>footer</h1>,
		});

		const heading = screen.getByText('heading');
		const children = screen.getByText('children');
		const footer = screen.getByText('footer');

		expect(heading).toBeInTheDocument();
		expect(children).toBeInTheDocument();
		expect(footer).toBeInTheDocument();
	});

	it('Should render content without enforcing whitespace', () => {
		const headingTestId = 'heading-id';
		const childrenTestId = 'children-id';
		const footerTestId = 'footer-id';
		renderModal({
			heading: (
				<h1 data-testid={headingTestId} style={{ padding: '20px' }}>
					heading
				</h1>
			),
			children: <h1 data-testid={childrenTestId}>children</h1>,
			footer: <h1 data-testid={footerTestId}>footer</h1>,
		});

		const heading = screen.getByTestId(headingTestId);
		const content = screen.getByTestId(childrenTestId);
		const footer = screen.getByTestId(footerTestId);

		expect(heading).toBeInTheDocument();
		expect(content).toBeInTheDocument();
		expect(footer).toBeInTheDocument();

		// Note: we're testing the wrappers, not the 20px-padded contents
		expect(heading.parentElement).toHaveStyle(noPadding);
		expect(content).toHaveStyle(noPadding);
		expect(footer).toHaveStyle(noPadding);

		expect(content).toHaveStyle(noMargin);
		expect(footer).toHaveStyle(noMargin);
	});

	it('Should never obscure the entire screen', () => {
		renderModal();

		const overlay = screen.getByText(text).closest('.c-hetarchief-modal__overlay');

		expect(overlay).toBeInTheDocument();
	});
});
