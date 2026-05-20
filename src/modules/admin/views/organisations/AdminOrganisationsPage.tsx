import { Permission } from '@account/const';
import {
	ADMIN_ORGANISATIONS_QUERY_PARAM_CONFIG,
	OrganisationsTablePageSize,
} from '@admin/const/Organisations.const';
import { useGetOrganisations } from '@admin/hooks/get-organisations';
import { AdminLayout } from '@admin/layouts';
import { OrganisationsService } from '@admin/services/organisations';
import type { Organisation } from '@admin/views/organisations/organisations.types';
import { Button, PaginationBar, Table, TextArea } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterButtonProps } from '@shared/components/Blade/Blade.types';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { getDefaultPaginationBarProps } from '@shared/components/PaginationBar/PaginationBar.consts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SearchBar } from '@shared/components/SearchBar';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { sortingIcons } from '@shared/components/Table/Table.const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tText } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';
import type { DefaultSeoInfo } from '@shared/types/seo';
import type { SearchOrderDirection } from '@viaa/avo2-types/dist/modules/search';
import { type FC, type ReactElement, type ReactNode, useCallback, useMemo, useState } from 'react';
import type { Column, Row, TableState } from 'react-table';
import { useQueryParams } from 'use-query-params';

export const AdminOrganisationsPage: FC<DefaultSeoInfo> = ({ url, canonicalUrl }) => {
	const [activeOrganisation, setActiveOrganisation] = useState<Organisation | null>(null);
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
		orderProp: filters.orderProp as keyof Organisation | undefined,
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
			await OrganisationsService.update(activeOrganisation.org_identifier, {
				slug: editedSlug,
			});

			await refetchOrganisations();

			toastService.notify({
				title: tText('Organisatie bijgewerkt - success toast'),
				description: tText('De organisatie is succesvol bijgewerkt. - success toast'),
			});

			setActiveOrganisation(null);
			setEditedSlug('');
		} catch (_err) {
			toastService.notify({
				title: tText('Er ging iets mis - error toast'),
				description: tText(
					'Het bijwerken van de organisatie is mislukt. Probeer het later opnieuw. - error toast'
				),
			});
		}
	};

	const sortFilters = useMemo(() => {
		return [
			{
				id: filters.orderProp,
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

	const handleEditButtonClicked = useCallback((organisation: Organisation) => {
		setActiveOrganisation(organisation);
		setEditedSlug(organisation.slug);
	}, []);

	const organisationsTableColumns: Column<Organisation>[] = useMemo(
		() => [
			{
				id: 'name',
				Header: tText('Organisatie naam - table header'),
				accessor: 'name',
			},
			{
				id: 'id',
				Header: tText('Organisatie ID - table header'),
				accessor: 'org_identifier',
			},
			{
				id: 'slug',
				Header: tText('Slug - table header'),
				accessor: 'slug',
			},
			{
				Header: '',
				id: 'actions',
				Cell: ({ row }: { row: Row<Organisation> }): ReactElement => {
					const organisation = row.original;
					return (
						<div className="c-organisations-table__actions">
							<Button
								variants={['text', 'icon']}
								icon={<Icon name={IconNamesLight.Edit} aria-hidden />}
								aria-label={tText('edit organisatie - aria label')}
								onClick={() => handleEditButtonClicked(organisation)}
							/>
						</div>
					);
				},
			},
		],
		[handleEditButtonClicked]
	);

	const renderPagination = ({ gotoPage }: { gotoPage: (i: number) => void }): ReactNode => (
		<PaginationBar
			{...getDefaultPaginationBarProps()}
			showFirstAndLastButtons
			startItem={Math.max(0, filters.page - 1) * OrganisationsTablePageSize}
			itemsPerPage={OrganisationsTablePageSize}
			totalItems={totalItems}
			onPageChange={(pageZeroBased: number) => onPageChange(pageZeroBased, gotoPage)}
		/>
	);

	const renderOrganisationsTable = (): ReactNode => {
		if (isLoadingOrganisations) {
			return <div>Laden...</div>;
		}
		if (!organisations.length) {
			return (
				<span className="c-organisations-content__no-results">
					Er zijn geen organisaties gevonden
				</span>
			);
		}
		return (
			<Table<Organisation>
				options={{
					columns: organisationsTableColumns,
					data: organisations,
					initialState: {
						pageSize: OrganisationsTablePageSize,
						sortBy: sortFilters,
					} as TableState<Organisation>,
				}}
				onSortChange={onSortChange}
				sortingIcons={sortingIcons}
				pagination={renderPagination}
				enableRowFocusOnClick={true}
			/>
		);
	};

	const renderPopupBody = () => {
		if (!activeOrganisation) {
			return null;
		}
		return (
			<>
				<div className="c-organisations-blade__field">
					<strong>{tText('Organisatie - edit blade')}:</strong> {activeOrganisation.name}
				</div>
				<div className="c-organisations-blade__field">
					<strong>{tText('Organisatie ID - edit blade')}:</strong>{' '}
					{activeOrganisation.org_identifier}
				</div>
				<div>
					<label htmlFor="slug-input" className="c-organisations-blade__label">
						<strong>{tText('Slug - edit blade')}:</strong>
					</label>
					<TextArea
						id="slug-input"
						className="c-organisations-blade__textarea"
						ariaLabel={tText('Organisatie slug input - edit blade')}
						value={editedSlug}
						onChange={(e) => setEditedSlug(e.target.value)}
					/>
				</div>
			</>
		);
	};

	const renderPopup = ({
		title,
		body,
		isOpen,
		onSave,
		onClose,
	}: {
		title: string;
		body: ReactNode;
		isOpen: boolean;
		onSave: () => void;
		onClose: () => void;
	}) => {
		const getFooterButtons = (): BladeFooterButtonProps => {
			return [
				{
					label: tText('Bewaar wijzigingen - org edit blade'),
					mobileLabel: tText('Bewaar wijzigingen - org edit blade - mobile'),
					type: 'primary',
					onClick: onSave,
				},
				{
					label: tText('Annuleer - org edit blade'),
					mobileLabel: tText('Annuleer - org edit blade - mobile'),
					type: 'secondary',
					onClick: onClose,
				},
			];
		};

		return (
			<Blade
				footerButtons={getFooterButtons()}
				isOpen={isOpen}
				onClose={onClose}
				title={title}
				id="organisations-blade"
				ariaLabel={tText('Organisatie bewerken - blade aria label')}
			>
				<div className="c-organisations-blade__content">{body}</div>
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
							ariaLabel={tText('Zoekbalk - aria label')}
							placeholder={tText('Zoek op naam, ID, of slug')}
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
			</PermissionsCheck>

			{renderPopup({
				title: tText('Organisatie bewerken - edit blade titel'),
				body: renderPopupBody(),
				isOpen: !!activeOrganisation,
				onSave: saveActiveOrganisation,
				onClose: () => {
					setActiveOrganisation(null);
					setEditedSlug('');
				},
			})}
		</>
	);
};
