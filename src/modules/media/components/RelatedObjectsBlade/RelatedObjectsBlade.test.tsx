import { render } from '@testing-library/react';

import { Icon, IconNamesLight } from '@shared/components';

import RelatedObjectsBlade from './RelatedObjectsBlade';
import { relatedObjectsBladeMock } from './__mocks__/related-objects-blade';

const renderRelatedObjectsBlade = ({ ...rest }) => {
	return render(<RelatedObjectsBlade {...relatedObjectsBladeMock} {...rest} />);
};

describe('Components', () => {
	describe('<RelatedObjectsBlade />', () => {
		it('Should set the correct class name', () => {
			const className = 'custom class name';
			const { container } = renderRelatedObjectsBlade({ className });

			expect(container.firstChild).toHaveClass(className);
		});

		it('Should render icon', () => {
			const icon = <Icon name={IconNamesLight.RelatedObjects} />;
			const { getByText } = renderRelatedObjectsBlade({ icon });

			const iconNode = getByText('related-objects');

			expect(iconNode).toBeInTheDocument();
			expect(iconNode).toHaveClass('c-icon');
		});

		it('Should render title', () => {
			const title = 'this is a title';
			const { getByText } = renderRelatedObjectsBlade({ title });

			const titleNode = getByText(title);

			expect(titleNode).toBeInTheDocument();
			expect(titleNode).toHaveClass('c-button__label');
		});

		it('Should render content', () => {
			const text = 'this is the content';
			const contentClass = 'custom-content-class';
			const renderContent = () => <p className={contentClass}>{text}</p>;
			const { getByText } = renderRelatedObjectsBlade({ renderContent });

			const contentNode = getByText(text);

			expect(contentNode).toBeInTheDocument();
			expect(contentNode).toHaveClass(contentClass);
		});

		it('Should pass props to content function', () => {
			const renderContent = jest.fn();
			renderRelatedObjectsBlade({ renderContent });

			expect(renderContent).toHaveBeenCalled();
			expect(renderContent).toHaveBeenCalledTimes(1);
			expect(renderContent).toHaveBeenCalledWith(true);
		});
	});
});
