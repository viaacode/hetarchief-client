import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormControl, TextInput } from '@meemoo/react-components';
import { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactNode, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { selectIsLoggedIn } from '@auth/store/user';
import { Loading } from '@shared/components';
import { ROUTE_PARTS } from '@shared/const';
import { labelKeys, NEWSLETTER_FORM_SCHEMA } from '@shared/const/newsletter';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useStickyLayout } from '@shared/hooks/use-sticky-layout';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { CampaignMonitorService } from '@shared/services/campaign-monitor-service';
import { toastService } from '@shared/services/toast-service';
import { NewsletterFormState } from '@shared/types/newsletter';
import { DefaultSeoInfo } from '@shared/types/seo';

const Newsletter: NextPage<DefaultSeoInfo> = ({ url }) => {
	useHideFooter();
	useStickyLayout();

	const { tText, tHtml } = useTranslation();
	const router = useRouter();
	const {
		handleSubmit,
		formState: { errors },
		control,
		reset,
	} = useForm<NewsletterFormState>({
		resolver: yupResolver(NEWSLETTER_FORM_SCHEMA()),
	});

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

	const onFormSubmit = async (values: NewsletterFormState): Promise<void> => {
		try {
			await CampaignMonitorService.setPreferences({
				preferences: {
					newsletter: true,
				},
				...values,
			});

			reset();

			toastService.notify({
				maxLines: 3,
				title: tText('pages/nieuwsbrief/index___nieuwsbrief___formulier-succes'),
				description: tText(
					'pages/nieuwsbrief/index___nieuwsbrief___formulier-versturen-is-gelukt'
				),
			});
		} catch (err) {
			console.error(err);

			toastService.notify({
				maxLines: 3,
				title: tText('pages/nieuwsbrief/index___nieuwsbrief___formulier-error'),
				description: tText(
					'pages/nieuwsbrief/index___nieuwsbrief___formulier-versturen-is-mislukt'
				),
			});
		}
	};

	const renderNewsletterForm = (): ReactNode => (
		<div className="p-newsletter__form">
			<FormControl
				className="u-mb-24"
				id={labelKeys.firstName}
				errors={[errors.firstName?.message]}
				label={tText('pages/nieuwsbrief/index___nieuwsbrief___formulier-voornaam')}
			>
				<Controller
					name="firstName"
					control={control}
					render={({ field }) => <TextInput {...field} id={labelKeys.firstName} />}
				/>
			</FormControl>

			<FormControl
				className="u-mb-24"
				id={labelKeys.lastName}
				errors={[errors.lastName?.message]}
				label={tText('pages/nieuwsbrief/index___nieuwsbrief___formulier-achternaam')}
			>
				<Controller
					name="lastName"
					control={control}
					render={({ field }) => <TextInput {...field} id={labelKeys.lastName} />}
				/>
			</FormControl>

			<FormControl
				className="u-mb-24"
				id={labelKeys.mail}
				errors={[errors.mail?.message]}
				label={tText('pages/nieuwsbrief/index___nieuwsbrief___formulier-emailadres')}
			>
				<Controller
					name="mail"
					control={control}
					render={({ field }) => <TextInput {...field} id={labelKeys.mail} />}
				/>
			</FormControl>

			<Button
				variants={['dark']}
				className="p-newsletter__form-button"
				label={tText('pages/nieuwsbrief/index___nieuwsbrief___schrijf-me-in')}
				onClick={handleSubmit(onFormSubmit)}
			/>
		</div>
	);

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
				{renderNewsletterForm()}
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
