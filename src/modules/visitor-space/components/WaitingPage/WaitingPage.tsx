import Head from 'next/head';
import { FC } from 'react';
import { useSelector } from 'react-redux';

import Html from '@shared/components/Html/Html';
import { ROUTES } from '@shared/const';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { selectShowNavigationBorder } from '@shared/store/ui';
import { createPageTitle } from '@shared/utils';

import { CardImage } from '../../../shared/components';
import { useNavigationBorder } from '../../../shared/hooks/use-navigation-border';
import { VisitorSpaceNavigation } from '../VisitorSpaceNavigation';

import { WaitingPageProps } from './WaitingPage.types';

const WaitingPage: FC<WaitingPageProps> = ({ space, backLink }) => {
	useNavigationBorder();

	const { t, tText } = useTranslation();

	const showNavigationBorder = useSelector(selectShowNavigationBorder);

	return (
		<div className="p-visit-requested">
			<Head>
				<title>{createPageTitle(space?.name)}</title>
				<meta
					name="description"
					content={
						space?.info ||
						tText(
							'pages/slug/toegang-aangevraagd/index___beschrijving-van-een-bezoekersruimte'
						)
					}
				/>
			</Head>

			<VisitorSpaceNavigation
				title={space?.name}
				phone={space?.contactInfo.telephone || ''}
				email={space?.contactInfo.email || ''}
				showBorder={showNavigationBorder}
				backLink={backLink ?? ROUTES.home}
			/>

			{/* I'm choosing to duplicate the above instead of splitting to a separate layout because back-button functionality on this page differs from the `[slug]` page */}

			{space && (
				<div className="l-container p-visit-requested__content">
					<section className="p-visit-requested__grid">
						<div className="p-visit-requested__top">
							<h1 className="p-visit-requested__title u-mt-32:md">
								{t(
									'pages/slug/toegang-aangevraagd/index___we-hebben-je-aanvraag-ontvangen'
								)}
							</h1>

							<p className="p-visit-requested__instructions u-color-neutral u-mt-24 u-mt-32:md u-mb-56:md">
								{t(
									'pages/slug/toegang-aangevraagd/index___je-kan-de-status-van-je-aanvraag-volgen-op-de-bezoekersruimtes-pagina-je-ontvangt-ook-meteen-een-e-mailmelding-als-je-aanvraag-behandeld-werd'
								)}
							</p>
						</div>

						<div className="p-visit-requested__image">
							<CardImage
								id={space.id}
								image={space.image}
								color={space.color || '#00c8aa'}
								logo={space.logo}
							/>
						</div>

						<div className="p-visit-requested__bottom u-pt-56:md">
							{space.info && (
								<p className="p-visit-requested__info">
									<b>{space.info}</b>
								</p>
							)}

							{space.description && (
								<Html
									type="div"
									className="p-visit-requested__description u-mt-32 c-content u-padding-top-l"
									content={space.description}
								/>
							)}
						</div>
					</section>
				</div>
			)}
		</div>
	);
};

export default WaitingPage;
