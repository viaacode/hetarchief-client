import type { FC } from 'react';

import { CardImage } from '@shared/components/CardImage';
import Html from '@shared/components/Html/Html';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { tHtml } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { Locale } from '@shared/utils/i18n';
import { VisitorSpaceNavigation } from '@visitor-space/components/VisitorSpaceNavigation/VisitorSpaceNavigation';

import type { WaitingPageProps } from './WaitingPage.types';

const WaitingPage: FC<WaitingPageProps> = ({ visitorSpace, backLink }) => {
	const locale = useLocale();

	const renderPageContent = () => {
		return (
			<>
				<VisitorSpaceNavigation
					title={visitorSpace?.name}
					phone={visitorSpace?.contactInfo.telephone || ''}
					email={visitorSpace?.contactInfo.email || ''}
					backLink={backLink ?? ROUTES_BY_LOCALE[locale].home}
				/>

				{/* I'm choosing to duplicate the above instead of splitting to a separate layout because back-button functionality on this page differs from the `[slug]` page */}

				{visitorSpace && (
					<div className="l-container p-visit-requested__content">
						<section className="p-visit-requested__grid">
							<div className="p-visit-requested__top">
								<h1 className="p-visit-requested__title u-mt-32-md">
									{tHtml('pages/slug/toegang-aangevraagd/index___we-hebben-je-aanvraag-ontvangen')}
								</h1>

								<p className="p-visit-requested__instructions u-color-neutral u-mt-24 u-mt-32-md u-mb-56-md">
									{tHtml(
										'pages/slug/toegang-aangevraagd/index___je-kan-de-status-van-je-aanvraag-volgen-op-de-bezoekersruimtes-pagina-je-ontvangt-ook-meteen-een-e-mailmelding-als-je-aanvraag-behandeld-werd'
									)}
								</p>
							</div>

							<div className="p-visit-requested__image">
								<CardImage
									id={visitorSpace.id}
									image={visitorSpace.image}
									color={visitorSpace.color || '#00c8aa'}
									logo={visitorSpace.logo}
								/>
							</div>

							<div className="p-visit-requested__bottom u-pt-56-md">
								{visitorSpace.info && locale === Locale.nl && (
									<p className="p-visit-requested__info">
										<b>{visitorSpace.info}</b>
									</p>
								)}

								{locale === Locale.nl && visitorSpace.descriptionNl && (
									<Html
										type="div"
										className="p-visit-requested__description u-mt-32 c-content u-padding-top-l"
										content={visitorSpace.descriptionNl}
									/>
								)}

								{locale === Locale.en && visitorSpace.descriptionEn && (
									<Html
										type="div"
										className="p-visit-requested__description u-mt-32 c-content u-padding-top-l"
										content={visitorSpace.descriptionEn}
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
