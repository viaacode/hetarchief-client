import { jest } from '@jest/globals';
import { render } from '@testing-library/react';
import React, { type ReactNode } from 'react';

import type { CollapsableBladeProps } from '@ie-objects/components/CollapsableBlade';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';

import CollapsableBlade from './CollapsableBlade';
import { collapsableBladeMock } from './__mocks__/CollapsedBlade.mock';

import '@testing-library/jest-dom';

const renderCollapsableBlade = (props: Partial<CollapsableBladeProps>) => {
	return render(<CollapsableBlade {...collapsableBladeMock} {...props} />);
};

describe('Components', () => {
	describe('<CollapsableBlade />', () => {
		it('Should set the correct class name', () => {
			const className = 'custom class name';
			const { container } = renderCollapsableBlade({ className });

			expect(container.firstChild).toHaveClass(className);
		});

		it('Should render icon', () => {
			const icon = <Icon name={IconNamesLight.RelatedObjects} />;
			const { getByText } = renderCollapsableBlade({ icon });

			const iconNode = getByText('related-objects');

			expect(iconNode).toBeInTheDocument();
			expect(iconNode).toHaveClass('c-icon');
		});

		it('Should render title', () => {
			const title = 'this is a title';
			const { getByText } = renderCollapsableBlade({ title });

			const titleNode = getByText(title);

			expect(titleNode).toBeInTheDocument();
			expect(titleNode).toHaveClass('c-button__label');
		});

		it('Should render content', () => {
			const text = 'this is the content';
			const contentClass = 'custom-content-class';
			const renderContent = () => <p className={contentClass}>{text}</p>;
			const { getByText } = renderCollapsableBlade({ renderContent });

			const contentNode = getByText(text);

			expect(contentNode).toBeInTheDocument();
			expect(contentNode).toHaveClass(contentClass);
		});

		it('Should pass props to content function', () => {
			const renderContent = jest.fn() as (hidden: boolean) => ReactNode;
			renderCollapsableBlade({
				renderContent,
				isOpen: false,
				setIsOpen: () => {},
			});

			expect(renderContent).toHaveBeenCalled();
			expect(renderContent).toHaveBeenCalledTimes(1);
			expect(renderContent).toHaveBeenCalledWith(true);
		});
	});
});
