import DOMPurify from 'dompurify';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { ReadingRoomNavigation } from '@reading-room/components';
import { useGetReadingRoom } from '@reading-room/hooks/get-reading-room';
import { CardImage } from '@shared/components';
import { RICH_TEXT_SANITIZATION } from '@shared/const';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { selectShowNavigationBorder } from '@shared/store/ui';
import { createPageTitle } from '@shared/utils';

import { VisitorLayout } from 'modules/visitors';

const VisitRequestedPage: NextPage = () => {
	useNavigationBorder();

	const { t } = useTranslation();
	const router = useRouter();

	const { slug } = router.query;

	/**
	 * State
	 */

	const showNavigationBorder = useSelector(selectShowNavigationBorder);

	/**
	 * Data
	 */

	const { data: space } = useGetReadingRoom(slug as string, typeof slug === 'string');

	return (
		<VisitorLayout>
			<div className="p-visit-requested">
				<Head>
					<title>{createPageTitle(space?.name)}</title>
					<meta
						name="description"
						content={space?.info || t('Beschrijving van een leeszaal')}
					/>
				</Head>

				<ReadingRoomNavigation
					title={space?.name}
					phone={space?.contactInfo.telephone || ''}
					email={space?.contactInfo.email || ''}
					showBorder={showNavigationBorder}
				/>

				{/* I'm choosing to duplicate the above instead of splitting to a separate layout because back-button functionality on this page differs from the `[slug]` page */}

				{space && (
					<div className="l-container p-visit-requested__content">
						<section className="p-visit-requested__grid">
							<div className="p-visit-requested__top">
								<h1 className="p-visit-requested__title">
									{t('We hebben je aanvraag ontvangen')}
								</h1>

								<p className="p-visit-requested__instructions u-color-neutral u-mt-24 u-mt-32:md u-mb-56:md">
									{t(
										'Je kan de status van je aanvraag volgen op de Leeszalen pagina. Je ontvangt ook meteen een e-mailmelding als je aanvraag behandeld werd.'
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
								<p className="p-visit-requested__info">
									<b>{space.info}</b>
								</p>

								{space.description && (
									<div
										className="p-visit-requested__description u-mt-32 u-mt-48:md"
										dangerouslySetInnerHTML={{
											__html: String(
												DOMPurify.sanitize(
													space.description, // rich-text content
													RICH_TEXT_SANITIZATION
												)
											),
										}}
									/>
								)}
							</div>
						</section>
					</div>
				)}
			</div>
		</VisitorLayout>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(VisitRequestedPage);
