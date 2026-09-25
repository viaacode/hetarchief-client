import type {
	HetArchiefIeObjectFile,
	HetArchiefIeObjectLicense,
	HetArchiefIeObjectPage,
} from '@viaa/avo2-types';
import clsx from 'clsx';
import React, { type FC, type ReactNode } from 'react';

import {
	ACCESS_THROUGH_LABELS,
	describeFileUsage,
	EXTRA_VISITOR_SPACE_ACCESS_BY_GROUP,
	FIELD_LABELS,
	GRANTED_THROUGH_LABELS,
	GROUP_LABELS,
	LICENSE_EXPLANATIONS,
	METADATA_SET_LABELS,
	NOT_VISIBLE_REASON_LABELS,
	previewFieldValue,
} from './IeObjectAccessPage.consts';
import styles from './IeObjectAccessPage.module.scss';
import type {
	IeObjectAccessDebugField,
	IeObjectAccessDebugReport,
	IeObjectAccessDebugViewer,
} from './IeObjectAccessPage.types';

interface IeObjectAccessReportProps {
	viewer: IeObjectAccessDebugViewer;
	report: IeObjectAccessDebugReport;
}

const Tag: FC<{ variant?: 'ok' | 'no' | 'warn'; children: ReactNode }> = ({
	variant,
	children,
}) => (
	<span
		className={clsx(
			styles['p-admin-ie-object-access__tag'],
			variant && styles[`p-admin-ie-object-access__tag--${variant}`]
		)}
	>
		{children}
	</span>
);

const YesNo: FC<{ value: boolean }> = ({ value }) =>
	value ? <Tag variant="ok">✔ Yes</Tag> : <Tag variant="no">✘ No</Tag>;

const Muted: FC<{ children: ReactNode }> = ({ children }) => (
	<span className={styles['p-admin-ie-object-access__muted']}>{children}</span>
);

const LicenseTags: FC<{ licenses: HetArchiefIeObjectLicense[] | undefined }> = ({ licenses }) =>
	licenses?.length ? (
		<span>
			{licenses.map((license) => (
				<Tag key={license}>{license}</Tag>
			))}
		</span>
	) : (
		<Muted>none</Muted>
	);

const Card: FC<{ step?: number; title?: string; children: ReactNode }> = ({
	step,
	title,
	children,
}) => (
	<div
		className={clsx(
			styles['p-admin-ie-object-access__card'],
			step && styles['p-admin-ie-object-access__card--step']
		)}
	>
		{title && (
			<h3 className={styles['p-admin-ie-object-access__card-title']}>
				{step && <span className={styles['p-admin-ie-object-access__step-number']}>{step}</span>}
				{title}
			</h3>
		)}
		{children}
	</div>
);

const DefinitionList: FC<{ children: ReactNode }> = ({ children }) => (
	<dl className={styles['p-admin-ie-object-access__definitions']}>{children}</dl>
);

const Definition: FC<{ label: string; children: ReactNode }> = ({ label, children }) => (
	<>
		<dt>{label}</dt>
		<dd>{children}</dd>
	</>
);

export const IeObjectAccessReport: FC<IeObjectAccessReportProps> = ({ viewer, report }) => {
	const { ieObject, trace } = report;
	const maintainerName = ieObject.maintainerName || ieObject.maintainerId || 'the content partner';
	const sectorCheck = trace.sectorCheck;
	const objectHasVisitorLicenses = report.licenses.some((license) =>
		license.license.startsWith('BEZOEKERTOOL')
	);

	const renderViewer = () => {
		const sourceText = {
			email: (
				<>
					The user with email address <strong>{viewer.email}</strong>.
				</>
			),
			session: <>You (the user that is logged in right now).</>,
			anonymous: (
				<>
					An <strong>anonymous visitor</strong> (not logged in).
				</>
			),
		}[viewer.source];

		return (
			<>
				<h2>Who is looking?</h2>
				<Card>
					<p>{sourceText}</p>
					<DefinitionList>
						{viewer.source !== 'anonymous' && (
							<Definition label="Name">
								{viewer.fullName} ({viewer.email})
							</Definition>
						)}
						<Definition label="User group">
							{GROUP_LABELS[viewer.groupName] || viewer.groupName}
						</Definition>
						<Definition label="Organisation">
							{viewer.organisationId ? (
								<>
									{viewer.organisationName} <Muted>({viewer.organisationId})</Muted>
								</>
							) : (
								<Muted>none</Muted>
							)}
						</Definition>
						<Definition label="Sector of the organisation">
							{viewer.sector || <Muted>none</Muted>}
						</Definition>
						<Definition label="Key user">
							<YesNo value={viewer.isKeyUser} />
						</Definition>
						<Definition label="Evaluator">
							<YesNo value={viewer.isEvaluator} />
							<div>
								<Muted>
									Evaluators can approve or deny material requests for their organisation. This does
									not change which objects they can see.
								</Muted>
							</div>
						</Definition>
						<Definition label="Visitor spaces with full access">
							{viewer.fullAccessVisitorSpaceIds.length ? (
								viewer.fullAccessVisitorSpaceIds.map((id) => <Tag key={id}>{id}</Tag>)
							) : (
								<Muted>none</Muted>
							)}
							<div>
								<Muted>
									Through approved visit requests that are active right now
									{EXTRA_VISITOR_SPACE_ACCESS_BY_GROUP[viewer.groupName] || ''}.
								</Muted>
							</div>
						</Definition>
						<Definition label="Objects accessible through folders">
							{viewer.folderAccessObjectIds.length} object(s){' '}
							<Muted>(through approved visit requests limited to specific folders)</Muted>
						</Definition>
					</DefinitionList>
				</Card>
			</>
		);
	};

	const renderVerdict = () =>
		report.isVisible ? (
			<div
				className={clsx(
					styles['p-admin-ie-object-access__verdict'],
					styles['p-admin-ie-object-access__verdict--ok']
				)}
			>
				<span className={styles['p-admin-ie-object-access__verdict-title']}>
					✔ Visible for this user
				</span>
				This user sees the{' '}
				<strong>{METADATA_SET_LABELS[report.highestMetadataSet].toLowerCase()}</strong> of this
				object
				{trace.hasAccessToEssence ? (
					' and may view/listen to it.'
				) : (
					<>
						, but may <strong>not</strong> view/listen to the media itself.
					</>
				)}
			</div>
		) : (
			<div
				className={clsx(
					styles['p-admin-ie-object-access__verdict'],
					styles['p-admin-ie-object-access__verdict--no']
				)}
			>
				<span className={styles['p-admin-ie-object-access__verdict-title']}>
					✘ Not visible for this user
				</span>
				The platform will not show this object to this user. See step 6 below for the reasons.
			</div>
		);

	const renderAboutObject = () => (
		<>
			<h2>About the object</h2>
			<Card>
				<DefinitionList>
					<Definition label="Type">{ieObject.dctermsFormat || '-'}</Definition>
					<Definition label="Content partner">
						{ieObject.maintainerName || '-'} <Muted>({ieObject.maintainerId})</Muted>
					</Definition>
					<Definition label="Sector of the content partner">
						{ieObject.sector || <Muted>none</Muted>}
					</Definition>
					<Definition label="Has a thumbnail">
						<YesNo value={!!ieObject.thumbnailUrl} />
					</Definition>
				</DefinitionList>
				<h3 className={styles['p-admin-ie-object-access__subtitle']}>Licenses</h3>
				{report.licenses.length ? (
					<div className={styles['p-admin-ie-object-access__table-wrapper']}>
						<table className={styles['p-admin-ie-object-access__table']}>
							<thead>
								<tr>
									<th>License</th>
									<th>What it means</th>
									<th>Gives access to</th>
								</tr>
							</thead>
							<tbody>
								{report.licenses.map((license) => (
									<tr key={license.license}>
										<td>
											<Tag>{license.license}</Tag>
											{license.isImplied && (
												<div>
													<Muted>(added automatically, see step 1)</Muted>
												</div>
											)}
										</td>
										<td>
											{LICENSE_EXPLANATIONS[license.license] || 'Unknown license, gives no access.'}
										</td>
										<td>{METADATA_SET_LABELS[license.metadataSet]}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<Tag variant="no">This object has no licenses, nobody can see it.</Tag>
				)}
			</Card>
		</>
	);

	const renderFile = (file: HetArchiefIeObjectFile) => (
		<tr key={file.id}>
			<td>
				{file.name}
				<div>
					<Muted>
						<code>{file.id}</code>
					</Muted>
				</div>
			</td>
			<td>
				<code>{file.mimeType}</code>
			</td>
			<td>{describeFileUsage(file.mimeType)}</td>
			<td>{file.duration ?? '-'}</td>
			<td>
				{file.mediaFragment
					? `${file.mediaFragment.startTime}s → ${file.mediaFragment.endTime}s`
					: '-'}
			</td>
		</tr>
	);

	const renderPage = (page: HetArchiefIeObjectPage, pageIndex: number) => (
		<Card key={`page-${page.pageNumber ?? pageIndex}`}>
			<h3 className={styles['p-admin-ie-object-access__card-title']}>
				Page {page.pageNumber ?? '-'}{' '}
				<Muted>– {page.representations?.length || 0} representation(s)</Muted>
			</h3>
			{(page.representations || []).map((representation) => (
				<details
					key={representation.id}
					open
					className={styles['p-admin-ie-object-access__details']}
				>
					<summary>Representation: {representation.schemaName || representation.id}</summary>
					<DefinitionList>
						<Definition label="Id">
							<code>{representation.id}</code>
						</Definition>
						{representation.schemaInLanguage && (
							<Definition label="Language">{representation.schemaInLanguage}</Definition>
						)}
						{(representation.schemaStartTime || representation.schemaEndTime) && (
							<Definition label="Fragment">
								{representation.schemaStartTime} → {representation.schemaEndTime}
							</Definition>
						)}
						{representation.isMediaFragmentOf && (
							<Definition label="Fragment of">
								<code>{representation.isMediaFragmentOf}</code>
							</Definition>
						)}
						<Definition label="Has transcript">
							<YesNo
								value={!!(representation.schemaTranscript || representation.schemaTranscriptUrl)}
							/>
						</Definition>
						<Definition label="Has thumbnail">
							<YesNo value={!!representation.thumbnailUrl} />
						</Definition>
					</DefinitionList>
					<div className={styles['p-admin-ie-object-access__table-wrapper']}>
						<table className={styles['p-admin-ie-object-access__table']}>
							<thead>
								<tr>
									<th>File</th>
									<th>Type</th>
									<th>Used for</th>
									<th>Duration</th>
									<th>Cut out of video</th>
								</tr>
							</thead>
							<tbody>
								{representation.files?.length ? (
									representation.files.map(renderFile)
								) : (
									<tr>
										<td colSpan={5}>
											<Muted>No files in this representation</Muted>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</details>
			))}
		</Card>
	);

	const renderFiles = () => (
		<>
			<h2>Files and representations</h2>
			<p>
				{trace.hasAccessToEssence ? (
					<>
						This user <strong>may</strong> view/listen to the media, so the files below are sent to
						the website.
					</>
				) : (
					<>
						This user <strong>may not</strong> view/listen to the media, so none of the files below
						are sent to the website (the "pages" field is hidden).
					</>
				)}
			</p>
			{ieObject.pages?.length ? (
				ieObject.pages.map(renderPage)
			) : (
				<Tag variant="warn">
					This object has no files or representations in the database. Even with full access, there
					is nothing to play or show.
				</Tag>
			)}
		</>
	);

	const renderSteps = () => (
		<>
			<h2>How the platform decides, step by step</h2>

			<Card step={1} title="Complete the licenses of the object">
				<p>
					A wider license automatically includes the smaller ones. For example: someone who may view
					the media may of course also read the full description.
				</p>
				<p>
					Licenses on the object: <LicenseTags licenses={trace.originalObjectLicenses} />
				</p>
				<p>
					Added automatically: <LicenseTags licenses={trace.impliedObjectLicenses} />
				</p>
			</Card>

			<Card step={2} title="Public licenses">
				<p>
					Public licenses (VIAA-PUBLIEK-...) count for everyone, also for people who are not logged
					in. Exception: a kiosk computer in a reading room can only show objects of its own content
					partner.
				</p>
				{trace.isKioskUserOfOtherMaintainer && (
					<p>
						<Tag variant="no">
							✘ This is a kiosk of another content partner, so public licenses do not count.
						</Tag>
					</p>
				)}
				<p>
					Public licenses that count for this user:{' '}
					<LicenseTags licenses={trace.publicLicensesGranted} />
				</p>
			</Card>

			<Card step={3} title="Sharing between content partners (sector)">
				<p>
					Objects with a VIAA-INTRA_CP-... license can be seen by users of other content partner
					organisations, but only if <strong>all</strong> of these conditions are met:
				</p>
				<div className={styles['p-admin-ie-object-access__table-wrapper']}>
					<table className={styles['p-admin-ie-object-access__table']}>
						<thead>
							<tr>
								<th>Condition</th>
								<th>Met?</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									The user is a visitor, content partner admin or meemoo admin (not anonymous, not a
									kiosk)
								</td>
								<td>
									<YesNo value={!!sectorCheck?.userGroupAllowed} />
								</td>
							</tr>
							<tr>
								<td>The organisation of the user has a sector</td>
								<td>
									<YesNo value={!!sectorCheck?.userHasSector} /> <Muted>{viewer.sector}</Muted>
								</td>
							</tr>
							<tr>
								<td>The content partner of the object has a sector</td>
								<td>
									<YesNo value={!!sectorCheck?.objectHasSector} /> <Muted>{ieObject.sector}</Muted>
								</td>
							</tr>
							<tr>
								<td>The user is a key user of their organisation</td>
								<td>
									<YesNo value={!!sectorCheck?.isKeyUser} />
								</td>
							</tr>
							<tr>
								<td>The object has a VIAA-INTRA_CP-... license</td>
								<td>
									<YesNo value={!!sectorCheck?.objectHasIntraCpLicenses} />
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				{sectorCheck?.applies ? (
					<>
						<p>
							All conditions are met. A user from the sector <strong>{viewer.sector}</strong> may
							use these licenses for objects of the sector <strong>{ieObject.sector}</strong>:{' '}
							<LicenseTags licenses={sectorCheck.licensesBySector} />
						</p>
						{sectorCheck.isOwnMaintainer && (
							<p>
								The object belongs to the <strong>own organisation</strong> of the user, so all
								VIAA-INTRA_CP-... licenses count, regardless of the sector.
							</p>
						)}
						<p>
							Licenses that count for this user through the sector:{' '}
							<LicenseTags licenses={sectorCheck.licensesGranted} />
						</p>
					</>
				) : (
					<p>
						<Tag variant="no">
							Not all conditions are met, so this step gives no extra licenses.
						</Tag>
					</p>
				)}
			</Card>

			<Card step={4} title="Visitor space (reading room) access">
				<p>
					Objects with a BEZOEKERTOOL-... license can be seen by users that have an approved and
					currently active visit to the visitor space of the content partner (
					<strong>{maintainerName}</strong>). A visit can give access to the whole visitor space or
					only to certain folders.
				</p>
				<DefinitionList>
					<Definition label="Full access to this visitor space">
						<YesNo value={!!trace.hasFullVisitorSpaceAccess} />
					</Definition>
					<Definition label="Access to this object through a folder">
						<YesNo value={!!trace.hasFolderAccess} />
					</Definition>
					<Definition label="Object has a visitor space license">
						<YesNo value={objectHasVisitorLicenses} />
					</Definition>
				</DefinitionList>
				{trace.hasFolderAccess || trace.hasFullVisitorSpaceAccess ? (
					<>
						<p>
							Licenses that count for this user through the visitor space:{' '}
							<LicenseTags licenses={trace.visitorSpaceLicensesGranted} />
						</p>
						<p>
							<Muted>
								This also includes the licenses every user of the group "
								{GROUP_LABELS[viewer.groupName] || viewer.groupName}" gets:{' '}
							</Muted>
							<LicenseTags licenses={trace.userGroupLicenses} />
						</p>
					</>
				) : (
					<p>
						<Tag variant="no">
							No visitor space access for this object, so this step gives no extra licenses.
						</Tag>
					</p>
				)}
			</Card>

			<Card step={5} title="Combine: which licenses of the object count for this user?">
				<p>
					Only licenses that the <strong>object has</strong> and that the{' '}
					<strong>user is allowed to use</strong> (steps 2 to 4) count.
				</p>
				<div className={styles['p-admin-ie-object-access__table-wrapper']}>
					<table className={styles['p-admin-ie-object-access__table']}>
						<thead>
							<tr>
								<th>License of the object</th>
								<th>Allowed for this user through</th>
								<th>Counts?</th>
								<th>Gives access to</th>
							</tr>
						</thead>
						<tbody>
							{report.licenses.length ? (
								report.licenses.map((license) => (
									<tr key={license.license}>
										<td>
											<Tag>{license.license}</Tag>
										</td>
										<td>
											{license.grantedThrough.length ? (
												license.grantedThrough
													.map((grantedThrough) => GRANTED_THROUGH_LABELS[grantedThrough])
													.join(', ')
											) : (
												<Muted>-</Muted>
											)}
										</td>
										<td>
											<YesNo value={license.counts} />
										</td>
										<td>
											{license.counts ? METADATA_SET_LABELS[license.metadataSet] : <Muted>-</Muted>}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={4}>
										<Muted>The object has no licenses</Muted>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</Card>

			<Card step={6} title="Result">
				{report.isVisible ? (
					<>
						<p>
							The best license that counts gives access to:{' '}
							<strong>{METADATA_SET_LABELS[report.highestMetadataSet]}</strong>.
						</p>
						<p>
							May view/listen to the media: <YesNo value={!!trace.hasAccessToEssence} />
						</p>
						<p>
							Shown on the website as "access through":{' '}
							{report.limitedIeObject?.accessThrough?.length ? (
								report.limitedIeObject.accessThrough.map((accessThrough) => (
									<Tag key={accessThrough}>
										{ACCESS_THROUGH_LABELS[accessThrough] || accessThrough}
									</Tag>
								))
							) : (
								<Muted>nothing</Muted>
							)}
						</p>
						{report.meemooAdminVisitorSpaceFullAdded && (
							<p>
								<Muted>
									"Full access to the reading room" was added because meemoo admins always get this
									for objects with a visitor space license.
								</Muted>
							</p>
						)}
					</>
				) : (
					<>
						<p>
							<Tag variant="no">No license counts, so the object is not shown at all.</Tag> The
							website gets a "You do not have access to this object" error.
						</p>
						<ul className={styles['p-admin-ie-object-access__list']}>
							{report.notVisibleReasons.map((reason) => (
								<li key={reason}>
									{NOT_VISIBLE_REASON_LABELS[reason](maintainerName, viewer.source === 'anonymous')}
								</li>
							))}
						</ul>
					</>
				)}
			</Card>
		</>
	);

	const renderFieldStatus = (field: IeObjectAccessDebugField) => {
		if (field.visible) {
			return field.hasValue ? (
				<Tag variant="ok">Shown</Tag>
			) : (
				<Tag variant="warn">Allowed, but empty</Tag>
			);
		}
		return field.requiredMetadataSet ? (
			<Tag variant="no">Hidden</Tag>
		) : (
			<Tag variant="no">Never sent to the website</Tag>
		);
	};

	const renderFields = () => {
		const shownCount = report.fields.filter((field) => field.visible && field.hasValue).length;

		return (
			<>
				<h2>Which information about the object is shown?</h2>
				<p>
					{shownCount} field(s) with a value are shown to this user. A field is hidden when the
					user's best license does not give access to the level the field needs.
				</p>
				<Card>
					<div className={styles['p-admin-ie-object-access__table-wrapper']}>
						<table className={styles['p-admin-ie-object-access__table']}>
							<thead>
								<tr>
									<th>Field</th>
									<th>Needs at least</th>
									<th>For this user</th>
									<th>Value in the database</th>
								</tr>
							</thead>
							<tbody>
								{report.fields.map((field) => {
									const preview = previewFieldValue(
										field.field,
										(ieObject as Record<string, unknown>)[field.field]
									);
									return (
										<tr key={field.field}>
											<td>
												{FIELD_LABELS[field.field] || field.field}
												<div>
													<Muted>
														<code>{field.field}</code>
													</Muted>
												</div>
											</td>
											<td>
												{field.requiredMetadataSet ? (
													METADATA_SET_LABELS[field.requiredMetadataSet]
												) : (
													<Muted>-</Muted>
												)}
											</td>
											<td>{renderFieldStatus(field)}</td>
											<td>{preview ? <code>{preview}</code> : <Muted>(empty)</Muted>}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</Card>
			</>
		);
	};

	const renderTechnicalDetails = () => (
		<>
			<h2>Technical details</h2>
			<Card>
				<details className={styles['p-admin-ie-object-access__details']}>
					<summary>Object as stored in the database (before limiting)</summary>
					<pre>{JSON.stringify(ieObject, null, 2)}</pre>
				</details>
				<details className={styles['p-admin-ie-object-access__details']}>
					<summary>Object as returned by GET /ie-objects to this user (after limiting)</summary>
					<pre>{JSON.stringify(report.limitedIeObject, null, 2)}</pre>
				</details>
				<details className={styles['p-admin-ie-object-access__details']}>
					<summary>Intermediate values of limitAccessToObjectDetails</summary>
					<pre>{JSON.stringify(trace, null, 2)}</pre>
				</details>
			</Card>
		</>
	);

	return (
		<div className={styles['p-admin-ie-object-access__report']}>
			{renderViewer()}

			<h2 className={styles['p-admin-ie-object-access__object-title']}>
				{ieObject.name || ieObject.schemaIdentifier}
			</h2>
			<p>
				<Muted>
					PID {ieObject.schemaIdentifier}
					{ieObject.iri && (
						<>
							{' · '}
							<code>{ieObject.iri}</code>
						</>
					)}
				</Muted>
			</p>
			{renderVerdict()}
			{renderAboutObject()}
			{renderFiles()}
			{renderSteps()}
			{renderFields()}
			{renderTechnicalDetails()}
		</div>
	);
};
