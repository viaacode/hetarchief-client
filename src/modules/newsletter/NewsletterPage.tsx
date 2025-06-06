import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormControl, TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { type FC, type ReactNode, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { COMMUNICATION_SECTION_ID } from '@account/const/MyProfile.consts';
import { selectHasCheckedLogin, selectIsLoggedIn } from '@auth/store/user';
import { Loading } from '@shared/components/Loading';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { NEWSLETTER_FORM_SCHEMA, labelKeys } from '@shared/const/newsletter';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { useStickyLayout } from '@shared/hooks/use-sticky-layout';
import { CampaignMonitorService } from '@shared/services/campaign-monitor-service';
import { toastService } from '@shared/services/toast-service';
import type { NewsletterFormState } from '@shared/types/newsletter';
import type { DefaultSeoInfo } from '@shared/types/seo';

export const NewsletterPage: FC<DefaultSeoInfo> = ({ url }) => {
	useHideFooter();
	useStickyLayout();

	const router = useRouter();
	const locale = useLocale();
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
	const hasCheckedLogin: boolean = useSelector(selectHasCheckedLogin);

	useEffect(() => {
		setTriggerRedirect(hasCheckedLogin && isLoggedIn);
	}, [hasCheckedLogin, isLoggedIn]);

	useEffect(() => {
		if (!triggerRedirect) {
			return;
		}

		router.replace(
			`/${ROUTE_PARTS_BY_LOCALE[locale].account}/${ROUTE_PARTS_BY_LOCALE[locale].myProfile}#${COMMUNICATION_SECTION_ID}`
		);
	}, [locale, router, triggerRedirect]);

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
				title: tText('pages/nieuwsbrief/index___nieuwsbrief-formulier-succes'),
				description: tText('pages/nieuwsbrief/index___nieuwsbrief-formulier-versturen-is-gelukt'),
			});
		} catch (err) {
			console.error(err);

			toastService.notify({
				maxLines: 3,
				title: tText('pages/nieuwsbrief/index___nieuwsbrief-formulier-error'),
				description: tText('pages/nieuwsbrief/index___nieuwsbrief-formulier-versturen-is-mislukt'),
			});
		}
	};

	const renderNewsletterForm = (): ReactNode => (
		<div className="p-newsletter__form">
			<FormControl
				className="u-mb-24"
				id={labelKeys.firstName}
				errors={[<RedFormWarning error={errors.firstName?.message} key="form-error--first-name" />]}
				label={tText('pages/nieuwsbrief/index___nieuwsbrief-formulier-voornaam')}
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
				errors={[<RedFormWarning error={errors.lastName?.message} key="form-error--last-name" />]}
				label={tText('pages/nieuwsbrief/index___nieuwsbrief-formulier-achternaam')}
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
				errors={[<RedFormWarning key="email-error--" error={errors.mail?.message} />]}
				label={tText('pages/nieuwsbrief/index___nieuwsbrief-formulier-emailadres')}
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
				label={tText('pages/nieuwsbrief/index___nieuwsbrief-schrijf-me-in')}
				onClick={handleSubmit(onFormSubmit)}
			/>

			<Button
				variants={['silver']}
				className="p-newsletter__form-button u-ml-8"
				label={tText('pages/nieuwsbrief/index___naar-de-startpagina')}
				onClick={async () => {
					await router.push('/');
				}}
			/>
		</div>
	);

	const renderPageContent = () => (
		<div className="p-newsletter__wrapper l-container">
			<section className="p-newsletter__content">
				<header className="p-newsletter__header">
					<h2 className="p-newsletter__title">
						{tText(
							'pages/nieuwsbrief/index___nieuwsbrief-schrijf-je-in-voor-onze-nieuwsbrief-titel'
						)}
					</h2>
					<p className="p-newsletter__text">
						{tHtml(
							'pages/nieuwsbrief/index___nieuwsbrief-schrijf-je-in-voor-onze-nieuwsbrief-omschrijving'
						)}
					</p>
				</header>
				{renderNewsletterForm()}
			</section>
		</div>
	);

	return (
		<div className="p-newsletter">
			<div
				className={clsx({
					'p-newsletter--wallpaper': !isLoggedIn && hasCheckedLogin,
				})}
			>
				<SeoTags
					title={tText('pages/nieuwsbrief/index___nieuwsbrief')}
					description={tText('pages/nieuwsbrief/index___nieuwsbrief-omschrijving')}
					imgUrl={undefined}
					translatedPages={[]}
					relativeUrl={url}
				/>

				{(hasCheckedLogin && isLoggedIn) || !hasCheckedLogin ? (
					<Loading fullscreen owner="newsletter" />
				) : (
					renderPageContent()
				)}
			</div>
		</div>
	);
};
