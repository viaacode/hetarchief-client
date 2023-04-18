import { fireEvent, render } from '@testing-library/react';

import { ContentPartnerResponse } from '@admin/types';

import SiteSettingsForm from './SiteSettingsForm';
import { SITE_SETTINGS_FORM_MOCK } from './__mocks__/siteSettingsForm';

jest.mock('@visitor-space/hooks/get-content-partner.ts', () => {
	return {
		useGetContentPartners: jest.fn((): ContentPartnerResponse => {
			return {
				items: [
					{
						name: 'VRT',
						id: 'OR-rf5kdfg',
					},
					{
						name: 'Industriemuseum',
						id: 'OR-rf5ksdf',
					},
					{
						name: 'Vlaams Parmelent',
						id: 'OR-rfghjdf',
					},
					{
						name: 'Huis van Alijn',
						id: 'OR-rffghdf',
					},
					{
						name: 'AMVB',
						id: 'OR-rfdfgdf',
					},
					{
						name: 'Amsab-ISG',
						id: 'OR-rsdfsdf',
					},
				],
			};
		}),
	};
});

const renderSiteSettingsForm = ({ ...rest }) => {
	return render(<SiteSettingsForm {...SITE_SETTINGS_FORM_MOCK} {...rest} />);
};

describe('Components', () => {
	describe('<SiteSettingsForm />', () => {
		it('Should set the correct class name', () => {
			const className = 'custom class name';
			const { container } = renderSiteSettingsForm({ className });

			expect(container.firstChild).toHaveClass(className);
		});

		// TODO figure out why the correct content partner is not selected in the dropdown
		// it('Should show name', () => {
		// 	const { getByDisplayValue } = renderSiteSettingsForm({});
		//
		// 	const input = getByDisplayValue(SITE_SETTINGS_FORM_MOCK.space.name ?? '');
		//
		// 	expect(input).toBeInTheDocument();
		// });

		it('Should show slug', () => {
			const { getByDisplayValue } = renderSiteSettingsForm({});

			const input = getByDisplayValue(SITE_SETTINGS_FORM_MOCK.space.slug ?? '');

			expect(input).toBeInTheDocument();
		});

		it('Should show cancel save buttons', () => {
			const { getByDisplayValue, getByText } = renderSiteSettingsForm({});

			const input = getByDisplayValue(SITE_SETTINGS_FORM_MOCK.space.slug ?? '');

			fireEvent.change(input, { target: { value: 'slug' } });

			const cancel = getByText('Cancel');
			const save = getByText('Save');

			expect(cancel).toBeInTheDocument();
			expect(save).toBeInTheDocument();
		});
	});
});
