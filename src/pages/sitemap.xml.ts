import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const SiteMap = (): void => {};

export const getServerSideProps = async ({
	res,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
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
