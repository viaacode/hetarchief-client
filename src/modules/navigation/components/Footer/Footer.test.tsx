import { render, screen } from '@testing-library/react';

import Footer from './Footer';
import { footerTestLinks } from './__mocks__/footer';

// Default

describe('Component: <Footer /> (default)', () => {
	beforeEach(() => {
		render(<Footer linkSections={footerTestLinks} />);
	});

	it('Should render meemoo reference', () => {
		const text = screen.getByText('een initiatief-van ***');
		const image = screen.getByAltText('meemoo logo ***');

		expect(text).toBeInTheDocument();
		expect(image).toBeInTheDocument();
	});

	it('should set the href attribute on the meemoo reference', () => {
		const link = screen.getByAltText('meemoo logo ***').closest('a');

		expect(link).toHaveAttribute('href', 'https://meemoo.be');
	});

	it('should set the target attribute on the meemoo reference', () => {
		const link = screen.getByAltText('meemoo logo ***').closest('a');

		expect(link).toHaveAttribute('target', '_blank');
	});

	it('Should render vlaanderen reference', () => {
		const text = screen.getByText('gesteund door ***');
		const image = screen.getByAltText('vlaanderen logo ***');

		expect(text).toBeInTheDocument();
		expect(image).toBeInTheDocument();
	});

	it('should set the href attribute on the vlaanderen reference', () => {
		const link = screen.getByAltText('vlaanderen logo ***').closest('a');

		expect(link).toHaveAttribute('href', 'https://www.vlaanderen.be');
	});

	it('should set the target attribute on the vlaanderen reference', () => {
		const link = screen.getByAltText('vlaanderen logo ***').closest('a');

		expect(link).toHaveAttribute('target', '_blank');
	});

	it('should render 3 links', () => {
		const links = screen.getAllByText('link');

		expect(links.length).toBe(9);
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
