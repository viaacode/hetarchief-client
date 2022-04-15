import { useTranslation } from 'next-i18next';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

import { ReadingRoomSettings } from '@cp/components';
import { useGetReadingRoom } from '@reading-room/hooks/get-reading-room';
import { Loading } from '@shared/components';

const ReadingRoomEdit: FC = () => {
	const { t } = useTranslation();
	const { slug } = useParams<{ slug: string }>();

	const { data: readingRoomInfo, isLoading, refetch } = useGetReadingRoom(slug);

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
