import { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectIsLoggedIn } from '@auth/store/user';
import { Loading } from '@shared/components';
import { ROUTE_PARTS } from '@shared/const';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useStickyLayout } from '@shared/hooks/use-sticky-layout';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

const Newsletter: NextPage<DefaultSeoInfo> = ({ url }) => {
	useHideFooter();
	useStickyLayout();

	const { tText, tHtml } = useTranslation();
	const router = useRouter();

	const [triggerRedirect, setTriggerRedirect] = useState(false);

	const isLoggedIn = useSelector(selectIsLoggedIn);

	useEffect(() => {
		setTriggerRedirect(isLoggedIn);
	}, [isLoggedIn]);

	useEffect(() => {
		if (!triggerRedirect) {
			return;
		}

		router.replace(`/${ROUTE_PARTS.account}/${ROUTE_PARTS.myProfile}`);
	}, [router, triggerRedirect]);

	const renderPageContent = () => (
		<div className="p-newsletter__wrapper l-container">
			<section className="p-newsletter__content">
				<header className="p-newsletter__header">
					<h2 className="p-newsletter__title">
						{tText(
							'pages/nieuwsbrief/index___nieuwsbrief___schrijf-je-in-voor-onze-nieuwsbrief-titel'
						)}
					</h2>
					<p className="p-newsletter__text">
						{tHtml(
							'pages/nieuwsbrief/index___nieuwsbrief___schrijf-je-in-voor-onze-nieuwsbrief-omschrijving'
						)}
					</p>
				</header>
				<div>FORM</div>
			</section>
		</div>
	);

	return (
		<div className="p-newsletter">
			{renderOgTags(
				tText('pages/nieuwsbrief/index___nieuwsbrief'),
				tText('pages/nieuwsbrief/index___nieuwsbrief-omschrijving'),
				url
			)}

			{isLoggedIn ? <Loading fullscreen owner="newsletter" /> : renderPageContent()}
		</div>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default Newsletter;
