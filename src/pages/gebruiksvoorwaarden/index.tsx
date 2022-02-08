import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import DOMPurify from 'isomorphic-dompurify';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { withI18n } from '@i18n/wrappers';
import { RICH_TEXT_SANITIZATION } from '@shared/const';
import { setIsStickyLayout } from '@shared/store/ui';
import { createPageTitle } from '@shared/utils';

const lipsum =
	'<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In cursus quis enim vel consectetur. Mauris imperdiet nibh et tortor eleifend pulvinar. Etiam eget varius ante, sit amet blandit justo. Nam a eleifend tortor. Duis quis risus finibus, efficitur quam ac, tristique ligula. Sed a sollicitudin neque, sed pellentesque justo. Donec suscipit, ex eget volutpat eleifend, purus velit pellentesque massa, et cursus leo metus in odio. Proin facilisis eros sit amet metus scelerisque sodales. Quisque sollicitudin dui lorem, sit amet vestibulum ligula fringilla eu. Vivamus rhoncus erat eu dui mattis lacinia.</p><p>Donec a convallis ante. Morbi ac tincidunt ligula, ut vestibulum arcu. Proin at vestibulum tortor. Suspendisse ac ultrices lorem, a aliquam diam. Curabitur consectetur mauris vel lacus pulvinar pharetra. Nam et ante vestibulum, venenatis nisl ut, tincidunt arcu. Phasellus accumsan blandit arcu, vitae condimentum ante varius quis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam erat volutpat. Curabitur eu auctor eros. Aliquam lorem metus, sagittis ac quam sit amet, sagittis tincidunt ex. Donec lobortis luctus mi.</p><p>Ut sit amet tortor eu urna interdum dictum in quis libero. Vestibulum condimentum, massa at sodales malesuada, ligula metus blandit lacus, in tincidunt sapien mauris ut nisl. Curabitur molestie dignissim nisl. Aenean eget diam nulla. Morbi mollis mauris felis. Suspendisse porttitor ex in ornare maximus. Curabitur ullamcorper, quam non maximus porta, erat enim rutrum sapien, vitae facilisis ante quam vitae ipsum. Proin mattis consequat sollicitudin. Nunc sit amet lobortis quam. Mauris scelerisque id urna ac facilisis. Suspendisse volutpat diam vel eleifend egestas. Quisque molestie, nunc id sodales aliquet, neque tellus euismod eros, id ullamcorper nisi mi non dui.</p><p>Proin imperdiet, metus ac vestibulum varius, erat arcu eleifend justo, non eleifend arcu mauris a sapien. Nullam viverra, est non finibus porta, ipsum lacus commodo diam, volutpat ultricies risus est et justo. Etiam auctor quam est, pharetra tincidunt nisi iaculis vel. Maecenas malesuada feugiat molestie. Aenean gravida erat non nisi blandit faucibus. Proin diam quam, dignissim in porta nec, volutpat vel risus. Ut ornare, sem vitae volutpat sollicitudin, mi ex tristique urna, eu convallis nisl diam ut tortor.</p><p>In cursus est nec arcu consectetur blandit. Morbi sed tempus lectus. Pellentesque sollicitudin justo a ex sollicitudin, vitae faucibus ante tempus. Donec placerat ac urna eu convallis. Phasellus sit amet sapien a felis suscipit cursus non eu libero. Duis mi neque, viverra id diam vel, varius sodales felis. Sed id nunc ut ligula volutpat vehicula. Ut viverra molestie nibh, in iaculis purus ultricies eget. Sed mauris massa, semper ac tempor eget, consectetur elementum massa. Nunc laoreet maximus arcu, ut molestie lacus aliquet vel. Curabitur eleifend egestas ligula nec ullamcorper.</p>';

const TermsOfService: NextPage = () => {
	const [hasFinished, setHasFinished] = useState(false);
	const [isAtBottom, setIsAtBottom] = useState(false);
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const scrollable = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		dispatch(setIsStickyLayout(true));

		return () => {
			dispatch(setIsStickyLayout(false));
		};
	});

	const handleScroll = useCallback(() => {
		const el = scrollable.current;

		if (el !== null) {
			const bottom = el.scrollHeight - el.scrollTop === el.clientHeight;
			setIsAtBottom(bottom);

			if (bottom) {
				setHasFinished(true);
			}
		}
	}, [scrollable]);

	return (
		<div className="p-terms-of-service">
			<Head>
				<title>{createPageTitle('Gebruiksvoorwaarden')}</title>
				<meta
					name="description"
					content={t(
						'pages/gebruiksvoorwaarden/index___gebruiksvoorwaarden-omschrijving'
					)}
				/>
			</Head>

			<div className="p-terms-of-service__background" />

			<section className="u-pt-96 p-terms-of-service__text">
				<div className="l-container">
					<h1 className="p-terms-of-service__title">
						{t('pages/gebruiksvoorwaarden/index___gebruiksvoorwaarden')}
					</h1>

					<div
						ref={scrollable}
						onScroll={handleScroll}
						className="p-terms-of-service__content"
						dangerouslySetInnerHTML={{
							__html: String(
								DOMPurify.sanitize(
									lipsum + lipsum, // rich-text content
									RICH_TEXT_SANITIZATION
								)
							),
						}}
					/>
				</div>
			</section>

			<div
				className={clsx('p-terms-of-service__gradient', {
					'p-terms-of-service__gradient--hidden': isAtBottom,
				})}
			/>

			<section className="u-pt-96 p-terms-of-service__buttons-wrapper">
				<div className="l-container">
					<div className="p-terms-of-service__buttons">
						<Button className="u-mr-8" variants="text">
							{t('pages/gebruiksvoorwaarden/index___annuleer')}
						</Button>
						<Button variants="black" disabled={!hasFinished}>
							{t('pages/gebruiksvoorwaarden/index___aanvaarden')}
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default TermsOfService;
