import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import { tText } from '@shared/helpers/translate';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useWarningBeforeUnload = ({ when, message }: { when: boolean; message?: string }) => {
	const router = useRouter();
	const [hasConfirmed, setHasConfirmed] = useState(false);
	const [nextRoute, setNextRoute] = useState<string | null>(null);

	const isModalOpen = useMemo(() => !!nextRoute, [nextRoute]);

	const messageOrDefault =
		message ||
		tText('Er zijn nog niet opgeslagen wijzigingen. Weet je zeker dat je de pagina wil verlaten?');

	const resetRouteAndHasConfirmed = useCallback(() => {
		setNextRoute(null);
		setHasConfirmed(false);
	}, []);

	const confirmNavigation = useCallback(() => {
		setHasConfirmed(true);
	}, []);

	// Use beforeunload to prevent closing the tab, refreshing the page or moving outside the Next app
	useEffect(() => {
		const handleWindowClose = (event: Event) => {
			if (!when) {
				return;
			}
			event.preventDefault();
			return messageOrDefault;
		};

		window.addEventListener('beforeunload', handleWindowClose);
		return () => {
			window.removeEventListener('beforeunload', handleWindowClose);
		};
	}, [when, messageOrDefault]);

	// Use routeChangeStart to prevent navigation inside the Next app
	useEffect(() => {
		const onRouteChangeStart = (route: string) => {
			if (!when || hasConfirmed) {
				return;
			}

			setNextRoute(route);
			router.events.emit('routeChangeError');
			throw 'navigation aborted';
		};

		const onRouteComplete = () => {
			resetRouteAndHasConfirmed();
		};

		router.events.on('beforeHistoryChange', onRouteChangeStart);
		router.events.on('routeChangeComplete', onRouteComplete);

		return () => {
			router.events.off('beforeHistoryChange', onRouteChangeStart);
			router.events.off('routeChangeComplete', onRouteComplete);
		};
	}, [hasConfirmed, router, when, resetRouteAndHasConfirmed]);

	useEffect(() => {
		if (hasConfirmed) {
			if (!nextRoute) {
				return;
			}
			void router.push(nextRoute);
		}
	}, [nextRoute, hasConfirmed, router]);

	const ConfirmModal = useCallback(
		() => (
			<ConfirmationModal
				text={{
					description: (
						<p className="u-px-24 u-mb-32 u-color-neutral u-text-center">{messageOrDefault}</p>
					),
					yes: tText('Verder werken'),
					no: tText('Ja, ik ben zeker'),
				}}
				buttonWrapperClassName="u-p-24 u-flex-space-between u-flex"
				isOpen={isModalOpen}
				onClose={resetRouteAndHasConfirmed}
				onCancel={confirmNavigation}
				onConfirm={resetRouteAndHasConfirmed}
			/>
		),
		[messageOrDefault, isModalOpen, resetRouteAndHasConfirmed, confirmNavigation]
	);

	return {
		ConfirmModal,
	};
};
