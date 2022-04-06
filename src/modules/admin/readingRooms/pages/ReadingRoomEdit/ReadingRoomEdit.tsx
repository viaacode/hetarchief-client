import { useTranslation } from 'next-i18next';
import React, { FC } from 'react';

const ReadingRoomEdit: FC = () => {
	const { t } = useTranslation();

	return (
		<div>
			<h2 className="u-mb-40">{t('Bewerk')}</h2>
		</div>
	);
};

export default ReadingRoomEdit;
