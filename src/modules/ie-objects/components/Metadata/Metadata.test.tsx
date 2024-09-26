import { render } from '@testing-library/react';

import {
	type MetadataItem,
	type MetadataListProps,
} from '@ie-objects/components/Metadata/Metadata.types';
import MetadataList from '@ie-objects/components/Metadata/MetadataList';

import '@testing-library/jest-dom';
import Metadata from './Metadata';
import { metadataMock } from './__mocks__/metadata';

const renderMetadataList = ({ ...args }: Partial<MetadataListProps>, metadata: MetadataItem[]) => {
	return render(
		<MetadataList {...(args as MetadataListProps)}>
			{metadata.map((item, index) => {
				return (
					<Metadata title={item.title} key={`metadata-item-${index}`}>
						{item.data}
					</Metadata>
				);
			})}
		</MetadataList>
	);
};

describe('Component: <MetadataList /> (default)', () => {
	it('Should set the correct class name', () => {
		const className = 'custom class';
		const { container } = renderMetadataList(
			{ className, allowTwoColumns: false },
			metadataMock
		);

		expect(container.firstChild).toHaveClass(className);
	});

	it('Should display metadata items', () => {
		const { getAllByRole } = renderMetadataList({ allowTwoColumns: false }, metadataMock);

		const items = getAllByRole('listitem');

		expect(items.length).toBe(metadataMock.length);
	});

	it('Should display metadata title', () => {
		const titleMock = 'some title';
		const metadata = [
			{
				title: titleMock,
				data: 'some data',
			},
		];
		const { getByText } = renderMetadataList({ allowTwoColumns: false }, metadata);

		const title = getByText(titleMock);

		expect(title).toBeInTheDocument();
	});

	it('Should display metadata string data', () => {
		const dataMock = 'some data';
		const metadata = [
			{
				title: 'title',
				data: dataMock,
			},
		];
		const { getByText } = renderMetadataList({ allowTwoColumns: false }, metadata);

		const data = getByText(dataMock);

		expect(data).toBeInTheDocument();
	});

	it('Should display metadata ReactNode data', () => {
		const dataMock = 'some-data';
		const metadata = [
			{
				title: 'title',
				data: <span className={dataMock}>{dataMock}</span>,
			} as unknown as MetadataItem,
		];
		const { getByText } = renderMetadataList({ allowTwoColumns: false }, metadata);

		const data = getByText(dataMock);

		expect(data).toBeInTheDocument();
		expect(data).toHaveClass(dataMock);
	});

	it('Should display a multiple columns by default', () => {
		const { getByRole } = renderMetadataList({ allowTwoColumns: true }, metadataMock);

		const list = getByRole('list').parentElement;

		expect(list).toHaveClass(`c-metadata--container-query`);
	});

	it('Should display a single column when given', () => {
		const { getByRole } = renderMetadataList({ allowTwoColumns: false }, metadataMock);

		const list = getByRole('list').parentElement;

		expect(list).not.toHaveClass(`c-metadata--container-query`);
	});
});
