import { FC } from 'react';

import Html from '@shared/components/Html/Html';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import useTranslation from '@shared/hooks/use-translation/use-translation';

import { CardImage } from '../../../shared/components';
import { VisitorSpaceNavigation } from '../VisitorSpaceNavigation';

import { WaitingPageProps } from './WaitingPage.types';

const WaitingPage: FC<WaitingPageProps> = ({ space, backLink }) => {
	const { tHtml } = useTranslation();
	const locale = useLocale();

	const renderPageContent = () => {
		return (
			<>
				<VisitorSpaceNavigation
					title={space?.name}
					phone={space?.contactInfo.telephone || ''}
					email={space?.contactInfo.email || ''}
					backLink={backLink ?? ROUTES_BY_LOCALE[locale].home}
				/>

				{/* I'm choosing to duplicate the above instead of splitting to a separate layout because back-button functionality on this page differs from the `[slug]` page */}

				{space && (
					<div className="l-container p-visit-requested__content">
						<section className="p-visit-requested__grid">
							<div className="p-visit-requested__top">
								<h1 className="p-visit-requested__title u-mt-32:md">
									{tHtml(
										'pages/slug/toegang-aangevraagd/index___we-hebben-je-aanvraag-ontvangen'
									)}
								</h1>

								<p className="p-visit-requested__instructions u-color-neutral u-mt-24 u-mt-32:md u-mb-56:md">
									{tHtml(
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
			</>
		);
	};
	return <div className="p-visit-requested">{renderPageContent()}</div>;
};

export default WaitingPage;
