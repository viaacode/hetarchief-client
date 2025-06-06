import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { clamp, compact, isNil, round } from 'lodash-es';
import { useRouter } from 'next/router';
import type { TileSource, TiledImageOptions, Viewer } from 'openseadragon';
import { parseUrl } from 'query-string';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import {
	HIGHLIGHT_MARGIN,
	IiifViewerAction,
	type IiifViewerFullscreenEvent,
	type IiifViewerGoToPageEvent,
	type IiifViewerProps,
	type IiifViewerRotateEvent,
	type IiifViewerUpdateHighlightedAltoTextsEvent,
	type IiifViewerZoomEvent,
	type IiifViewerZoomToEvent,
	type IiifViewerZoomToRectEvent,
	type ImageSize,
	type Rect,
	type TextLine,
} from '@iiif-viewer/IiifViewer.types';
import { SearchInputWithResultsPagination } from '@iiif-viewer/components/SearchInputWithResults/SearchInputWithResultsPagination';
import {
	destroyOpenSeadragonViewerMouseTracker,
	initOpenSeadragonViewerMouseTracker,
} from '@iiif-viewer/helpers/iiif-viewer-selection-handler';
import { getOpenSeadragonConfig } from '@iiif-viewer/openseadragon-config';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useStickyLayout } from '@shared/hooks/use-sticky-layout';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { Breakpoints } from '@shared/types';
import { isBrowser, isServerSideRendering } from '@shared/utils/is-browser';

import styles from './IiifViewer.module.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';

export const IiifViewer = ({
	imageInfosWithTokens,
	id,
	isTextOverlayVisible,
	setIsTextOverlayVisible,
	activeImageIndex,
	setActiveImageIndex,
	initialFocusX,
	initialFocusY,
	initialZoomLevel,
	isSearchEnabled,
	searchTerms,
	setSearchTerms,
	onSearch,
	onClearSearch,
	currentSearchIndex,
	searchResults,
	setSearchResultIndex,
	onSelection,
	enableSelection = false,
	onPageChanged,
	onReady,
}: IiifViewerProps) => {
	/**
	 * Hooks
	 */
	const [iiifViewerInitializedPromise, setIiifViewerInitializedPromise] =
		useState<Promise<void> | null>(null);
	const [iiifViewerInitializedPromiseResolve, setIiifViewerInitializedPromiseResolved] = useState<
		(() => void) | null
	>(null);
	/**
	 * Init a promise that resolves when the iiif viewer is ready hooking up event listeners
	 */
	useEffect(() => {
		const promise = new Promise<void>((resolve) => {
			setIiifViewerInitializedPromiseResolved(() => resolve);
		});
		setIiifViewerInitializedPromise(promise);
	}, []);

	const router = useRouter();
	const [iiifGridViewEnabled, setIiifGridViewEnabled] = useState<boolean>(false);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const getOpenSeaDragonLib = (): any | null => {
		// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
		return (window as any).meemoo__iiifViewerLib || null;
	};
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const setOpenSeaDragonLib = (newOpenSeaDragonLib: any) =>
		// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		((window as any).meemoo__iiifViewerLib = newOpenSeaDragonLib);
	const getOpenSeaDragonViewer = (): Promise<OpenSeadragon.Viewer> => {
		// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
		return (window as any).meemoo__iiifViewer || null;
	};
	const setOpenSeadragonViewer = (newOpenSeaDragonViewer: Viewer) => {
		// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
		(window as any).meemoo__iiifViewer = newOpenSeaDragonViewer;
	};
	const getActiveImageTileSource = async (): Promise<TileSource> => {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const viewer = (await getOpenSeaDragonViewer()) as any;
		if (viewer.source) {
			return viewer.source as TileSource;
		}
		// else, wait for source to be available
		return new Promise((resolve) => {
			viewer.addOnceHandler('open', () => {
				resolve(viewer.source as TileSource);
			});
		});
	};

	const [isSelectionActive, setIsSelectionActive] = useState<boolean>(false);

	const handleIsSelectionActiveChange = (newIsSelectionActive: boolean) => {
		setIsSelectionActive(newIsSelectionActive);
		// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
		(window as any).isSelectionActive = newIsSelectionActive;
		return newIsSelectionActive;
	};
	const [highlightedAltoTextInfo, setHighlightedAltoTextInfo] = useState<{
		highlightedAltoTexts: TextLine[];
		selectedAltoText: TextLine | null;
	}>({ highlightedAltoTexts: [], selectedAltoText: null });

	useEffect(() => {
		console.log(`[PERFORMANCE] ${new Date().toISOString()} init iiif viewer`);
	}, []);

	// Layout
	useStickyLayout();
	useHideFooter();

	// Sizes
	const windowSize = useWindowSizeContext();

	// media info

	const iiifViewerId: string | undefined = id;

	/**
	 * Computed
	 */
	const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.md);

	/**
	 * Effects
	 */

	/**
	 * Listen for custom html events and execute the corresponding actions
	 * Since implementing this with forwardRef causes a lot of renders and kills performance
	 * https://meemoo.atlassian.net/browse/ARC-2974
	 * https://meemoo.atlassian.net/browse/ARC-2986
	 * 		iiifZoomToRect,
	 * 		iiifRotate,
	 * 		iiifFullscreen,
	 * 		iiifZoom,
	 * 		iiifZoomTo,
	 * 		iiifGoToHome,
	 * 		iiifGoToPage,
	 * 		waitForReadyState,
	 * 		updateHighlightedAltoTexts,
	 */

	useEffect(() => {
		const handleZoomToRectEvent = (evt: IiifViewerZoomToRectEvent) => {
			iiifZoomToRect({
				x: evt.functionProps.x,
				y: evt.functionProps.y,
				width: evt.functionProps.width,
				height: evt.functionProps.height,
			});
		};

		const handleRotateEvent = (evt: IiifViewerRotateEvent) => {
			iiifRotate(evt.functionProps.rotateRight);
		};

		const handleFullScreenEvent = (evt: IiifViewerFullscreenEvent) => {
			iiifFullscreen(evt.functionProps.expand);
		};

		const handleZoomEvent = (evt: IiifViewerZoomEvent) => {
			iiifZoom(evt.functionProps.multiplier);
		};

		const handleZoomToEvent = (evt: IiifViewerZoomToEvent) => {
			iiifZoomTo(evt.functionProps.x, evt.functionProps.y);
		};

		const handleGoToHomeEvent = () => {
			iiifGoToHome();
		};

		const handleGoToPageEvent = (evt: IiifViewerGoToPageEvent) => {
			iiifGoToPage(evt.functionProps.pageIndex);
		};

		const handleUpdateHighlightedAltoTextsEvent = (
			evt: IiifViewerUpdateHighlightedAltoTextsEvent
		) => {
			setHighlightedAltoTextInfo({
				highlightedAltoTexts: evt.functionProps.highlightedAltoTexts || [],
				selectedAltoText: evt.functionProps.selectedAltoText || null,
			});
		};

		window.addEventListener(
			IiifViewerAction.IIIF_VIEWER_ZOOM_TO_RECT,
			handleZoomToRectEvent as EventListener
		);
		window.addEventListener(
			IiifViewerAction.IIIF_VIEWER_ROTATE,
			handleRotateEvent as EventListener
		);
		window.addEventListener(
			IiifViewerAction.IIIF_VIEWER_FULLSCREEN,
			handleFullScreenEvent as EventListener
		);
		window.addEventListener(IiifViewerAction.IIIF_VIEWER_ZOOM, handleZoomEvent as EventListener);
		window.addEventListener(
			IiifViewerAction.IIIF_VIEWER_ZOOM_TO,
			handleZoomToEvent as EventListener
		);
		window.addEventListener(
			IiifViewerAction.IIIF_VIEWER_GO_TO_HOME,
			handleGoToHomeEvent as EventListener
		);
		window.addEventListener(
			IiifViewerAction.IIIF_VIEWER_GO_TO_PAGE,
			handleGoToPageEvent as EventListener
		);
		window.addEventListener(
			IiifViewerAction.IIIF_VIEWER_UPDATE_HIGHLIGHTED_ALTO_TEXTS,
			handleUpdateHighlightedAltoTextsEvent as EventListener
		);

		return () => {
			window.removeEventListener(
				IiifViewerAction.IIIF_VIEWER_ZOOM_TO_RECT,
				handleZoomToRectEvent as EventListener
			);
			window.removeEventListener(
				IiifViewerAction.IIIF_VIEWER_ROTATE,
				handleRotateEvent as EventListener
			);
			window.removeEventListener(
				IiifViewerAction.IIIF_VIEWER_FULLSCREEN,
				handleFullScreenEvent as EventListener
			);
			window.removeEventListener(
				IiifViewerAction.IIIF_VIEWER_ZOOM,
				handleZoomEvent as EventListener
			);
			window.removeEventListener(
				IiifViewerAction.IIIF_VIEWER_ZOOM_TO,
				handleZoomToEvent as EventListener
			);
			window.removeEventListener(
				IiifViewerAction.IIIF_VIEWER_GO_TO_HOME,
				handleGoToHomeEvent as EventListener
			);
			window.removeEventListener(
				IiifViewerAction.IIIF_VIEWER_GO_TO_PAGE,
				handleGoToPageEvent as EventListener
			);
			window.removeEventListener(
				IiifViewerAction.IIIF_VIEWER_UPDATE_HIGHLIGHTED_ALTO_TEXTS,
				handleUpdateHighlightedAltoTextsEvent as EventListener
			);
		};
	}, []);

	/**
	 * When the highlighted texts change, update them in the OpenSeaDragon viewer
	 */
	useEffect(() => {
		updateHighlightedAltoTexts(
			highlightedAltoTextInfo.highlightedAltoTexts,
			highlightedAltoTextInfo.selectedAltoText
		);
	}, [highlightedAltoTextInfo]);

	/**
	 * Set the current page index in the OpenSeaDragon viewer when the activeImageIndex changes.
	 */
	// biome-ignore lint/correctness/useExhaustiveDependencies: since openSeaDragonViewer is stored outside React, this could create a rerender loop
	const handlePageIndexChanged = useCallback(async () => {
		const viewer = await getOpenSeaDragonViewer();
		const source = await getActiveImageTileSource();
		if (viewer && source) {
			viewer.clearOverlays();
			viewer.goToPage(activeImageIndex);
		}
	}, [activeImageIndex]);
	useEffect(() => {
		handlePageIndexChanged();
	}, [handlePageIndexChanged]);

	const addFullscreenCloseButton = useCallback((openSeadragonViewer: OpenSeadragon.Viewer) => {
		if (!openSeadragonViewer.container) {
			return;
		}
		const bottomLeftContainer = openSeadragonViewer.container.querySelector(
			'.openseadragon-canvas + div + div + div'
		);
		if (!bottomLeftContainer) {
			return;
		}
		bottomLeftContainer.innerHTML = '';
		const closeFullscreenButton = document.createElement('button');
		closeFullscreenButton.className =
			'c-iiif-viewer__iiif__close-fullscreen c-button c-button--icon c-button--white';
		closeFullscreenButton.innerHTML = 'times';
		closeFullscreenButton.title = tText('modules/iiif-viewer/iiif-viewer___sluit-volledig-scherm');
		closeFullscreenButton.addEventListener('click', () => {
			openSeadragonViewer.setFullScreen(false);
		});
		bottomLeftContainer?.append(closeFullscreenButton);
	}, []);

	/**
	 * Show or hide bottom border, if reference strip is scrollable
	 * https://meemoo.atlassian.net/browse/ARC-2855
	 */
	const checkReferenceStripBottomBorder = useCallback(() => {
		const referenceStrip = document.querySelector(
			'[class*="IiifViewer_c-iiif-viewer__iiif__reference-strip__"]'
		);
		if (!referenceStrip) {
			return;
		}
		const scrollHeight = referenceStrip.scrollHeight;
		const height = referenceStrip.clientHeight;

		if (scrollHeight > height) {
			// Elements scrolls, show after element
			referenceStrip.classList.add(styles['c-iiif-viewer__iiif__reference-strip--scrollable']);
		} else {
			// Elements doesn't scroll, hide after element
			referenceStrip.classList.remove(styles['c-iiif-viewer__iiif__reference-strip--scrollable']);
		}
	}, []);

	useEffect(() => {
		window.addEventListener('resize', checkReferenceStripBottomBorder);
		checkReferenceStripBottomBorder();

		return () => {
			window.removeEventListener('resize', checkReferenceStripBottomBorder);
		};
	}, [checkReferenceStripBottomBorder]);

	const getCurrentImageSize = (): ImageSize => {
		// biome-ignore lint/suspicious/noExplicitAny: tile source isn't typed yet
		const tileSource = getActiveImageTileSource() as any;
		const imageSize = {
			width: tileSource?.width || tileSource?.dimensions.x,
			height: tileSource?.height || tileSource?.dimensions.y,
		};
		if (!imageSize.width || !imageSize.height) {
			throw new Error(
				JSON.stringify(
					{
						message: 'Failed to get image size from the current tile source',
						additionalInfo: {
							activeImageTileSource: tileSource,
							activeImageIndex,
						},
					},
					null,
					2
				)
			);
		}
		return imageSize;
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: We don't include the tile source since it causes a rerender loop
	const updateHighlightedAltoTexts = useCallback(
		async (highlightedAltoTexts: TextLine[], selectedHighlightedAltoText: TextLine | null) => {
			if (isServerSideRendering()) {
				console.error('skipping updateHighlightedAltoTexts on SSR');
				return;
			}

			const viewer = await getOpenSeaDragonViewer();
			if (!viewer) {
				// console.error(
				// 	'skipping updateHighlightedAltoTexts since OpenSeaDragon is not initialized',
				// 	{
				// 		openSeaDragonViewer: viewer,
				// 		openSeaDragonLib: getOpenSeaDragonLib(),
				// 	}
				// );
				return null;
			}

			if (!highlightedAltoTexts?.length) {
				// console.error(
				// 	'skipping updateHighlightedAltoTexts since no highlighted texts are provided'
				// );
				return;
			}

			const tileSource = await getActiveImageTileSource();
			if (!tileSource) {
				// console.error('skipping updateHighlightedAltoTexts since no tile source is available', {
				// 	tileSource,
				// });
				return;
			}
			const imageWidth: number | undefined = tileSource?.dimensions?.x;
			const imageHeight: number | undefined = tileSource?.dimensions?.y;

			if (!imageWidth || !imageHeight) {
				// console.error(
				// 	'skipping updateHighlightedAltoTexts since no image width/height is available'
				// );
				throw new Error('Failed to find current page width/height');
			}

			(await getOpenSeaDragonViewer()).clearOverlays();

			for (const altoTextLocation of highlightedAltoTexts || []) {
				const x = altoTextLocation.x / imageWidth - HIGHLIGHT_MARGIN;
				// All coordinates are relative to the image width even the y coordinates
				const y = altoTextLocation.y / imageWidth - HIGHLIGHT_MARGIN;
				const width = altoTextLocation.width / imageWidth + HIGHLIGHT_MARGIN * 2;
				// All coordinates are relative to the image width even the height
				const height = altoTextLocation.height / imageWidth + HIGHLIGHT_MARGIN * 2;
				const isSymbols = /^[^a-zA-Z0-9]$/g.test(altoTextLocation.text);
				if (
					!x ||
					!y ||
					!width ||
					!height ||
					x < 0 ||
					y < 0 ||
					x + width < 0 ||
					y + height < 0 ||
					isSymbols
				) {
					// This text overlay doesn't make sense,
					// since it's outside the image or the position isn't fully defined
					return;
				}
				const span = document.createElement('SPAN');
				span.className = `c-iiif-viewer__iiif__alto__text${
					altoTextLocation === selectedHighlightedAltoText
						? ' c-iiif-viewer__iiif__alto__text--selected'
						: ' c-iiif-viewer__iiif__alto__text--highlighted'
				}`;
				(await getOpenSeaDragonViewer()).addOverlay(
					span,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					new (getOpenSeaDragonLib() as any).Rect(x, y, width, height, 0),
					getOpenSeaDragonLib().Placement.TOP_LEFT
				);
			}
		},
		[]
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only update the pan and zoom once when loading the iiif viewer
	const applyInitialZoomAndPan = useCallback(
		// biome-ignore lint/suspicious/noExplicitAny: open sea dragon lib isn't typed yet
		(openSeadragonViewerTemp: Viewer, openSeadragonLibTemp: any) => {
			openSeadragonViewerTemp.addOnceHandler('open', () => {
				// When the viewer is initialized, set the desired zoom and pan
				if (!isNil(initialFocusX) && !isNil(initialFocusY) && !isNil(initialZoomLevel)) {
					const centerPoint = new openSeadragonLibTemp.Point(initialFocusX, initialFocusY);
					openSeadragonViewerTemp.viewport.panTo(centerPoint, true);
					openSeadragonViewerTemp.viewport.zoomTo(initialZoomLevel, centerPoint, true);
				}
			});
		},
		[highlightedAltoTextInfo]
	);

	const handleViewportChanged = useCallback(
		(openSeadragonViewerTemp: Viewer) => {
			if (!openSeadragonViewerTemp) {
				return;
			}
			if (!window.location.href.includes(id)) {
				// Do not update query params if we're not on the detail page anymore
				// since the update viewport event still fires when navigating away from the detail page
				// https://meemoo.atlassian.net/browse/ARC-2228
				return;
			}
			const zoomLevel = openSeadragonViewerTemp.viewport.getZoom();
			const centerPoint = openSeadragonViewerTemp.viewport.getCenter();
			// Use window to parse query params, since this native event listener doesn't have access to the update-to-date router.query query params
			// We also include ...router.query since route params (eg: slug and ieObjectId) are also part of the router.query object
			const parsedUrl = parseUrl(window.location.href);
			router.replace(
				{
					query: {
						...router.query,
						...parsedUrl.query,
						zoomLevel: round(zoomLevel, 3),
						focusX: round(centerPoint.x, 3),
						focusY: round(centerPoint.y, 3),
					},
				},
				undefined,
				{ shallow: true }
			);
		},
		[id, router]
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only register the viewport-change event once when loading the iiif viewer
	const addEventListeners = useCallback((openSeadragonViewerTemp: Viewer) => {
		// Keep track of the current zoom and location in the url
		const handleViewportChangeTemp = () => {
			handleViewportChanged(openSeadragonViewerTemp);
		};

		// Keep track of the current page index
		const handlePageChanged = () => {
			onPageChanged(openSeadragonViewerTemp.currentPage());
		};

		const handleOpenPageEvent = () => {
			setTimeout(() => {
				updateHighlightedAltoTexts(
					highlightedAltoTextInfo.highlightedAltoTexts,
					highlightedAltoTextInfo.selectedAltoText
				);
			}, 1000);
		};

		openSeadragonViewerTemp.addHandler('viewport-change', handleViewportChangeTemp);
		openSeadragonViewerTemp.addHandler('page', handlePageChanged);
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		openSeadragonViewerTemp.addHandler('open' as any, handleOpenPageEvent);

		return () => {
			openSeadragonViewerTemp.removeHandler('viewport-change', handleViewportChangeTemp);
			openSeadragonViewerTemp.removeHandler('page', handlePageChanged);
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			openSeadragonViewerTemp.removeHandler('open' as any, handleOpenPageEvent);
		};
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Do not rerun this function when the queryParams change, since we only want apply the zoom and pan from the query params once to the iiif viewer
	const initIiifViewer = useCallback(async () => {
		console.log('init iiif viewer js lib------------------------');
		if (!!iiifViewerId && isBrowser()) {
			const iiifContainer = document.getElementById(iiifViewerId);
			if (!iiifContainer) {
				return;
			}
			if (iiifContainer) {
				iiifContainer.innerHTML = '';
			}
			const openSeadragonLibTemp = (await import('openseadragon')).default;
			// We need to use a function here,
			// since the library is a function itself,
			// and otherwise the setState thinks this is a setter function
			setOpenSeaDragonLib(openSeadragonLibTemp);

			const imageSources: TiledImageOptions[] = compact(
				imageInfosWithTokens.map((imageInfo): TiledImageOptions | null => {
					return {
						tileSource: imageInfo.imageUrl,
						loadTilesWithAjax: true,
						ajaxHeaders: {
							Authorization: `Bearer ${imageInfo.token}`,
						},
					};
				})
			);

			// Init Open Seadragon viewer
			const openSeadragonViewerTemp: OpenSeadragon.Viewer = new openSeadragonLibTemp.Viewer(
				getOpenSeadragonConfig(imageSources, isMobile, iiifViewerId)
			);

			addFullscreenCloseButton(openSeadragonViewerTemp);

			openSeadragonViewerTemp.viewport.goHome(true);

			// Keep track of zoom and pan in the url
			addEventListeners(openSeadragonViewerTemp);

			// Apply url zoom and pan to the current viewer
			applyInitialZoomAndPan(openSeadragonViewerTemp, openSeadragonLibTemp);

			openSeadragonViewerTemp.goToPage(activeImageIndex);

			setOpenSeadragonViewer(openSeadragonViewerTemp);

			getWaitForReadyStatePromise(openSeadragonViewerTemp).then(() => {
				onReady();
				iiifViewerInitializedPromiseResolve?.();
			});
		}
	}, [imageInfosWithTokens, iiifViewerId, isMobile]);

	useEffect(() => {
		initIiifViewer();
	}, [initIiifViewer]);

	/**
	 * Content
	 */

	const iiifZoom = async (multiplier: number): Promise<void> => {
		if (!(await getOpenSeaDragonViewer())) {
			return;
		}
		const currentZoom = (await getOpenSeaDragonViewer()).viewport.getZoom(true);
		const desiredZoom = clamp(
			currentZoom * multiplier,
			(await getOpenSeaDragonViewer()).viewport.getMinZoom(),
			(await getOpenSeaDragonViewer()).viewport.getMaxZoom()
		);
		(await getOpenSeaDragonViewer()).viewport.zoomTo(desiredZoom);
	};

	const iiifFullscreen = async (expand: boolean): Promise<void> => {
		(await getOpenSeaDragonViewer())?.setFullScreen(expand);
	};

	const iiifGoToHome = async (): Promise<void> => {
		(await getOpenSeaDragonViewer())?.viewport.goHome(false);
	};

	const iiifRotate = async (rotateRight: boolean): Promise<void> => {
		(await getOpenSeaDragonViewer())?.viewport.setRotation(
			((await getOpenSeaDragonViewer())?.viewport.getRotation() + 90 * (rotateRight ? 1 : -1)) % 360
		);
	};

	const handleSelectionCreated = (rect: Rect) => {
		if (onSelection) {
			onSelection(rect);
		}
		handleIsSelectionActiveChange(false);
	};

	const iiifToggleSelection = async (): Promise<void> => {
		if (!(await getOpenSeaDragonViewer())) {
			return;
		}
		const newIsSelectionActive = !isSelectionActive;

		handleIsSelectionActiveChange(newIsSelectionActive);

		if (newIsSelectionActive) {
			(await getOpenSeaDragonViewer()).setMouseNavEnabled(false);
			initOpenSeadragonViewerMouseTracker(
				getCurrentImageSize(),
				handleSelectionCreated,
				getOpenSeaDragonLib(),
				await getOpenSeaDragonViewer()
			);
		} else {
			(await getOpenSeaDragonViewer()).setMouseNavEnabled(true);
			destroyOpenSeadragonViewerMouseTracker();
		}
	};

	const iiifZoomTo = async (x: number, y: number): Promise<void> => {
		// biome-ignore lint/suspicious/noExplicitAny: tile source isn't typed yet
		const tileSource = (await getActiveImageTileSource()) as any;
		if (!tileSource) {
			console.error('iiifZoomToRect failed because imageTileSource is undefined', {
				activeImageIndex,
			});
			return;
		}
		const imageWidth: number | undefined = tileSource.width || tileSource?.dimensions?.x;

		if (!imageWidth) {
			console.error('aborting zoom to rect because getActiveImageTileSource() is undefined', {
				x,
				y,
				openSeaDragonViewer: await getOpenSeaDragonViewer(),
				imageWidth,
				activeImageTileSource: tileSource,
			});
			return;
		}
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const lib = getOpenSeaDragonLib() as any;
		const Point = lib.Point;

		(await getOpenSeaDragonViewer()).viewport.zoomTo(1.5, undefined, true);
		(await getOpenSeaDragonViewer()).viewport.panTo(
			new Point(x / imageWidth, y / imageWidth), // All relative coordinates are relative to the image width
			false
		);
	};

	const iiifZoomToRect = ({
		x,
		y,
		width,
		height,
	}: {
		x: number;
		y: number;
		width: number;
		height: number;
	}): void => {
		if (isNil(x) || isNil(y) || isNil(width) || isNil(height)) {
			throw new Error('Invalid rect provided to iiifZoomToRect');
		}
		iiifZoomTo(x + width / 2, y + height / 2);
	};

	const getWaitForReadyStatePromise = async (
		openSeadragonViewerTemp: OpenSeadragon.Viewer
	): Promise<void> => {
		return new Promise<void>((resolve) => {
			// biome-ignore lint/suspicious/noExplicitAny: open sea dragon lib isn't typed yet
			(openSeadragonViewerTemp as any).id = Math.random();
			openSeadragonViewerTemp?.addOnceHandler('tile-loaded', () => resolve());
		});
	};

	const iiifGoToPage = async (pageIndex: number): Promise<void> => {
		if (!(await getOpenSeaDragonViewer())) {
			console.error('Failed to go to pageIndex because openSeaDragonViewer is not initialized', {
				pageIndex,
			});
			return;
		}
		(await getOpenSeaDragonViewer()).goToPage(pageIndex);
	};

	/**
	 * Render
	 */

	const renderIiifViewerButtons = () => {
		return (
			<div className={styles['c-iiif-viewer__iiif__controls']}>
				{!iiifGridViewEnabled && (
					<>
						<div
							className={clsx(
								styles['c-iiif-viewer__iiif__controls__button-group'],
								styles['c-iiif-viewer__iiif__controls__button-group__pagination'],
								'u-flex-shrink'
							)}
						>
							<Button
								className={clsx(
									styles['c-iiif-viewer__iiif__controls__button'],
									'c-iiif-viewer__iiif__controls__grid-view__enable'
								)}
								icon={<Icon name={IconNamesLight.GridView} aria-hidden />}
								aria-label={tText('pages/openseadragon/index___alle-paginas-in-een-grid-bekijken')}
								variants={['white', 'sm']}
								onClick={() => setIiifGridViewEnabled(true)}
							/>
							<div className={styles['c-iiif-viewer__iiif__controls__button-group__divider']} />
							<Button
								className={clsx(
									styles['c-iiif-viewer__iiif__controls__button'],
									'c-iiif-viewer__iiif__controls__grid-view__previous-image'
								)}
								icon={<Icon name={IconNamesLight.AngleLeft} aria-hidden />}
								aria-label={tText('modules/iiif-viewer/iiif-viewer___ga-naar-de-vorige-afbeelding')}
								variants={['white', 'sm']}
								onClick={() => setActiveImageIndex(activeImageIndex - 1)}
								disabled={activeImageIndex === 0}
							/>
							<span className="pagination-info">
								{tText('modules/iiif-viewer/iiif-viewer___current-image-van-total-images', {
									currentImage: activeImageIndex + 1,
									totalImages: imageInfosWithTokens?.length || 1,
								})}
							</span>
							<Button
								className={clsx(
									styles['c-iiif-viewer__iiif__controls__button'],
									'c-iiif-viewer__iiif__controls__grid-view__next-image'
								)}
								icon={<Icon name={IconNamesLight.AngleRight} aria-hidden />}
								aria-label={tText(
									'modules/iiif-viewer/iiif-viewer___ga-naar-de-volgende-afbeelding'
								)}
								variants={['white', 'sm']}
								onClick={() => setActiveImageIndex(activeImageIndex + 1)}
								disabled={activeImageIndex === imageInfosWithTokens.length - 1}
							/>
						</div>

						<div
							className={clsx(
								styles['c-iiif-viewer__iiif__controls__button-group'],
								styles['c-iiif-viewer__iiif__controls__button-group__search'],
								{
									[styles['c-iiif-viewer__iiif__controls__button-group__search--enabled']]:
										isSearchEnabled,
									[styles['c-iiif-viewer__iiif__controls__button-group__search--disabled']]:
										!isSearchEnabled,
								},
								'u-flex-shrink'
							)}
						>
							<SearchInputWithResultsPagination
								value={searchTerms}
								onChange={setSearchTerms}
								onSearch={onSearch}
								onClearSearch={onClearSearch}
								searchResults={searchResults}
								currentSearchIndex={currentSearchIndex}
								onChangeSearchIndex={setSearchResultIndex}
								variants={['sm']}
							/>
						</div>

						<div
							className={clsx(
								styles['c-iiif-viewer__iiif__controls__button-group'],
								styles['c-iiif-viewer__iiif__controls__button-group__zoom'],
								'u-flex-shrink'
							)}
						>
							<Button
								className={clsx(
									styles['c-iiif-viewer__iiif__controls__button'],
									'c-iiif-viewer__iiif__controls__toggle-ocr'
								)}
								icon={<Icon name={IconNamesLight.Ocr} aria-hidden />}
								aria-label={tText('pages/openseadragon/index___tekst-boven-de-afbeelding-tonen')}
								variants={[isTextOverlayVisible ? 'green' : 'white', 'sm']}
								onClick={() => setIsTextOverlayVisible(!isTextOverlayVisible)}
							/>
							{enableSelection && (
								<Button
									className={clsx(
										styles['c-iiif-viewer__iiif__controls__button'],
										'c-iiif-viewer__iiif__controls__selection'
									)}
									icon={<Icon name={IconNamesLight.ScissorsClip} aria-hidden />}
									aria-label={tText('modules/iiif-viewer/iiif-viewer___selectie-downloaden')}
									title={tText('modules/iiif-viewer/iiif-viewer___selectie-downloaden')}
									variants={[isSelectionActive ? 'green' : 'white', 'sm']}
									onClick={() => iiifToggleSelection()}
								/>
							)}
							<Button
								className={clsx(
									styles['c-iiif-viewer__iiif__controls__button'],
									'c-iiif-viewer__iiif__controls__zoom-in'
								)}
								icon={<Icon name={IconNamesLight.ZoomIn} aria-hidden />}
								aria-label={tText('pages/openseadragon/index___afbeelding-inzoemen')}
								variants={['white', 'sm']}
								onClick={() => iiifZoom(1.3)}
							/>
							<Button
								className={clsx(
									styles['c-iiif-viewer__iiif__controls__button'],
									'c-iiif-viewer__iiif__controls__zoom-out'
								)}
								icon={<Icon name={IconNamesLight.ZoomOut} aria-hidden />}
								aria-label={tText('pages/openseadragon/index___afbeelding-uitzoemen')}
								variants={['white', 'sm']}
								onClick={() => iiifZoom(0.7)}
							/>
							<Button
								className={clsx(
									styles['c-iiif-viewer__iiif__controls__button'],
									'c-iiif-viewer__iiif__controls__fullscreen'
								)}
								icon={<Icon name={IconNamesLight.Expand} aria-hidden />}
								aria-label={tText(
									'pages/openseadragon/index___afbeelding-op-volledig-scherm-weergeven'
								)}
								variants={['white', 'sm']}
								onClick={() => iiifFullscreen(true)}
							/>
							<Button
								className={clsx(
									styles['c-iiif-viewer__iiif__controls__button'],
									'c-iiif-viewer__iiif__controls__rotate-right'
								)}
								icon={<Icon name={IconNamesLight.Redo} aria-hidden />}
								aria-label={tText('pages/openseadragon/index___afbeelding-rechts-draaien')}
								variants={['white', 'sm']}
								onClick={() => iiifRotate(true)}
							/>
						</div>
					</>
				)}
				{iiifGridViewEnabled && (
					<Button
						className={clsx(
							styles['c-iiif-viewer__iiif__controls__button'],
							'c-iiif-viewer__iiif__controls__grid-view__disable'
						)}
						icon={<Icon name={IconNamesLight.Times} aria-hidden />}
						aria-label={tText('pages/openseadragon/index___een-pagina-bekijken')}
						variants={['white', 'sm']}
						onClick={() => setIiifGridViewEnabled(false)}
					/>
				)}
			</div>
		);
	};

	const renderIiifViewerReferenceStrip = () => {
		// Use custom scrollbar because on windows the default scrollbar is big and ugly
		// and here it shows up on the right side of the reference strip, so it extra noticeable
		return (
			<PerfectScrollbar className={styles['c-iiif-viewer__iiif__reference-strip']}>
				{imageInfosWithTokens.map((imageInfo, index) => {
					return (
						<div key={`c-iiif-viewer__iiif__reference-strip__${imageInfo.imageUrl}`}>
							<button onClick={() => setActiveImageIndex(index)} type="button">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src={imageInfo.thumbnailUrl} alt={`page ${index + 1}`} />
							</button>
						</div>
					);
				})}
			</PerfectScrollbar>
		);
	};

	const renderOpenGridView = () => {
		return (
			<div
				className={styles['c-iiif-viewer__grid-view-wrapper']}
				style={{ display: iiifGridViewEnabled ? 'block' : 'none' }}
			>
				<div className={styles['c-iiif-viewer__grid-view']}>
					{imageInfosWithTokens.map((imageInfo, index) => {
						return (
							<button
								key={`c-iiif-viewer__grid-view__${imageInfo.imageUrl}`}
								onClick={async () => {
									setIiifGridViewEnabled(false);
									setActiveImageIndex(index);
									(await getOpenSeaDragonViewer())?.forceRedraw();
								}}
								type="button"
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src={imageInfo.thumbnailUrl} alt={`page ${index + 1}`} />
							</button>
						);
					})}
				</div>
			</div>
		);
	};

	const iiifViewerContainer = useMemo(() => {
		if (isServerSideRendering()) {
			return null; // Do not render the IIIF viewer container on the server side, since it differs from the client side html
		}
		console.log('rerender iiifviewer--------------------');
		return <div className={clsx(styles['c-iiif-viewer__iiif-container'])} id={iiifViewerId} />;
	}, [iiifViewerId]);

	return (
		<div
			className={clsx(styles['c-iiif-viewer'], {
				'c-iiif-viewer__iiif__ocr--enabled': isTextOverlayVisible,
				'c-iiif-viewer__iiif__ocr--disabled': !isTextOverlayVisible,
				'c-iiif-viewer__iiif__grid-view--disabled': !iiifGridViewEnabled,
				'c-iiif-viewer__iiif__grid-view--enabled': iiifGridViewEnabled,
			})}
		>
			{/* IIIF viewer container div */}
			{iiifViewerContainer}

			{/* IIIF sidebar with pages*/}
			{!iiifGridViewEnabled && renderIiifViewerReferenceStrip()}

			{/* IIIF viewer buttons */}
			{renderIiifViewerButtons()}

			{/* IIIF Grid view */}
			{renderOpenGridView()}
		</div>
	);
};
