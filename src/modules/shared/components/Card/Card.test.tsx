import { render, RenderResult, screen } from '@testing-library/react'; //eslint-disable-line

import { documentOf } from '@shared/utils';

import Card from './Card';
import { galaxy, title } from './Card.mock';
import styles from './Card.module.scss';

const subtitle = '(1 Dec. 2021)';
const toolbar = 'Toolbar content';
const children = 'Dynamic content';

describe('Component: <Card />', () => {
	let rendered: RenderResult;

	beforeEach(() => {
		rendered = render(
			<Card image={galaxy} title={title} subtitle={subtitle} toolbar={toolbar}>
				{children}
			</Card>
		);
	});

	it('Should show a title', () => {
		expect(screen.getByText(title)).toBeDefined();
	});

	it('Should show a subtitle', () => {
		expect(screen.getByText(subtitle)).toBeDefined();
	});

	it('Should render toolbar content', () => {
		expect(screen.getByText(toolbar)).toBeDefined();
	});

	it('Should render dynamic content', () => {
		expect(screen.getByText(children)).toBeDefined();
	});

	it('Should render an image', () => {
		const element = documentOf(rendered).getElementsByClassName(
			styles['c-card__image-wrapper']
		);

		expect(element.length).toEqual(1);
	});

	it('Should apply the zinc edge by default', () => {
		const element = documentOf(rendered).getElementsByClassName(styles['c-card--edge-zinc']);

		expect(element.length).toEqual(1);
	});

	it('Should apply the vertical orientation by default', () => {
		const element = documentOf(rendered).getElementsByClassName(
			styles['c-card--orientation-vertical']
		);

		expect(element.length).toEqual(1);
	});

	it('Should not apply padding by default', () => {
		const element = documentOf(rendered).getElementsByClassName(styles['c-card--padded-none']);

		expect(element.length).toEqual(1);
	});
});
