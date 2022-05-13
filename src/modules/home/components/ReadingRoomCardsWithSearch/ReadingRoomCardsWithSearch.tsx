import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useRef, useState } from 'react';
import { StringParam, useQueryParams } from 'use-query-params';

import { useGetReadingRooms } from '@reading-room/hooks/get-reading-rooms';
import { VisitorSpaceInfo } from '@reading-room/types';
import { ReadingRoomCardList, SearchBar, VisitorSpaceCardProps } from '@shared/components';
import { ReadingRoomCardType } from '@shared/components/ReadingRoomCard';
import { SEARCH_QUERY_KEY } from '@shared/const';

const NUMBER_OF_READING_ROOMS = 6;

interface VisitorSpaceCardsWithSearchProps {
	onRequestAccess: (VisitorSpaceSlug: string) => void;
	onSearch?: (value?: string) => void;
}

const ReadingRoomCardsWithSearch: FC<VisitorSpaceCardsWithSearchProps> = ({
	onRequestAccess,
	onSearch,
}) => {
	const { t } = useTranslation();
	const [query, setQuery] = useQueryParams({
		[SEARCH_QUERY_KEY]: StringParam,
	});
	const [areAllReadingRoomsVisible, setAreAllReadingRoomsVisible] = useState(false);
	const resultsAnchor = useRef<HTMLDivElement | null>(null);

	const { data: readingRoomInfo, isLoading: isLoadingReadingRooms } = useGetReadingRooms(
		query.search || undefined,
		0,
		areAllReadingRoomsVisible ? 200 : NUMBER_OF_READING_ROOMS
	);

	useEffect(() => {
		if (query[SEARCH_QUERY_KEY] && resultsAnchor) {
			document.body.scrollTo({ top: resultsAnchor.current?.offsetTop, behavior: 'smooth' });
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	/**
	 * Methods
	 */

	const handleLoadAllReadingRooms = () => {
		setAreAllReadingRoomsVisible(true);
	};

	/**
	 * Computed
	 */

	const readingRoomsLength = readingRoomInfo?.items?.length ?? 0;
	const showLoadMore =
		!areAllReadingRoomsVisible && (readingRoomInfo?.total ?? 0) > NUMBER_OF_READING_ROOMS;

	/**
	 * Render
	 */

	return (
		<div className="l-container u-pt-32 u-pt-80:md u-pb-48 u-pb-80:md">
			<div id="p-home__results-anchor" ref={resultsAnchor} />
			<div className="u-flex u-flex-col u-flex-row:md u-align-center u-justify-between:md u-mb-32 u-mb-80:md">
				<h3 className="p-home__subtitle">{t('pages/index___vind-een-bezoekersruimte')}</h3>

				<SearchBar
					default={query[SEARCH_QUERY_KEY] || undefined}
					variants={['rounded', 'grey', 'icon--double']}
					placeholder={t(
						'modules/home/components/reading-room-cards-with-search/reading-room-cards-with-search___zoek'
					)}
					onSearch={(value) => {
						setQuery({ [SEARCH_QUERY_KEY]: value });
						onSearch?.(value);
					}}
				/>
			</div>

			{isLoadingReadingRooms && <p>{t('pages/index___laden')}</p>}
			{!isLoadingReadingRooms && readingRoomInfo?.items?.length === 0 && (
				<p>{t('pages/index___geen-resultaten-voor-de-geselecteerde-filters')}</p>
			)}
			{!isLoadingReadingRooms && readingRoomsLength > 0 && (
				<ReadingRoomCardList
					className={clsx('p-home__results', {
						'u-mb-64': showLoadMore,
					})}
					items={(readingRoomInfo?.items || []).map(
						(room: VisitorSpaceInfo): VisitorSpaceCardProps => {
							return {
								room,
								type: ReadingRoomCardType.noAccess, // TODO change this based on current logged in user
								onAccessRequest: () => onRequestAccess(room.slug),
							};
						}
					)}
					limit={!areAllReadingRoomsVisible}
				/>
			)}

			{showLoadMore && (
				<div className="u-text-center">
					<Button
						className="u-font-weight-400"
						onClick={handleLoadAllReadingRooms}
						variants={['outline']}
					>
						{t('pages/index___toon-alles-amount', {
							amount: readingRoomInfo?.total,
						})}
					</Button>
				</div>
			)}
		</div>
	);
};

export default ReadingRoomCardsWithSearch;
