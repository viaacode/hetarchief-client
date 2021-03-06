import { render, screen } from '@testing-library/react';

import Icon from './Icon';
import { IconSolidNames } from './Icon.types';

describe('Components', () => {
	describe('<Icon />', () => {
		it('Should display light icons', () => {
			const iconName = 'play';
			render(<Icon name={iconName} />);

			const icon = screen.queryByText(iconName);
			expect(icon).toBeInTheDocument();
		});

		it('Should display solid icons', () => {
			const iconName = 'trash';
			render(<Icon name={iconName} type="solid" />);

			const icon = screen.queryByText(iconName);
			expect(icon).toHaveClass('c-icon--solid');
		});

		it('Should return null if icon is not found', () => {
			const iconName = 'not-a-real-icon';
			render(<Icon name={iconName as IconSolidNames} type="solid" />);

			const icon = screen.queryByText(iconName);
			expect(icon).not.toBeInTheDocument();
		});

		it('Should pass a className', () => {
			const customClass = 'c-custom-icon';
			const iconName = 'bookmark';
			render(<Icon className={customClass} name={iconName} />);

			const icon = screen.queryByText(iconName);
			expect(icon).toHaveClass(customClass);
		});
	});
});
