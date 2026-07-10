import { Permission } from '@account/const';
import {
	ADMIN_ORGANISATIONS_QUERY_PARAM_CONFIG,
	OrganisationsTablePageSize,
} from '@admin/const/Organisations.const';
import { useGetOrganisations } from '@admin/hooks/get-organisations';
import { AdminLayout } from '@admin/layouts';
import type { Column, Row } from '@meemoo/react-components';
import { Button, PaginationBar, Table, TextArea } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterButtonProps } from '@shared/components/Blade/Blade.types';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Loading } from '@shared/components/Loading';
import { getDefaultPaginationBarProps } from '@shared/components/PaginationBar/PaginationBar.consts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SearchBar } from '@shared/components/SearchBar';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { sortingIcons } from '@shared/components/Table/Table.const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tText } from '@shared/helpers/translate';
import { OrganisationService } from '@shared/services/organisation-service/organisation.service';
import type { OrganisationListItem } from '@shared/services/organisation-service/organisation.types';
import { toastService } from '@shared/services/toast-service';
import type { DefaultSeoInfo } from '@shared/types/seo';
import type { SearchOrderDirection } from '@viaa/avo2-types/dist/modules/search';
import { noop } from 'es-toolkit/compat';
import { type FC, type ReactElement, type ReactNode, useCallback, useMemo, useState } from 'react';
import { useQueryParams } from 'use-query-params';

export const AdminOrganisationsPage: FC<DefaultSeoInfo> = ({ url, canonicalUrl }) => {
	const [activeOrganisation, setActiveOrganisation] = useState<OrganisationListItem | null>(null);
	const [editedSlug, setEditedSlug] = useState<string>('');

	const [filters, setFilters] = useQueryParams(ADMIN_ORGANISATIONS_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>(filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] || '');

	const {
		data: organisationsData,
		isLoading: isLoadingOrganisations,
		refetch: refetchOrganisations,
	} = useGetOrganisations({
		query: filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] || undefined,
		page: filters.page,
		size: OrganisationsTablePageSize,
		orderProp: filters.orderProp as keyof OrganisationListItem | undefined,
		orderDirection: filters.orderDirection,
	});

	const organisations = useMemo(
		() =>
			(organisationsData?.items || []).map((org) => ({
				...org,
				id: org.org_identifier,
			})),
		[organisationsData?.items]
	);

	const totalItems = organisationsData?.total || 0;

	const saveActiveOrganisation = async () => {
		if (!activeOrganisation) {
			return;
		}

		try {
			await OrganisationService.update(activeOrganisation.org_identifier, {
				slug: editedSlug,
			});

			refetchOrganisations().then(noop);

			toastService.notify({
				title: tText(
					'modules/admin/views/organisations/admin-organisations-page___organisatie-bijgewerkt-success-toast'
				),
				description: tText(
					'modules/admin/views/organisations/admin-organisations-page___de-organisatie-is-succesvol-bijgewerkt-success-toast'
				),
			});

			closeBlade();
		} catch (_err) {
			toastService.notify({
				title: tText(
					'modules/admin/views/organisations/admin-organisations-page___er-ging-iets-mis-error-toast'
				),
				description: tText(
					'modules/admin/views/organisations/admin-organisations-page___het-bijwerken-van-de-organisatie-is-mislukt-probeer-het-later-opnieuw-error-toast'
				),
			});
		}
	};

	const sortFilters = useMemo(() => {
		return [
			{
				id: filters.orderProp ?? '',
				desc: filters.orderDirection !== 'asc',
			},
		];
	}, [filters.orderProp, filters.orderDirection]);

	const onSortChange = useCallback(
		(orderProp: string | undefined, orderDirection: SearchOrderDirection | undefined) => {
			setFilters((currentFilters) => {
				if (
					currentFilters.orderProp !== orderProp ||
					currentFilters.orderDirection !== orderDirection
				) {
					return {
						...currentFilters,
						orderProp,
						orderDirection: orderDirection || 'asc',
						page: 1,
					};
				}
				return currentFilters;
			});
		},
		[setFilters]
	);

	const onPageChange = useCallback(
		(pageZeroBased: number, gotoPage: (i: number) => void): void => {
			gotoPage(pageZeroBased);
			setFilters((currentFilters) => ({
				...currentFilters,
				page: pageZeroBased + 1,
			}));
		},
		[setFilters]
	);

	const handleEditButtonClicked = (organisation: OrganisationListItem) => {
		setActiveOrganisation(organisation);
		setEditedSlug(organisation.slug);
	};

	const organisationsTableColumns: Column<OrganisationListItem>[] = [
		{
			id: 'name',
			header: tText(
				'modules/admin/views/organisations/admin-organisations-page___organisatie-naam-table-header'
			),
			accessorKey: 'name',
		},
		{
			id: 'id',
			header: tText(
				'modules/admin/views/organisations/admin-organisations-page___organisatie-id-table-header'
			),
			accessorKey: 'org_identifier',
		},
		{
			id: 'slug',
			header: tText(
				'modules/admin/views/organisations/admin-organisations-page___slug-table-header'
			),
			accessorKey: 'slug',
		},
		{
			header: '',
			id: 'actions',
			cell: ({ row }: { row: Row<OrganisationListItem> }): ReactElement => {
				const organisation = row.original;
				return (
					<div className="c-organisations-table__actions">
						<Button
							variants={['text', 'icon']}
							icon={<Icon name={IconNamesLight.Edit} aria-hidden />}
							aria-label={tText(
								'modules/admin/views/organisations/admin-organisations-page___edit-organisatie-aria-label'
							)}
							onClick={() => handleEditButtonClicked(organisation)}
						/>
					</div>
				);
			},
		},
	];

	const renderPagination = ({ setPageIndex }: { setPageIndex: (i: number) => void }): ReactNode => (
		<PaginationBar
			{...getDefaultPaginationBarProps()}
			showFirstAndLastButtons
			startItem={Math.max(0, filters.page - 1) * OrganisationsTablePageSize}
			itemsPerPage={OrganisationsTablePageSize}
			totalItems={totalItems}
			onPageChange={(pageZeroBased: number) => onPageChange(pageZeroBased, setPageIndex)}
		/>
	);

	const renderOrganisationsTable = (): ReactNode => {
		if (isLoadingOrganisations) {
			return <Loading locationId="Organisations overview" />;
		}
		if (!organisations.length) {
			return (
				<span className="c-organisations-content__no-results">
					{tText(
						'modules/admin/views/organisations/admin-organisations-page___er-zijn-geen-organisaties-gevonden'
					)}
				</span>
			);
		}
		return (
			<Table<OrganisationListItem>
				options={{
					columns: organisationsTableColumns,
					data: organisations,
					initialState: {
						pagination: { pageIndex: 0, pageSize: OrganisationsTablePageSize },
						sorting: sortFilters,
					},
				}}
				onSortChange={onSortChange}
				sortingIcons={sortingIcons}
				pagination={renderPagination}
				enableRowFocusOnClick={true}
			/>
		);
	};

	const closeBlade = () => {
		setActiveOrganisation(null);
		setEditedSlug('');
	};

	const renderBlade = () => {
		const getFooterButtons = (): BladeFooterButtonProps => {
			return [
				{
					label: tText(
						'modules/admin/views/organisations/admin-organisations-page___bewaar-wijzigingen-org-edit-blade'
					),
					mobileLabel: tText(
						'modules/admin/views/organisations/admin-organisations-page___bewaar-wijzigingen-org-edit-blade-mobile'
					),
					type: 'primary',
					onClick: saveActiveOrganisation,
				},
				{
					label: tText(
						'modules/admin/views/organisations/admin-organisations-page___annuleer-org-edit-blade'
					),
					mobileLabel: tText(
						'modules/admin/views/organisations/admin-organisations-page___annuleer-org-edit-blade-mobile'
					),
					type: 'secondary',
					onClick: closeBlade,
				},
			];
		};

		return (
			<Blade
				footerButtons={getFooterButtons()}
				isOpen={!!activeOrganisation}
				onClose={closeBlade}
				title={tText(
					'modules/admin/views/organisations/admin-organisations-page___organisatie-bewerken-edit-blade-titel'
				)}
				id="organisations-blade"
				ariaLabel={tText(
					'modules/admin/views/organisations/admin-organisations-page___organisatie-bewerken-blade-aria-label'
				)}
			>
				<div className="c-organisations-blade__content">
					<div className="c-organisations-blade__field">
						<strong>
							{tText(
								'modules/admin/views/organisations/admin-organisations-page___organisatie-edit-blade'
							)}
							:
						</strong>{' '}
						{activeOrganisation?.name}
					</div>
					<div className="c-organisations-blade__field">
						<strong>
							{tText(
								'modules/admin/views/organisations/admin-organisations-page___organisatie-id-edit-blade'
							)}
							:
						</strong>{' '}
						{activeOrganisation?.org_identifier}
					</div>
					<div>
						<label htmlFor="slug-input" className="c-organisations-blade__label">
							<strong>
								{tText(
									'modules/admin/views/organisations/admin-organisations-page___slug-edit-blade'
								)}
								:
							</strong>
						</label>
						<TextArea
							id="slug-input"
							className="c-organisations-blade__textarea"
							ariaLabel={tText(
								'modules/admin/views/organisations/admin-organisations-page___organisatie-slug-input-edit-blade'
							)}
							value={editedSlug}
							onChange={(e) => setEditedSlug(e.target.value)}
						/>
					</div>
				</div>
			</Blade>
		);
	};

	const renderPageContent = () => {
		return (
			<AdminLayout pageTitle="Organisaties">
				<AdminLayout.Content>
					<div className="l-container">
						<SearchBar
							id="organisations-overview__search-input"
							className="c-organisations-overview__search-input"
							value={search}
							ariaLabel={tText(
								'modules/admin/views/organisations/admin-organisations-page___zoekbalk-aria-label'
							)}
							placeholder={tText(
								'modules/admin/views/organisations/admin-organisations-page___zoek-op-naam-id-of-slug'
							)}
							onChange={setSearch}
							onSearch={(value) =>
								setFilters({
									[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: value || undefined,
									page: 1,
								})
							}
						/>
						{renderOrganisationsTable()}
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			<SeoTags
				title="Organisaties"
				description="Organisaties"
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={canonicalUrl}
			/>

			<PermissionsCheck allPermissions={[Permission.CAN_MANAGE_ORGANISATION_SLUGS]}>
				{renderPageContent()}
				{renderBlade()}
			</PermissionsCheck>
		</>
	);
};
