import { QUERY_KEYS } from '@shared/const';
import {
	type GetThemeIeObjectsProps,
	ThemesService,
	type ThemeWithIeObjects,
} from '@shared/services/themes-service';
import {
	keepPreviousData,
	type QueryClient,
	type UseQueryResult,
	useQuery,
} from '@tanstack/react-query';

export const useGetThemeIeObjects = (
	props: GetThemeIeObjectsProps,
	enabled: boolean = true
): UseQueryResult<ThemeWithIeObjects> =>
	useQuery({
		queryKey: [QUERY_KEYS.getThemeIeObjects, props],
		queryFn: () => ThemesService.getWithIeObjects(props),
		placeholderData: keepPreviousData,
		enabled,
	});

export async function makeServerSideRequestGetThemeIeObjects(
	queryClient: QueryClient,
	props: GetThemeIeObjectsProps
) {
	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getThemeIeObjects, props],
		queryFn: () => ThemesService.getWithIeObjects(props),
	});
}
