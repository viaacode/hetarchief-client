import { render, screen } from '@testing-library/react';

import Footer from './Footer';
import { footerLeftItem, footerLinks, footerRightItem } from './__mocks__';

const feedbackMock = jest.fn();

// Default

describe('Component: <Footer /> (default)', () => {
	beforeEach(() => {
		render(
			<Footer links={footerLinks} leftItem={footerLeftItem} rightItem={footerRightItem} />
		);
	});

	it('Should render meemoo reference', () => {
		const text = screen.getByText('Een initiatief van');
		const image = screen.getByAltText('Meemoo logo');

		expect(text).toBeInTheDocument();
		expect(image).toBeInTheDocument();
	});

	it('should set the href attribute on the meemoo reference', () => {
		const link = screen.getByAltText('Meemoo logo').closest('a');

		expect(link).toHaveAttribute('href', 'https://www.test.com');
	});

	it('should set the target attribute on the meemoo reference', () => {
		const link = screen.getByAltText('Meemoo logo').closest('a');

		expect(link).toHaveAttribute('target', '_blank');
	});

	it('Should render vlaanderen reference', () => {
		const text = screen.getByText('Gesteund door');
		const image = screen.getByAltText('Vlaanderen logo');

		expect(text).toBeInTheDocument();
		expect(image).toBeInTheDocument();
	});

	it('should set the href attribute on the vlaanderen reference', () => {
		const link = screen.getByAltText('Vlaanderen logo').closest('a');

		expect(link).toHaveAttribute('href', 'https://www.test.com');
	});

	it('should set the target attribute on the vlaanderen reference', () => {
		const link = screen.getByAltText('Vlaanderen logo').closest('a');

		expect(link).toHaveAttribute('target', '_blank');
	});

	it('should render 3 links', () => {
		const links = screen.getAllByText('link');

		expect(links.length).toBe(3);
	});

	it('should set the href attribute on the links', () => {
		const links = screen.getAllByText('link');

		links.forEach((link) => {
			expect(link).toHaveAttribute('href', 'https://www.test.com');
		});
	});

	it('should set the target attribute on the links', () => {
		const links = screen.getAllByText('link');

		expect(links[0]).toHaveAttribute('target', '_blank');
		expect(links[1]).toHaveAttribute('target', '_self');
	});
});

// Simple

describe('Component: <Footer /> (simple)', () => {
	beforeEach(() => {
		render(<Footer leftItem={footerLeftItem} rightItem={footerRightItem} />);
	});

	it('Should render meemoo reference', () => {
		const text = screen.getByText('Een initiatief van');
		const image = screen.getByAltText('Meemoo logo');

		expect(text).toBeInTheDocument();
		expect(image).toBeInTheDocument();
	});

	it('should set the href attribute on the meemoo reference', () => {
		const link = screen.getByAltText('Meemoo logo').closest('a');

		expect(link).toHaveAttribute('href', 'https://www.test.com');
	});

	it('should set the target attribute on the meemoo reference', () => {
		const link = screen.getByAltText('Meemoo logo').closest('a');

		expect(link).toHaveAttribute('target', '_blank');
	});

	it('Should render vlaanderen reference', () => {
		const text = screen.getByText('Gesteund door');
		const image = screen.getByAltText('Vlaanderen logo');

		expect(text).toBeInTheDocument();
		expect(image).toBeInTheDocument();
	});

	it('should set the href attribute on the vlaanderen reference', () => {
		const link = screen.getByAltText('Vlaanderen logo').closest('a');

		expect(link).toHaveAttribute('href', 'https://www.test.com');
	});

	it('should set the target attribute on the vlaanderen reference', () => {
		const link = screen.getByAltText('Vlaanderen logo').closest('a');

		expect(link).toHaveAttribute('target', '_blank');
	});

	it('should not render any links', () => {
		const links = screen.queryAllByText('link');

		expect(links[0]).toBeUndefined();
	});
});

// Feedback

describe('Component: <Footer /> (feedback)', () => {
	beforeEach(() => {
		render(
			<Footer
				links={footerLinks}
				leftItem={footerLeftItem}
				rightItem={footerRightItem}
				onClickFeedback={feedbackMock}
			/>
		);
	});

	it('Should render meemoo reference', () => {
		const text = screen.getByText('Een initiatief van');
		const image = screen.getByAltText('Meemoo logo');

		expect(text).toBeInTheDocument();
		expect(image).toBeInTheDocument();
	});

	it('should set the href attribute on the meemoo reference', () => {
		const link = screen.getByAltText('Meemoo logo').closest('a');

		expect(link).toHaveAttribute('href', 'https://www.test.com');
	});

	it('should set the target attribute on the meemoo reference', () => {
		const link = screen.getByAltText('Meemoo logo').closest('a');

		expect(link).toHaveAttribute('target', '_blank');
	});

	it('Should render vlaanderen reference', () => {
		const text = screen.getByText('Gesteund door');
		const image = screen.getByAltText('Vlaanderen logo');

		expect(text).toBeInTheDocument();
		expect(image).toBeInTheDocument();
	});

	it('should render 3 links', () => {
		const links = screen.getAllByText('link');

		expect(links.length).toBe(3);
	});

	it('should set the href attribute on the links', () => {
		const links = screen.getAllByText('link');

		links.forEach((link) => {
			expect(link).toHaveAttribute('href', 'https://www.test.com');
		});
	});

	it('should set the target attribute on the links', () => {
		const links = screen.getAllByText('link');

		expect(links[0]).toHaveAttribute('target', '_blank');
		expect(links[1]).toHaveAttribute('target', '_self');
	});

	it('should render feedback button', () => {
		const button = screen.getByText('Feedback');

		expect(button).toBeInTheDocument();
	});

	it('should call onClickFeedback when the feedback button is clicked', () => {
		const button = screen.getByText('Feedback');

		button.click();

		expect(feedbackMock).toHaveBeenCalled();
	});
});
