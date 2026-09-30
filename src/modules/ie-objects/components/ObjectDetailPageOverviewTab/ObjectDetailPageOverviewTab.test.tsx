import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import type { HetArchiefIeObject } from '@viaa/avo2-types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
	isKiosk: false,
	user: null as { permissions: string[] } | null,
	previousNext: undefined as
		| { previousIeObjectId: string | null; nextIeObjectId: string | null }
		| undefined,
}));

vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string) => key,
	tHtml: (key: string) => key,
}));
vi.mock('next/router', () => ({ useRouter: () => ({ query: { slug: 'vrt' } }) }));
vi.mock('react-redux', () => ({ useSelector: () => state.user }));
vi.mock('@shared/hooks/use-locale/use-locale', () => ({ useLocale: () => 'nl' }));
vi.mock('@shared/hooks/has-group', () => ({ useHasAnyGroup: () => state.isKiosk }));
vi.mock('@ie-objects/hooks/use-get-ie-object-previous-next-ids', () => ({
	useGetIeObjectPreviousNextIds: () => ({ data: state.previousNext }),
}));
vi.mock('@ie-objects/components/SearchLinkTag/SearchLinkTag', () => ({
	SearchLinkTag: ({ label }: { label: string }) => <span data-testid="search-tag">{label}</span>,
}));
vi.mock(
	'@ie-objects/components/ObjectDetailPageMetadataTab/ObjectDetailPageMetadataThemes',
	() => ({
		ObjectDetailPageMetadataThemes: () => <div data-testid="themes" />,
	})
);
vi.mock('@ie-objects/components/IeObjectCardList/IeObjectCardList', () => ({
	IeObjectCardList: ({ type }: { type: string }) => <div data-testid={`cards-${type}`} />,
}));
vi.mock(
	'@shared/components/MetaDataFieldWithHighlightingAndMaxLength/MetaDataFieldWithHighlightingAndMaxLength',
	() => ({ default: ({ data }: { data: string }) => <span>{data}</span> })
);

import { Permission } from '@account/const';
import type { MediaObject } from '@ie-objects/components/RelatedObject';
import { HetArchiefIeObjectLicense, HetArchiefIeObjectType } from '@viaa/avo2-types';
import { ObjectDetailPageOverviewTab } from './ObjectDetailPageOverviewTab';

const baseObject = {
	maintainerId: 'OR-1',
	maintainerName: 'VRT',
	maintainerLogo: null,
	maintainerDescription: null,
	maintainerSiteUrl: null,
	dctermsFormat: HetArchiefIeObjectType.VIDEO,
	licenses: [],
	themes: [],
	keywords: [],
	copyrightHolder: null,
	collectionName: null,
	collectionId: null,
	datePublished: null,
	schemaIdentifier: 'pid',
	iri: 'iri',
} as unknown as HetArchiefIeObject;

const similar: MediaObject[] = [{ id: 'a', title: 'a', subtitle: '', description: '', type: null }];

const renderTab = (
	mediaInfo: Partial<HetArchiefIeObject> = {},
	props: { similar?: MediaObject[] } = {}
) =>
	render(
		<ObjectDetailPageOverviewTab
			mediaInfo={{ ...baseObject, ...mediaInfo } as HetArchiefIeObject}
			visitRequest={null}
			similar={props.similar ?? []}
			onReadMoreClicked={vi.fn()}
		/>
	);

describe('Component: <ObjectDetailPageOverviewTab />', () => {
	beforeEach(() => {
		state.isKiosk = false;
		state.user = null;
		state.previousNext = undefined;
	});

	it('renders nothing without media info', () => {
		const { container } = render(
			<ObjectDetailPageOverviewTab
				mediaInfo={null}
				visitRequest={null}
				similar={[]}
				onReadMoreClicked={vi.fn()}
			/>
		);

		expect(container).toBeEmptyDOMElement();
	});

	describe('maintainer', () => {
		it('links the maintainer to its search results', () => {
			renderTab();

			expect(screen.getByTestId('search-tag')).toHaveTextContent('VRT');
		});

		it('hides the maintainer link and details for kiosk visitors', () => {
			state.isKiosk = true;
			renderTab({ maintainerDescription: 'Omroep', maintainerSiteUrl: 'https://vrt.be' });

			expect(screen.queryByTestId('search-tag')).not.toBeInTheDocument();
			expect(screen.queryByText('Omroep')).not.toBeInTheDocument();
			expect(screen.queryByText('https://vrt.be')).not.toBeInTheDocument();
		});

		it('shows the maintainer site for other visitors', () => {
			renderTab({ maintainerSiteUrl: 'https://vrt.be' });

			expect(screen.getByRole('link', { name: 'https://vrt.be' })).toHaveAttribute(
				'href',
				'https://vrt.be'
			);
		});
	});

	describe('themes', () => {
		const themes = [{ id: 't1' }] as unknown as HetArchiefIeObject['themes'];

		it('shows for public content with at least one theme', () => {
			renderTab({ themes, licenses: [HetArchiefIeObjectLicense.PUBLIEK_CONTENT] });

			expect(screen.getByTestId('themes')).toBeInTheDocument();
		});

		it.each([
			['the content is not public', { themes, licenses: [] }],
			[
				'there are no themes',
				{ themes: [], licenses: [HetArchiefIeObjectLicense.PUBLIEK_CONTENT] },
			],
		])('is hidden when %s', (_label, mediaInfo) => {
			renderTab(mediaInfo);

			expect(screen.queryByTestId('themes')).not.toBeInTheDocument();
		});

		it('is hidden for kiosk visitors', () => {
			state.isKiosk = true;
			renderTab({ themes, licenses: [HetArchiefIeObjectLicense.PUBLIEK_CONTENT] });

			expect(screen.queryByTestId('themes')).not.toBeInTheDocument();
		});
	});

	describe('previous and next newspaper', () => {
		const newspaper = {
			dctermsFormat: HetArchiefIeObjectType.NEWSPAPER,
			collectionId: 'col',
			collectionName: 'De Standaard',
			datePublished: '1918-11-11',
		};

		it('links to the neighbouring newspapers of the series', () => {
			state.previousNext = { previousIeObjectId: 'prev', nextIeObjectId: 'next' };
			renderTab(newspaper);

			const links = screen.getAllByRole('link');
			expect(links.map((link) => link.getAttribute('href'))).toEqual(
				expect.arrayContaining(['/pid/prev', '/pid/next'])
			);
			expect(screen.getByText('1918-11-11')).toBeInTheDocument();
		});

		it('is left out when there are no neighbours', () => {
			state.previousNext = { previousIeObjectId: null, nextIeObjectId: null };
			renderTab(newspaper);

			expect(screen.queryByText('1918-11-11')).not.toBeInTheDocument();
		});

		it('is hidden for a user without the permission', () => {
			state.user = { permissions: [] };
			state.previousNext = { previousIeObjectId: 'prev', nextIeObjectId: 'next' };
			renderTab(newspaper);

			expect(document.querySelector('a[href^="/pid/"]')).not.toBeInTheDocument();
		});

		it('is shown for a user with the permission', () => {
			state.user = { permissions: [Permission.VIEW_PREVIOUS_AND_NEXT_NEWSPAPER_BUTTONS] };
			state.previousNext = { previousIeObjectId: 'prev', nextIeObjectId: null };
			renderTab(newspaper);

			expect(document.querySelector('a[href="/pid/prev"]')).toBeInTheDocument();
		});
	});

	describe('similar objects', () => {
		it('renders the similar list when there are similar objects', () => {
			renderTab({}, { similar });

			expect(screen.getByTestId('cards-similar')).toBeInTheDocument();
		});

		it('leaves the section out without similar objects', () => {
			renderTab();

			expect(screen.queryByTestId('cards-similar')).not.toBeInTheDocument();
		});
	});

	it('shows the copyright holder of objects without audio/video rights info', () => {
		renderTab({ copyrightHolder: 'SABAM' });

		expect(screen.getByText('SABAM')).toBeInTheDocument();
	});
});
