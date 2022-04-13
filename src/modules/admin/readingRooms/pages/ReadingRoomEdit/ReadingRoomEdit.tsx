import { useTranslation } from 'next-i18next';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

import { ReadingRoomSettings } from '@cp/components';
import { useGetReadingRoom } from '@reading-room/hooks/get-reading-room';
import { Loading } from '@shared/components';

const ReadingRoomEdit: FC = () => {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();

	const { data: readingRoomInfo, isLoading, refetch } = useGetReadingRoom(id);

	return (
		<div>
			<h2 className="u-mb-40">
				{t(
					'modules/admin/reading-rooms/pages/reading-room-edit/reading-room-edit___instellingen'
				)}
			</h2>
			{isLoading && <Loading />}
			{readingRoomInfo && <ReadingRoomSettings room={readingRoomInfo} refetch={refetch} />}
		</div>
	);
};

export default ReadingRoomEdit;
