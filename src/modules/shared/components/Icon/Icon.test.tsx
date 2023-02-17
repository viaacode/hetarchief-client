import { render, screen } from '@testing-library/react';

import Icon from './Icon';
import { IconNamesLight, IconNamesSolid } from './Icon.const';

const parseIconName = (name: IconNamesLight | IconNamesSolid): string => name.split('--')[0];

describe('Components', () => {
	describe('<Icon />', () => {
		it('Should display light icons', () => {
			const iconName = IconNamesSolid.Play;
			render(<Icon name={iconName} />);

			const icon = screen.queryByText(parseIconName(iconName));
			expect(icon).toBeInTheDocument();
		});

		it('Should display solid icons', () => {
			const iconName = IconNamesSolid.Trash;
			render(<Icon name={iconName} />);

			const icon = screen.queryByText(parseIconName(iconName));
			expect(icon).toHaveClass('c-icon--solid');
		});

		it('Should return null if icon is not found', () => {
			const iconName = 'not-a-real-icon';
			render(<Icon name={iconName as IconNamesSolid} />);

			const icon = screen.queryByText(iconName);
			expect(icon).not.toBeInTheDocument();
		});

		it('Should pass a className', () => {
			const customClass = 'c-custom-icon';
			const iconName = IconNamesLight.Bookmark;
			render(<Icon className={customClass} name={iconName} />);

			const icon = screen.queryByText(parseIconName(iconName));
			expect(icon).toHaveClass(customClass);
		});
	});
});
