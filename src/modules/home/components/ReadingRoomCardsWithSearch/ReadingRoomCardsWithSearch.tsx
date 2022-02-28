import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { FC, useState } from 'react';
import { StringParam, useQueryParams } from 'use-query-params';

import { useGetReadingRooms } from '@reading-room/hooks/get-reading-rooms';
import { ReadingRoomInfo } from '@reading-room/types';
import { ReadingRoomCardList, ReadingRoomCardProps, SearchBar } from '@shared/components';
import { ReadingRoomCardType } from '@shared/components/ReadingRoomCard';

const NUMBER_OF_READING_ROOMS = 6;

interface ReadingRoomCardsWithSearchProps {
	onRequestAccess: (ReadingRoomId: string) => void;
}

const ReadingRoomCardsWithSearch: FC<ReadingRoomCardsWithSearchProps> = ({ onRequestAccess }) => {
	const { t } = useTranslation();
	const [query, setQuery] = useQueryParams({
		search: StringParam,
	});
	const [areAllReadingRoomsVisible, setAreAllReadingRoomsVisible] = useState(false);

	const { data: readingRoomInfo, isLoading: isLoadingReadingRooms } = useGetReadingRooms(
		query.search || undefined,
		0,
		areAllReadingRoomsVisible ? 200 : NUMBER_OF_READING_ROOMS
	);

	/**
	 * Methods
	 */

	const handleLoadAllReadingRooms = () => {
		setAreAllReadingRoomsVisible(true);
	};

	const onClearSearch = () => {
		setQuery({ search: '' });
	};

	const onSearch = (searchValue: string) => {
		setQuery({ search: searchValue });
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
			<div className="u-flex u-flex-col u-flex-row:md u-align-center u-justify-between:md u-mb-32 u-mb-80:md">
				<h3 className="p-home__subtitle">{t('pages/index___vind-een-leeszaal')}</h3>

				<SearchBar
					className="p-home__search"
					backspaceRemovesValue={false}
					instanceId="home-seach-bar"
					placeholder={t('pages/index___zoek')}
					searchValue={query.search ?? ''}
					onClear={onClearSearch}
					onSearch={onSearch}
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
						(room: ReadingRoomInfo): ReadingRoomCardProps => {
							return {
								room: {
									color: room.color || undefined,
									description: room.description || undefined,
									id: room.id,
									image: room.image || undefined,
									name: room.name,
									logo: room.logo,
								},
								type: ReadingRoomCardType.noAccess, // TODO change this based on current logged in user
								onAccessRequest: () => onRequestAccess(room.id),
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
