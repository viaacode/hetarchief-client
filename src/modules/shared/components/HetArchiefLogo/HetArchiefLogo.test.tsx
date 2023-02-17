import { render, screen } from '@testing-library/react';

import HetArchiefLogo from './HetArchiefLogo';
import { HetArchiefLogoType } from './HetArchiefLogo.const';

describe('Components', () => {
	describe('<HetArchiefLogo />', () => {
		const title = 'hetarchief.be - een initiatief van meemoo (logo)';

		it('Should render the meemoo logo', () => {
			render(<HetArchiefLogo />);
			const logo = screen.getByText(title);

			expect(logo).toBeInTheDocument();
		});

		it('Should pass a custom className', () => {
			const customClass = 'c-custom-logo-class';
			const { container: logo } = render(<HetArchiefLogo className={customClass} />);

			expect(logo.firstChild).toHaveClass(customClass);
		});

		it('Should set the correct logo type - light', () => {
			const type = HetArchiefLogoType.Light;
			const customClass = 'c-custom-logo-class';
			const { container: logo } = render(
				<HetArchiefLogo type={type} className={customClass} />
			);

			expect(logo.querySelector('#type-1')?.getAttribute('fill')).toEqual(type);
			expect(logo.querySelector('#type-2')?.getAttribute('fill')).toEqual(type);
		});

		it('Should set the correct logo type - dark', () => {
			const type = HetArchiefLogoType.Dark;
			const customClass = 'c-custom-logo-class';
			const { container: logo } = render(
				<HetArchiefLogo type={type} className={customClass} />
			);

			expect(logo.querySelector('#type-1')?.getAttribute('fill')).toEqual(type);
			expect(logo.querySelector('#type-2')?.getAttribute('fill')).toEqual(type);
		});
	});
});
