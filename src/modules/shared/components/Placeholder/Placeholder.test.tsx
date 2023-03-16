import { render, screen } from '@testing-library/react';

import { IconNamesLight, IconNamesSolid, IconTypes } from '@shared/components';

import Placeholder from './Placeholder';

const parseIconName = (name: IconNamesLight | IconNamesSolid): string => name.split('--')[0];

const props = {
	title: 'Placeholder title',
	description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
};

describe('Components', () => {
	describe('<Placeholder />', () => {
		it('Should display an icon', () => {
			const iconName = IconNamesLight.Search;
			const { rerender, queryByText } = render(<Placeholder icon={iconName} {...props} />);

			const icon1 = queryByText(parseIconName(iconName));
			expect(icon1).toBeInTheDocument();

			const iconObj = { name: IconNamesSolid.Lock } as IconTypes;
			rerender(<Placeholder icon={iconObj} {...props} />);

			const icon2 = queryByText(parseIconName(iconObj.name));
			expect(icon2).toBeInTheDocument();
		});

		it('Should display an image', () => {
			const imgAlt = 'This is an image';
			render(<Placeholder img="/path/to/img" imgAlt={imgAlt} {...props} />);

			const image = screen.queryByAltText(imgAlt);
			expect(image).toBeInTheDocument();
		});

		it('Should display a title', () => {
			render(<Placeholder {...props} />);

			const title = screen.queryByText(props.title);
			expect(title).toBeInTheDocument();
		});

		it('Should display a description', () => {
			render(<Placeholder {...props} />);

			const descr = screen.queryByText(props.description);
			expect(descr).toBeInTheDocument();
		});

		it('Should pass a className', () => {
			const customClass = 'c-custom-placeholder';
			render(<Placeholder className={customClass} {...props} />);

			const title = screen.queryByText(props.title);
			expect(title?.parentElement).toHaveClass(customClass);
		});
	});
});
