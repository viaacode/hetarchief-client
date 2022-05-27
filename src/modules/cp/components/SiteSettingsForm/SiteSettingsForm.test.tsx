import { fireEvent, render } from '@testing-library/react';

import SiteSettingsForm from './SiteSettingsForm';
import { SITE_SETTINGS_FORM_MOCK } from './__mocks__/siteSettingsForm';

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

		it('Should show name', () => {
			const { getByText } = renderSiteSettingsForm({});

			const input = getByText(SITE_SETTINGS_FORM_MOCK.room.name ?? '');

			expect(input).toBeInTheDocument();
		});

		it('Should show slug', () => {
			const { getByDisplayValue } = renderSiteSettingsForm({});

			const input = getByDisplayValue(SITE_SETTINGS_FORM_MOCK.room.slug ?? '');

			expect(input).toBeInTheDocument();
		});

		it('Should show cancel save buttons', () => {
			const { getByDisplayValue, getByText } = renderSiteSettingsForm({});

			const input = getByDisplayValue(SITE_SETTINGS_FORM_MOCK.room.slug ?? '');

			fireEvent.change(input, { target: { value: 'slug' } });

			const cancel = getByText('Cancel');
			const save = getByText('Save');

			expect(cancel).toBeInTheDocument();
			expect(save).toBeInTheDocument();
		});
	});
});
