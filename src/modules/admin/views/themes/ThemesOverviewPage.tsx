import { Permission } from '@account/const';
import {
	ADMIN_THEMES_QUERY_PARAM_CONFIG,
	ThemesTableColumns,
	ThemesTablePageSize,
} from '@admin/const/Themes.const';
import { AdminLayout } from '@admin/layouts';
import { Button, PaginationBar, Table } from '@meemoo/react-components';
import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import { getDefaultPaginationBarProps } from '@shared/components/PaginationBar/PaginationBar.consts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SearchBar } from '@shared/components/SearchBar';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { sortingIcons } from '@shared/components/Table';
import { globalLabelKeys, ROUTES_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { buildLink } from '@shared/helpers/build-link';
import { tHtml, tText } from '@shared/helpers/translate';
import { useGetThemes } from '@shared/hooks/use-get-themes/use-get-themes';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { type Theme, ThemeOrderProp, ThemesService } from '@shared/services/themes-service';
import { toastService } from '@shared/services/toast-service';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import { useRouter } from 'next/router';
import React, { type FC, type ReactNode, useCallback, useMemo, useState } from 'react';
import { useQueryParams } from 'use-query-params';

export const ThemesOverviewPage: FC<DefaultSeoInfo> = ({ url, canonicalUrl }) => {
	const locale = useLocale();
	const router = useRouter();

	const [filters, setFilters] = useQueryParams(ADMIN_THEMES_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>('');
	const [themeToDelete, setThemeToDelete] = useState<Theme | null>(null);

	const {
		data: themes,
		isFetching,
		refetch: refetchThemes,
	} = useGetThemes({
		search: filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY],
		// The proxy pages from 0, the query param is 1-based
		page: Math.max(0, filters.page - 1),
		size: ThemesTablePageSize,
		orderProp: filters.orderProp as ThemeOrderProp,
		orderDirection: filters.orderDirection as AvoSearchOrderDirection,
	});

	const sortFilters = useMemo(
		() => [
			{
				id: filters.orderProp,
				desc: filters.orderDirection !== AvoSearchOrderDirection.ASC,
			},
		],
		[filters]
	);

	// Memoized so its identity is stable across renders that don't change `filters`.
	// The Table component re-runs an internal effect whenever this prop's identity changes, so an
	// unmemoized callback here would re-fire it on every render, flooding the History API and
	// tripping Chrome's navigation throttle (crbug.com/1038223).
	const onSortChange = useCallback(
		(orderProp: string | undefined, orderDirection: AvoSearchOrderDirection | undefined) => {
			// The Table calls this with (undefined, undefined) whenever no column is actively sorted,
			// which carries no genuine sort change and would otherwise reset the page unnecessarily.
			if (orderProp === undefined && orderDirection === undefined) {
				return;
			}
			if (filters.orderProp !== orderProp || filters.orderDirection !== orderDirection) {
				setFilters({
					...filters,
					orderProp: orderProp || ThemeOrderProp.slug,
					orderDirection: orderDirection || AvoSearchOrderDirection.ASC,
					page: 1,
				});
			}
		},
		[filters, setFilters]
	);

	const onEditTheme = (theme: Theme): void => {
		router.push(buildLink(ROUTES_BY_LOCALE[locale].adminThemeEdit, { id: theme.id }));
	};

	const onDeleteThemeConfirmed = async (): Promise<void> => {
		if (!themeToDelete) {
			return;
		}
		try {
			await ThemesService.delete(themeToDelete.id);
			setThemeToDelete(null);
			await refetchThemes();
			toastService.notify({
				title: tHtml('modules/admin/views/themes/themes-overview-page___het-thema-is-verwijderd'),
				description: tHtml(
					'modules/admin/views/themes/themes-overview-page___het-thema-is-succesvol-verwijderd'
				),
			});
		} catch (err) {
			console.error(err);
			setThemeToDelete(null);
			toastService.notify({
				title: tHtml('modules/admin/views/themes/themes-overview-page___error'),
				description: tHtml(
					'modules/admin/views/themes/themes-overview-page___het-verwijderen-van-het-thema-is-mislukt'
				),
			});
		}
	};

	const renderEmptyMessage = (): string | ReactNode =>
		tHtml('modules/admin/views/themes/themes-overview-page___er-zijn-nog-geen-themas');

	const renderPageContent = () => {
		const hasData = (themes?.items?.length || 0) > 0;

		return (
			<AdminLayout pageTitle={tText('modules/admin/views/themes/themes-overview-page___themas')}>
				<AdminLayout.Actions>
					{/* No colour variant: the base button is teal, matching the other admin CRUD pages */}
					<Button
						label={tText('modules/admin/views/themes/themes-overview-page___nieuw')}
						onClick={() => router.push(ROUTES_BY_LOCALE[locale].adminThemeCreate)}
					/>
				</AdminLayout.Actions>
				<AdminLayout.Content>
					<div className="p-admin-themes l-container">
						<div className="p-admin-themes__header">
							<SearchBar
								id={globalLabelKeys.adminLayout.title}
								value={search}
								className="p-admin-themes__search"
								placeholder={tText(
									'modules/admin/views/themes/themes-overview-page___zoek-op-themas'
								)}
								onChange={setSearch}
								onSearch={(value) =>
									setFilters({
										[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: value,
										page: 1,
									})
								}
								ariaLabel={tText(
									'modules/admin/views/themes/themes-overview-page___zoek-themas-input-aria-label'
								)}
							/>
						</div>

						<div className="l-container--edgeless-to-lg">
							<Table<Theme>
								className="u-mt-24"
								options={{
									columns: ThemesTableColumns(onEditTheme, setThemeToDelete),
									data: themes?.items || [],
									initialState: {
										pagination: { pageIndex: 0, pageSize: ThemesTablePageSize },
										sorting: sortFilters,
									},
								}}
								onSortChange={onSortChange}
								sortingIcons={sortingIcons}
								showTable={hasData}
								enableRowFocusOnClick={true}
								pagination={(table) => (
									<PaginationBar
										{...getDefaultPaginationBarProps()}
										itemsPerPage={ThemesTablePageSize}
										startItem={Math.max(0, filters.page - 1) * ThemesTablePageSize}
										totalItems={themes?.total || 0}
										onPageChange={(pageZeroBased) => {
											table.setPageIndex(pageZeroBased);
											setFilters({
												...filters,
												page: pageZeroBased + 1,
											});
										}}
									/>
								)}
							/>
						</div>

						{!hasData && (
							<div className="l-container l-container--edgeless-to-lg u-text-center u-color-neutral u-py-48">
								{isFetching
									? tHtml('modules/admin/views/themes/themes-overview-page___laden')
									: renderEmptyMessage()}
							</div>
						)}

						<ConfirmationModal
							isOpen={!!themeToDelete}
							onClose={() => setThemeToDelete(null)}
							onConfirm={onDeleteThemeConfirmed}
							onCancel={() => setThemeToDelete(null)}
						/>
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			<SeoTags
				title={tText('modules/admin/views/themes/themes-overview-page___themas')}
				description={tText(
					'modules/admin/views/themes/themes-overview-page___overzicht-van-alle-themas-binnen-het-archief'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={canonicalUrl}
			/>

			<PermissionsCheck anyPermissions={[Permission.MANAGE_IE_OBJECT_THEMES]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
