import { render, screen } from '@testing-library/react';

import Logo from './Logo';
import { LogoType } from './Logo.const';

describe('Components', () => {
	describe('<Logo />', () => {
		const title = 'hetarchief.be - een initiatief van meemoo (logo)';

		it('Should render the meemoo logo', () => {
			render(<Logo />);
			const logo = screen.getByText(title);

			expect(logo).toBeInTheDocument();
		});

		it('Should pass a custom className', () => {
			const customClass = 'c-custom-logo-class';
			const { container: logo } = render(<Logo className={customClass} />);

			expect(logo.firstChild).toHaveClass(customClass);
		});

		it('Should set the correct logo type - light', () => {
			const type = LogoType.Light;
			const customClass = 'c-custom-logo-class';
			const { container: logo } = render(<Logo type={type} className={customClass} />);

			expect(logo.querySelector('#type-1')?.getAttribute('fill')).toEqual(type);
			expect(logo.querySelector('#type-2')?.getAttribute('fill')).toEqual(type);
		});

		it('Should set the correct logo type - dark', () => {
			const type = LogoType.Dark;
			const customClass = 'c-custom-logo-class';
			const { container: logo } = render(<Logo type={type} className={customClass} />);

			expect(logo.querySelector('#type-1')?.getAttribute('fill')).toEqual(type);
			expect(logo.querySelector('#type-2')?.getAttribute('fill')).toEqual(type);
		});
	});
});
