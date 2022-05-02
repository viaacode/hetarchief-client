import { FC } from 'react';
import { components } from 'react-select';

import { TagSearchBarValueContainerProps } from './TagSearchBarValueContainer.types';

const { ValueContainer } = components;

const TagSearchBarValueContainer: FC<TagSearchBarValueContainerProps> = ({
	children,
	...valueContainerProps
}) => {
	const { hasValue, selectProps } = valueContainerProps;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const { valuePlaceholder } = selectProps;
	const showPlaceholder = hasValue && valuePlaceholder;

	return (
		<ValueContainer {...valueContainerProps}>
			{showPlaceholder && (
				<span className="c-tag-search-bar__value-placeholder">{valuePlaceholder}</span>
			)}
			{children}
		</ValueContainer>
	);
};

export default TagSearchBarValueContainer;
