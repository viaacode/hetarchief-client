import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

const SiteMap = (): null => {
	return null;
};

export const getServerSideProps = async ({
	res,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Record<string, never>>> => {
	const request = await fetch(process.env.SITEMAP_URL);
	const sitemap = await request.text();

	res.setHeader('Content-Type', 'text/xml');
	res.write(sitemap);
	res.end();

	return {
		props: {},
	};
};

export default SiteMap;
