import type { IPagination } from '@meemoo/admin-core-ui/client';
import { QUERY_KEYS } from '@shared/const';
import { type GetThemesProps, type Theme, ThemesService } from '@shared/services/themes-service';
import {
	keepPreviousData,
	type QueryClient,
	type UseQueryResult,
	useQuery,
} from '@tanstack/react-query';

export const useGetThemes = (
	props: GetThemesProps,
	enabled: boolean = true
): UseQueryResult<IPagination<Theme>> =>
	useQuery({
		queryKey: [QUERY_KEYS.getThemes, props],
		queryFn: () => ThemesService.getAll(props),
		placeholderData: keepPreviousData,
		enabled,
	});

export async function makeServerSideRequestGetThemes(
	queryClient: QueryClient,
	props: GetThemesProps
) {
	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getThemes, props],
		queryFn: () => ThemesService.getAll(props),
	});
}
