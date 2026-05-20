import { render } from '@testing-library/react';

import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';

import {
	getIeObjectAvRightsIcon,
	getIeObjectAvRightsLabel,
	getIeObjectAvRightsUrl,
} from './get-ie-object-av-rights-icon';

describe('getIeObjectAvRightsIcon', () => {
	it('returns the protected rights statement logo for protected AV rights', () => {
		const { container } = render(
			getIeObjectAvRightsIcon({ reuseLabel: 'auteursrechtelijk beschermd' })
		);

		expect(container).toHaveTextContent('copyright');
	});

	it('returns the protected rights statement logo for individualized attribution labels', () => {
		const { container } = render(getIeObjectAvRightsIcon({ reuseLabel: '© Vlaams Parlement' }));

		expect(container).toHaveTextContent('copyright');
	});

	it('uses the KG label as display label for individualized attribution labels', () => {
		const rightsInfo = {
			reuseLabel: '© Vlaams Parlement',
			reuseCategoryUrl: 'https://rightsstatements.org/page/InC/1.0/',
		};

		expect(getIeObjectAvRightsLabel(rightsInfo)).toBe('© Vlaams Parlement');
		expect(getIeObjectAvRightsUrl(rightsInfo)).toBe('https://rightsstatements.org/page/InC/1.0/');
	});

	it('returns the undetermined icon for unclear or unlocatable AV rights', () => {
		const { container } = render(
			getIeObjectAvRightsIcon({
				reuseLabel: 'rechthebbende niet vindbaar of niet lokaliseerbaar',
				reuseCategoryId: 'https://rightsstatements.org/page/InC-RUU/1.0/?language=nl',
			})
		);

		expect(container).toHaveTextContent('copyright-undetermined');
	});

	it('returns the public domain icon for CC0 AV rights', () => {
		const { container } = render(getIeObjectAvRightsIcon({ reuseLabel: 'CC0' }));

		expect(container).toHaveTextContent('copyright-public-domain');
	});

	it('returns no icon when no rights information is available', () => {
		const { container } = render(
			getIeObjectAvRightsIcon({ reuseLabel: 'geen rechteninformatie beschikbaar' })
		);

		expect(container).toBeEmptyDOMElement();
	});
});
