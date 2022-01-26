import { render, screen } from '@testing-library/react';

import reactI18nextMock from '../../../../__mocks__/react-i18next';

import Hero from './Hero';
import { heroDescription, heroImage, heroLink, heroMock, heroTitle } from './__mocks__/hero';

reactI18nextMock.mock('react-i18next');

describe('Component: <Hero /> (default)', () => {
	beforeEach(() => {
		render(<Hero {...heroMock} />);
	});

	it('Should render the hero title', () => {
		const title = screen.getByText(heroTitle);

		expect(title).toBeDefined();
	});

	it('Should render the hero description', () => {
		const description = screen.getByText(heroDescription);

		expect(description).toBeDefined();
	});

	it('Should render the hero link', () => {
		const link = screen.getByText(heroLink.label);

		expect(link).toBeDefined();
	});

	it('Should set the link destination', () => {
		const link = screen.getByText(heroLink.label);

		expect(link).toHaveAttribute('href', 'https://www.test.com');
	});

	it('should set the link default target attribute', () => {
		const link = screen.getByText(heroLink.label);

		expect(link).toHaveAttribute('target', '_self');
	});

	it('should set the link external target attribute', () => {
		const label = 'label';

		render(
			<Hero
				title={heroTitle}
				description={heroDescription}
				link={{ label: label, to: '/', external: true }}
				image={heroImage}
			/>
		);

		const link = screen.getByText(label);

		expect(link).toHaveAttribute('target', '_blank');
	});

	it('Should render the hero image', () => {
		const image = screen.getByAltText(heroImage.alt);

		expect(image).toBeDefined();
	});
});
