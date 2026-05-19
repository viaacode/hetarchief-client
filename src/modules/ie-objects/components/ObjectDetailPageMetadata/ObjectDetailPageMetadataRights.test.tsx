import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';

import { ObjectDetailPageMetadataRights } from './ObjectDetailPageMetadataRights';

describe('Component: <ObjectDetailPageMetadataRights />', () => {
	it('renders the rights label as a link with optional rights metadata', () => {
		render(
			<ObjectDetailPageMetadataRights
				title="Rechten"
				label="CC0"
				labelUrl="https://creativecommons.org/publicdomain/zero/1.0/"
				moreInfoUrl="/vragen?item=%2Fwat-kan-ik-met-het-materiaal-dat-ik-gevonden-heb-doen"
				moreInfoTitle="Meer info over de rechten van dit object"
				copyrightHolder="SABAM"
				copyrightHolderLabel="Rechthebbende"
				licenseDistributor="VRT"
				licenseDistributorLabel="Licentiegever"
			/>
		);

		expect(screen.getByText('Rechten')).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'CC0' })).toHaveAttribute(
			'href',
			'https://creativecommons.org/publicdomain/zero/1.0/'
		);
		expect(screen.getByText(/Rechthebbende:/)).toBeInTheDocument();
		expect(screen.getByText('SABAM')).toBeInTheDocument();
		expect(screen.getByText(/Licentiegever:/)).toBeInTheDocument();
		expect(screen.getByText('VRT')).toBeInTheDocument();
	});

	it('renders the rights label as text when no label URL is available', () => {
		const { container } = render(
			<ObjectDetailPageMetadataRights
				title="Rechten"
				label="geen rechteninformatie beschikbaar"
				moreInfoTitle="Meer info over de rechten van dit object"
			/>
		);

		expect(screen.getByText('geen rechteninformatie beschikbaar')).toBeInTheDocument();
		expect(container.querySelector('a')).not.toBeInTheDocument();
	});
});
