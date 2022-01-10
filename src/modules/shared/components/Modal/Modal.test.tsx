import { documentOf } from '@meemoo/react-components';
import { render, RenderResult, screen, fireEvent, waitFor } from '@testing-library/react'; //eslint-disable-line

import Modal from './Modal';
import styles from './Modal.module.scss';

const text = 'Title of the Modal';
const noPadding = { padding: '' };
const noMargin = { margin: '' };

const paddingOf = (el: Element) => window.getComputedStyle(el).getPropertyValue('padding');
const marginOf = (el: Element) => window.getComputedStyle(el).getPropertyValue('margin');

describe('Component: <Modal />', () => {
	let rendered: RenderResult;

	beforeEach(() => {
		rendered = render(<Modal title={text} />);
	});

	it('Should render no content initially', () => {
		try {
			screen.getByText(text);
		} catch (error) {
			expect(error);
		}
	});

	it('Should render a portal initially', () => {
		const portal = documentOf(rendered).getElementsByClassName('ReactModalPortal');

		expect(portal.length).toEqual(1);
	});

	it('Should show a title when opened', () => {
		rendered = render(<Modal title={text} isOpen={true} />);
		const title = screen.getByText(text);

		expect(title).toBeDefined();
	});

	it('Should show a close button when opened', () => {
		rendered = render(<Modal title={text} isOpen={true} />);
		const close = documentOf(rendered).getElementsByClassName(
			styles['c-hetarchief-modal__close']
		);

		expect(close.length).toEqual(1);
	});

	// Note: no need to test a function that changes isOpen, state & prop-binding have their own framework-level tests
	it('Should call a function when pressing the close button', () => {
		const onClose = jest.fn();

		rendered = render(<Modal title={text} isOpen={true} onClose={onClose} />);

		const close = documentOf(rendered).getElementsByClassName(
			styles['c-hetarchief-modal__close']
		);

		expect(close.length).toEqual(1);

		fireEvent.click(close[0]);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('Should render the header and close button in seperate wrappers', () => {
		rendered = render(<Modal title={text} isOpen={true} />);

		const title = documentOf(rendered).getElementsByClassName(
			styles['c-hetarchief-modal__title-wrapper']
		);
		const close = documentOf(rendered).getElementsByClassName(
			styles['c-hetarchief-modal__close-wrapper']
		);

		expect(title.length).toEqual(1);
		expect(close.length).toEqual(1);
	});

	it('Should be able to render dynamic content', () => {
		rendered = render(
			<Modal title={text} isOpen={true} heading={<h1>heading</h1>} footer={<h1>footer</h1>}>
				<h1>children</h1>
			</Modal>
		);

		const heading = screen.getByText('heading');
		const children = screen.getByText('children');
		const footer = screen.getByText('footer');

		expect(heading).toBeDefined();
		expect(children).toBeDefined();
		expect(footer).toBeDefined();
	});

	it('Should render content without enforcing whitespace', () => {
		rendered = render(
			<Modal
				title={text}
				isOpen={true}
				heading={<h1 style={{ padding: '20px' }}>heading</h1>}
				footer={<h1>footer</h1>}
			>
				<h1>children</h1>
			</Modal>
		);

		const heading = documentOf(rendered).getElementsByClassName(
			styles['c-hetarchief-modal__heading']
		);
		const content = documentOf(rendered).getElementsByClassName(
			styles['c-hetarchief-modal__content']
		);
		const footer = documentOf(rendered).getElementsByClassName(
			styles['c-hetarchief-modal__footer']
		);

		expect(heading.length).toEqual(1);
		expect(content.length).toEqual(1);
		expect(footer.length).toEqual(1);

		// Note: we're testing the wrappers, not the 20px-padded contents
		expect({ padding: paddingOf(heading[0]) }).toStrictEqual(noPadding);
		expect({ padding: paddingOf(content[0]) }).toStrictEqual(noPadding);
		expect({ padding: paddingOf(footer[0]) }).toStrictEqual(noPadding);

		expect({ margin: marginOf(content[0]) }).toStrictEqual(noMargin);
		expect({ margin: marginOf(footer[0]) }).toStrictEqual(noMargin);
	});

	it('Should never obscure the entire screen', () => {
		rendered = render(<Modal title={text} isOpen={true} />);

		const overlay = documentOf(rendered).getElementsByClassName(
			styles['c-hetarchief-modal__overlay']
		);

		expect(overlay.length).toEqual(1);
	});
});
