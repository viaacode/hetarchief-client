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

vi.mock('@shared/helpers/translate', () => {
	const translations: Record<string, string> = {
		'modules/ie-objects/utils/get-ie-object-av-rights___deze-informatie-wordt-verder-verzameld':
			'deze informatie wordt verder verzameld',
	};

	return {
		tText: (key: string) => translations[key] ?? key,
		tHtml: (key: string) => translations[key] ?? key,
	};
});
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
	'@ie-objects/components/ObjectDetailPageOverviewTab/ObjectDetailPageMetadataThemes',
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
// renderAiEntities reads the AI-entity filters off the URL directly
vi.mock('use-query-params', async (importOriginal) => {
	const actual = await importOriginal<typeof import('use-query-params')>();
	return {
		...actual,
		useQueryParam: () => [null, vi.fn()],
	};
});

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

	describe('rights', () => {
		const RIGHTS_TITLE = 'modules/ie-objects/object-detail-page___rechten';
		const PLACEHOLDER_LABEL = 'deze informatie wordt verder verzameld';

		it('shows the placeholder without a link for audio/video with a metadata license', () => {
			renderTab({ licenses: [HetArchiefIeObjectLicense.PUBLIEK_METADATA_LTD] });

			expect(screen.getByText(RIGHTS_TITLE)).toBeInTheDocument();
			expect(screen.getByText(PLACEHOLDER_LABEL)).toBeInTheDocument();
			expect(screen.getByText(PLACEHOLDER_LABEL).closest('a')).toBeNull();
		});

		it('shows the placeholder to kiosk visitors too', () => {
			state.isKiosk = true;
			renderTab({ licenses: [HetArchiefIeObjectLicense.PUBLIEK_METADATA_ALL] });

			expect(screen.getByText(PLACEHOLDER_LABEL)).toBeInTheDocument();
		});

		it('leaves the section out for audio/video without a metadata license', () => {
			renderTab({ licenses: [] });

			expect(screen.queryByText(RIGHTS_TITLE)).not.toBeInTheDocument();
		});

		it('shows the newspaper rights status with its links for public newspapers', () => {
			renderTab({
				dctermsFormat: HetArchiefIeObjectType.NEWSPAPER,
				licenses: [
					HetArchiefIeObjectLicense.PUBLIEK_CONTENT,
					HetArchiefIeObjectLicense.PUBLIC_DOMAIN,
				],
			});

			expect(screen.getByText(RIGHTS_TITLE)).toBeInTheDocument();
			expect(
				screen.getByRole('link', {
					name: 'modules/ie-objects/utils/get-ie-object-rights-status___public-domein',
				})
			).toHaveAttribute(
				'href',
				'modules/ie-objects/utils/get-ie-object-rights-status___public-domain-internal-link'
			);
			expect(
				screen
					.getAllByRole('link')
					.some(
						(link) =>
							link.getAttribute('href') ===
							'modules/ie-objects/utils/get-ie-object-rights-status___public-domain-external-link'
					)
			).toBe(true);
		});

		it('leaves the section out for newspapers without public content', () => {
			renderTab({
				dctermsFormat: HetArchiefIeObjectType.NEWSPAPER,
				licenses: [HetArchiefIeObjectLicense.PUBLIC_DOMAIN],
			});

			expect(screen.queryByText(RIGHTS_TITLE)).not.toBeInTheDocument();
		});

		it('does not show the newspaper rights status for audio/video in the public domain', () => {
			renderTab({
				licenses: [
					HetArchiefIeObjectLicense.PUBLIEK_CONTENT,
					HetArchiefIeObjectLicense.PUBLIC_DOMAIN,
					HetArchiefIeObjectLicense.PUBLIEK_METADATA_LTD,
				],
			});

			expect(
				screen.queryByText('modules/ie-objects/utils/get-ie-object-rights-status___public-domein')
			).not.toBeInTheDocument();
			expect(screen.getByText(PLACEHOLDER_LABEL)).toBeInTheDocument();
		});

		it('shows the copyright holder and license distributor next to the usage label', () => {
			renderTab({
				licenses: [HetArchiefIeObjectLicense.PUBLIEK_METADATA_LTD],
				copyrightHolder: 'SABAM',
				rightsInfo: { reuseLabel: '© Vlaams Parlement', licenseDistributor: 'Licentiegever X' },
			} as Partial<HetArchiefIeObject>);

			expect(screen.getByText('modules/ie-objects/ie-objects___rechthebbende')).toBeInTheDocument();
			expect(screen.getByText('SABAM')).toBeInTheDocument();
			expect(screen.getByText('modules/ie-objects/ie-objects___licentiegever')).toBeInTheDocument();
			expect(screen.getByText('Licentiegever X')).toBeInTheDocument();
		});

		it('shows the usage label instead of the placeholder when there is one', () => {
			renderTab({
				licenses: [HetArchiefIeObjectLicense.PUBLIEK_METADATA_LTD],
				rightsInfo: { reuseLabel: '© Vlaams Parlement' },
			} as Partial<HetArchiefIeObject>);

			expect(screen.getByText('© Vlaams Parlement')).toBeInTheDocument();
			expect(screen.queryByText(PLACEHOLDER_LABEL)).not.toBeInTheDocument();
		});
	});

	it('shows the copyright holder of objects without audio/video rights info', () => {
		renderTab({ copyrightHolder: 'SABAM' });

		expect(screen.getByText('SABAM')).toBeInTheDocument();
	});
});
