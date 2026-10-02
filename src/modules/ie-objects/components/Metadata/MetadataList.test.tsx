import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Metadata from './Metadata';
import MetadataList from './MetadataList';

const renderList = (props: { noDivider?: boolean; grow?: boolean }) =>
	render(
		<MetadataList allowTwoColumns={false} {...props}>
			<Metadata title="Title" key="title">
				Content
			</Metadata>
		</MetadataList>
	);

describe('<MetadataList />', () => {
	it('keeps the divider and does not grow by default', () => {
		const { container } = renderList({});

		expect(container.firstChild).not.toHaveClass('c-metadata--no-divider');
		expect(container.firstChild).not.toHaveClass('c-metadata--grow');
	});

	it('adds the no-divider modifier', () => {
		const { container } = renderList({ noDivider: true });

		expect(container.firstChild).toHaveClass('c-metadata--no-divider');
	});

	it('adds the grow modifier', () => {
		const { container } = renderList({ grow: true });

		expect(container.firstChild).toHaveClass('c-metadata--grow');
	});
});
