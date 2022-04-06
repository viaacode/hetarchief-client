import { useTranslation } from 'next-i18next';
import React, { FC } from 'react';

const ReadingRoomsOverview: FC = () => {
	const { t } = useTranslation();

	return (
		<div>
			<h2 className="u-mb-40">
				{t('modules/admin/reading-rooms/pages/requests/requests___aanvragen')}
			</h2>
		</div>
	);
};

export default ReadingRoomsOverview;
