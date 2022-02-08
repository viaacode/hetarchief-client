import { render } from '@testing-library/react';

import Metadata from './Metadata';
import { metadataMock } from './__mocks__/metadata';

const renderMetadata = ({ ...rest }) => {
	return render(<Metadata {...metadataMock} {...rest} />);
};

describe('Component: <Metadata /> (default)', () => {
	it('Should set the correct class name', () => {
		const className = 'custom class';
		const { container } = renderMetadata({ className });

		expect(container.firstChild).toHaveClass(className);
	});

	it('Should display metadata items', () => {
		const { getAllByRole } = renderMetadata({});

		const items = getAllByRole('listitem');

		expect(items.length).toBe(metadataMock.metadata.length);
	});

	it('Should display metadata title', () => {
		const titleMock = 'some title';
		const metadata = [
			{
				title: titleMock,
				data: 'some data',
			},
		];
		const { getByText } = renderMetadata({ metadata });

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
		const { getByText } = renderMetadata({ metadata });

		const data = getByText(dataMock);

		expect(data).toBeInTheDocument();
	});

	it('Should display metadata ReactNode data', () => {
		const dataMock = 'some-data';
		const metadata = [
			{
				title: 'title',
				data: <span className={dataMock}>{dataMock}</span>,
			},
		];
		const { getByText } = renderMetadata({ metadata });

		const data = getByText(dataMock);

		expect(data).toBeInTheDocument();
		expect(data).toHaveClass(dataMock);
	});

	it('Should display a single column by default', () => {
		const { getByRole } = renderMetadata({});

		const list = getByRole('list');

		expect(list).toHaveStyle('columns: 1');
	});

	it('Should display a multiple columns when given', () => {
		const columns = 2;
		const { getByRole } = renderMetadata({ columns });

		const list = getByRole('list');

		expect(list).toHaveStyle(`columns: ${columns}`);
	});
});
