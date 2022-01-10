import { render, screen } from '@testing-library/react';

import TabLabel from './TabLabel';
import { TabLabelProps } from './TabLabel.types';

const mockLabel = 'Audio';
const renderTabLabel = ({ label = mockLabel, ...rest }: Partial<TabLabelProps> = {}) =>
	render(<TabLabel {...rest} label={label} />);

describe('Components', () => {
	describe('<TabLabel />', () => {
		it('Should render a label', () => {
			renderTabLabel();

			const tabLabel = screen.queryByText(mockLabel);
			expect(tabLabel).toBeInTheDocument();
		});

		it('Should render a count when given', () => {
			renderTabLabel({ count: 52 });

			const tabLabel = screen.queryByText('(52)');
			expect(tabLabel).toBeInTheDocument();
		});
	});
});
