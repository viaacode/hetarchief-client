import { Button, type Column } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { SortDirectionParam } from '@shared/helpers';
import { tText } from '@shared/helpers/translate';
import type { Theme, ThemeFormValues, ThemeIeObject } from '@shared/services/themes-service';
import { ThemeOrderProp } from '@shared/services/themes-service';
import { asDate, formatMediumDate } from '@shared/utils/dates';
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import { NumberParam, StringParam, withDefault } from 'use-query-params';
import { object, type Schema, string } from 'yup';

export const ThemesTablePageSize = 20;

/** Page size of the "Gekoppelde objecten" table on the theme edit page */
export const ThemeIeObjectsTablePageSize = 20;

/**
 * A theme detail page url is an internal path on hetarchief.be, so it must start with a slash and
 * must not carry a protocol or host.
 */
const INTERNAL_PATH_REGEX = /^\/[^\s]*$/;

export const THEME_VALIDATION_SCHEMA = (): Schema<Partial<ThemeFormValues>> =>
	object({
		// A thumbnail is required: it is the fallback image wherever a theme is rendered, such as the
		// theme reels. Validating imageUrl covers both an already stored thumbnail and a freshly
		// picked file, since picking one sets imageUrl to a local preview url.
		imageUrl: string().required(
			tText('modules/admin/const/themes___een-standaard-thumbnail-is-verplicht')
		),
		slug: string()
			.strict()
			.matches(/^[a-z0-9-]+$/, {
				message: tText(
					'modules/admin/const/themes___slug-mag-enkel-kleine-letters-cijfers-en-koppeltekens-bevatten'
				),
			})
			.required(tText('modules/admin/const/themes___slug-is-verplicht')),
		nameNl: string().required(tText('modules/admin/const/themes___nl-benaming-is-verplicht')),
		nameEn: string().required(tText('modules/admin/const/themes___en-benaming-is-verplicht')),
		descriptionNl: string().nullable(),
		descriptionEn: string().nullable(),
		contentPagePathNl: string()
			.nullable()
			.matches(INTERNAL_PATH_REGEX, {
				// Allow empty: the field is optional
				excludeEmptyString: true,
				message: tText(
					'modules/admin/const/themes___geef-een-intern-pad-op-dat-begint-met-een-slash'
				),
			}),
		contentPagePathEn: string()
			.nullable()
			.matches(INTERNAL_PATH_REGEX, {
				excludeEmptyString: true,
				message: tText(
					'modules/admin/const/themes___geef-een-intern-pad-op-dat-begint-met-een-slash'
				),
			}),
	}) as Schema<Partial<ThemeFormValues>>;

/**
 * Split a comma separated list of schema identifiers into a clean, de-duplicated list, preserving
 * the order in which they were entered.
 */
export const parseSchemaIdentifiers = (input: string): string[] => [
	...new Set(
		input
			.split(',')
			.map((identifier) => identifier.trim())
			.filter(Boolean)
	),
];

export const ThemeIeObjectsTableColumns = (
	removeIeObject: (ieObject: ThemeIeObject) => void
): Column<ThemeIeObject>[] => [
	{
		header: tText('modules/admin/const/themes___titel'),
		accessorKey: 'name',
		cell: ({ row }) =>
			row.original.name || (
				<span className="u-color-neutral">{tText('modules/admin/const/themes___geen-titel')}</span>
			),
	},
	{
		header: tText('modules/admin/const/themes___identifier'),
		accessorKey: 'schemaIdentifier',
	},
	{
		header: '',
		id: 'theme-ie-objects-table-actions',
		cell: ({ row }) => (
			<Button
				variants={['silver', 'icon', 'sm']}
				icon={<Icon name={IconNamesLight.Trash} aria-hidden />}
				ariaLabel={tText('modules/admin/const/themes___object-loskoppelen')}
				title={tText('modules/admin/const/themes___object-loskoppelen')}
				onClick={() => removeIeObject(row.original)}
			/>
		),
	},
];

export const ADMIN_THEMES_QUERY_PARAM_CONFIG = {
	[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: withDefault(StringParam, undefined),
	[QUERY_PARAM_KEY.PAGE]: withDefault(NumberParam, 1),
	[QUERY_PARAM_KEY.ORDER_PROP]: withDefault(StringParam, ThemeOrderProp.slug),
	[QUERY_PARAM_KEY.ORDER_DIRECTION]: withDefault(SortDirectionParam, AvoSearchOrderDirection.ASC),
};

export const ThemesTableColumns = (
	editTheme: (theme: Theme) => void,
	deleteTheme: (theme: Theme) => void
): Column<Theme>[] => [
	{
		header: tText('modules/admin/const/themes___slug'),
		accessorKey: ThemeOrderProp.slug,
	},
	{
		header: tText('modules/admin/const/themes___nl-benaming'),
		accessorKey: ThemeOrderProp.nameNl,
	},
	{
		header: tText('modules/admin/const/themes___en-benaming'),
		accessorKey: ThemeOrderProp.nameEn,
	},
	{
		header: tText('modules/admin/const/themes___aangepast-op'),
		accessorKey: ThemeOrderProp.updatedAt,
		cell: ({ row }) => (
			<span className="u-color-neutral">{formatMediumDate(asDate(row.original.updatedAt))}</span>
		),
	},
	{
		header: '',
		id: 'themes-table-actions',
		cell: ({ row }) => (
			<div className="u-inline-flex u-gap-xs">
				<Button
					variants={['silver', 'icon', 'sm']}
					icon={<Icon name={IconNamesLight.Edit} aria-hidden />}
					ariaLabel={tText('modules/admin/const/themes___thema-aanpassen')}
					title={tText('modules/admin/const/themes___thema-aanpassen')}
					onClick={() => editTheme(row.original)}
				/>
				<Button
					variants={['silver', 'icon', 'sm']}
					icon={<Icon name={IconNamesLight.Trash} aria-hidden />}
					ariaLabel={tText('modules/admin/const/themes___thema-verwijderen')}
					title={tText('modules/admin/const/themes___thema-verwijderen')}
					onClick={() => deleteTheme(row.original)}
				/>
			</div>
		),
	},
];
