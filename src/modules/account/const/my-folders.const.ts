import type { CreateFolderFormState } from '@account/types';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tText } from '@shared/helpers/translate';
import { NumberParam, StringParam, withDefault } from 'use-query-params';
import { boolean, object, type Schema, string } from 'yup';

export const FolderItemListSize = 20;

export const ACCOUNT_FOLDERS_QUERY_PARAM_CONFIG = {
	[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: withDefault(StringParam, undefined),
	page: withDefault(NumberParam, 1),
};

export const COLLECTION_FORM_SCHEMA = (): Schema<CreateFolderFormState> => {
	const nameLengthMin = 3;
	const nameLengthMax = 90;

	return object({
		name: string()
			.test(
				'name',
				tText(
					'modules/account/const/my-folders___de-naam-van-een-map-moet-minstens-count-tekens-lang-zijn',
					{
						count: nameLengthMin,
					}
				),
				(val) => {
					return (val || '').length >= nameLengthMin;
				}
			)
			.test(
				'name',
				tText(
					'modules/account/const/my-folders___de-naam-van-een-map-mag-niet-meer-dan-count-tekens-lang-zijn',
					{
						count: nameLengthMax,
					}
				),
				(val) => {
					return (val || '').length <= nameLengthMax;
				}
			),
		isOrganisation: boolean().optional(),
	});
};

export enum FolderSortOption {
	NEWEST_FIRST = 'NEWEST_FIRST',
	OLDEST_FIRST = 'OLDEST_FIRST',
	NAME_ASC = 'NAME_ASC',
	NAME_DESC = 'NAME_DESC',
}

export const DEFAULT_FOLDER_SORT_OPTION = FolderSortOption.NEWEST_FIRST;

export const GET_FOLDER_SORT_OPTIONS = (): { id: FolderSortOption; label: string }[] => [
	{
		id: FolderSortOption.NAME_ASC,
		label: tText('modules/account/const/my-folders___alfabetisch-a-z'),
	},
	{
		id: FolderSortOption.NAME_DESC,
		label: tText('modules/account/const/my-folders___alfabetisch-z-a'),
	},
	{
		id: FolderSortOption.NEWEST_FIRST,
		label: tText('modules/account/const/my-folders___nieuwste-eerst'),
	},
	{
		id: FolderSortOption.OLDEST_FIRST,
		label: tText('modules/account/const/my-folders___oudste-eerst'),
	},
];

/**
 * Local storage keys to remember the chosen sort order of the folder overviews
 * Personal and organisation folders are sorted independently
 */
export const FOLDER_SORT_STORAGE_KEYS = {
	personal: 'HET_ARCHIEF.folders.sort.personal',
	organisation: 'HET_ARCHIEF.folders.sort.organisation',
};
