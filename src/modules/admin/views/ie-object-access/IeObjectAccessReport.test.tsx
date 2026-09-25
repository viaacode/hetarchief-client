import { GroupName } from '@account/const';
import { render, screen } from '@testing-library/react';
import { HetArchiefIeObjectLicense, type HetArchiefIeObjectPage } from '@viaa/avo2-types';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';

import {
	type IeObjectAccessDebugReport,
	type IeObjectAccessDebugViewer,
	IeObjectAccessGrantedThrough,
	IeObjectMetadataSet,
	IeObjectNotVisibleReason,
} from './IeObjectAccessPage.types';
import { IeObjectAccessReport } from './IeObjectAccessReport';

const anonymousViewer: IeObjectAccessDebugViewer = {
	source: 'anonymous',
	fullName: null,
	email: null,
	groupName: GroupName.ANONYMOUS,
	organisationId: null,
	organisationName: null,
	sector: null,
	isKeyUser: false,
	fullAccessVisitorSpaceIds: [],
	folderAccessObjectIds: [],
};

const visibleReport: IeObjectAccessDebugReport = {
	ieObject: {
		schemaIdentifier: 'qsj38kdw2z',
		name: 'Durf te vragen',
		maintainerId: 'OR-rf5kf25',
		maintainerName: 'vrt',
		licenses: [HetArchiefIeObjectLicense.PUBLIEK_METADATA_ALL],
		pages: [
			{
				pageNumber: 1,
				representations: [
					{
						id: 'https://data/representation/1',
						schemaName: 'Broadcast',
						thumbnailUrl: null,
						files: [
							{
								id: 'https://data/file/1',
								name: 'video.mp4',
								mimeType: 'video/mp4',
								duration: '00:25:00',
								mediaFragment: null,
							},
						],
					},
				],
			},
		] as unknown as HetArchiefIeObjectPage[],
	},
	limitedIeObject: { schemaIdentifier: 'qsj38kdw2z', accessThrough: [] },
	isVisible: true,
	highestMetadataSet: IeObjectMetadataSet.METADATA_ALL,
	licenses: [
		{
			license: HetArchiefIeObjectLicense.PUBLIEK_METADATA_ALL,
			isImplied: false,
			metadataSet: IeObjectMetadataSet.METADATA_ALL,
			grantedThrough: [IeObjectAccessGrantedThrough.PUBLIC],
			counts: true,
		},
	],
	notVisibleReasons: [],
	fields: [
		{
			field: 'name',
			requiredMetadataSet: IeObjectMetadataSet.METADATA_LTD,
			visible: true,
			hasValue: true,
		},
		{
			field: 'thumbnailUrl',
			requiredMetadataSet: IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE,
			visible: false,
			hasValue: false,
		},
	],
	trace: {
		originalObjectLicenses: [HetArchiefIeObjectLicense.PUBLIEK_METADATA_ALL],
		impliedObjectLicenses: [],
		publicLicensesGranted: [HetArchiefIeObjectLicense.PUBLIEK_METADATA_ALL],
		accessibleLicenses: [HetArchiefIeObjectLicense.PUBLIEK_METADATA_ALL],
		hasAccessToEssence: false,
	},
	meemooAdminVisitorSpaceFullAdded: false,
};

describe('<IeObjectAccessReport />', () => {
	it('explains a visible object, its files and fields', () => {
		render(<IeObjectAccessReport viewer={anonymousViewer} report={visibleReport} />);

		expect(screen.getByText('✔ Visible for this user')).toBeInTheDocument();
		expect(screen.getByText('Not logged in (anonymous visitor)')).toBeInTheDocument();
		expect(screen.getByText('video.mp4')).toBeInTheDocument();
		expect(screen.getByText('Video that can be played in the video player')).toBeInTheDocument();
		expect(screen.getByText('Title')).toBeInTheDocument();
		expect(screen.getAllByText('Shown').length).toEqual(1);
		expect(screen.getAllByText('Hidden').length).toEqual(1);
	});

	it('lists the reasons when the object is not visible', () => {
		render(
			<IeObjectAccessReport
				viewer={anonymousViewer}
				report={{
					...visibleReport,
					isVisible: false,
					limitedIeObject: null,
					highestMetadataSet: IeObjectMetadataSet.EMPTY,
					notVisibleReasons: [
						IeObjectNotVisibleReason.NO_PUBLIC_LICENSE,
						IeObjectNotVisibleReason.NO_VISITOR_SPACE_ACCESS,
					],
				}}
			/>
		);

		expect(screen.getByText('✘ Not visible for this user')).toBeInTheDocument();
		expect(
			screen.getByText('The object has no public license (VIAA-PUBLIEK-...), so it is not public.')
		).toBeInTheDocument();
		expect(
			screen.getByText(
				'The object can be seen in the visitor space of vrt, but this user has no approved, active visit to that visitor space (you need to be logged in for that).'
			)
		).toBeInTheDocument();
	});
});
