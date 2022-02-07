import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import { withI18n } from '@i18n/wrappers';
import { createPageTitle } from '@shared/utils';

const ReadingRoomPage: NextPage = () => {
	/**
	 * Render
	 */

	return (
		<div className="p-object-detail">
			<Head>
				<title>{createPageTitle('Object detail')}</title>
				<meta name="description" content="Object detail omschrijving" />
			</Head>

			<h2>Object detail</h2>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default ReadingRoomPage;
