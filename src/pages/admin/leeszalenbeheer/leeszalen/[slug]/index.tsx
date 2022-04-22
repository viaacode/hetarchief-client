import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { AdminLayout } from '@admin/layouts';
import { ReadingRoomSettings } from '@cp/components';
import { useGetReadingRoom } from '@reading-room/hooks/get-reading-room';
import { Loading } from '@shared/components';
import { createPageTitle } from '@shared/utils';

const ReadingRoomEdit: FC = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const slug = router.query.slug;

	const { data: readingRoomInfo, isLoading, refetch } = useGetReadingRoom(slug as string);

	return (
		<>
			<Head>
				<title>
					{createPageTitle(
						t('pages/admin/leeszalenbeheer/leeszalen/slug/index___instellingen')
					)}
				</title>
				<meta
					name="description"
					content={t(
						'pages/admin/leeszalenbeheer/leeszalen/slug/index___instellingen-meta-omscrhijving'
					)}
				/>
			</Head>

			<AdminLayout
				contentTitle={t('pages/admin/leeszalenbeheer/leeszalen/slug/index___instellingen')}
			>
				<div>
					{isLoading && <Loading />}
					{readingRoomInfo && (
						<ReadingRoomSettings room={readingRoomInfo} refetch={refetch} />
					)}
				</div>
			</AdminLayout>
		</>
	);
};

export default ReadingRoomEdit;
