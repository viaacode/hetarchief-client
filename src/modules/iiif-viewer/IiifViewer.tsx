import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { clamp, isNil, noop, round } from 'lodash-es';
import { useRouter } from 'next/router';
import {
	type MouseTracker,
	type Point,
	type PointerMouseTrackerEvent,
	type TileSource,
	type Viewer,
} from 'openseadragon';
import { parseUrl } from 'query-string';
import React, {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useState,
} from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { type IiifViewerFunctions, type IiifViewerProps } from '@iiif-viewer/IiifViewer.types';
import { SearchInputWithResultsPagination } from '@iiif-viewer/components/SearchInputWithResults/SearchInputWithResultsPagination';
import { getRectFromPointerEventDrag } from '@iiif-viewer/helpers/rect-from-pointer-event-drag';
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

const IiifViewer = forwardRef<IiifViewerFunctions, IiifViewerProps>(
	(
		{
			imageInfos,
			altoJsonCurrentPage,
			id,
			isOcrEnabled,
			setIsOcrEnabled,
			activeImageIndex,
			setActiveImageIndex,
			initialFocusX,
			initialFocusY,
			initialZoomLevel,
			searchTerms,
			setSearchTerms,
			onSearch,
			onClearSearch,
			currentSearchIndex,
			searchResults,
			setSearchResultIndex,
			onSelection,
			enableSelection = false,
		},
		ref
	) => {
		/**
		 * Hooks
		 */
		const router = useRouter();

		// Internal state
		const [iiifGridViewEnabled, setIiifGridViewEnabled] = useState<boolean>(false);
		const [openSeaDragonLib, setOpenSeaDragonLib] = useState<any | null>(null);
		const openSeaDragonViewer = (window as any).meemoo__iiifViewer || null;
		const setOpenSeadragonViewer = (newOpenSeaDragonViewer: Viewer) => {
			(window as any).meemoo__iiifViewer = newOpenSeaDragonViewer;
		};
		const activeImageTileSource: TileSource | undefined =
			openSeaDragonViewer?.world?.getItemAt(0)?.source;
		const viewerStatus: 'loading' | 'ready' = activeImageTileSource?.ready
			? 'ready'
			: 'loading';

		const setSelectionStartPoint = (newSelectionStartPoint: Point | null) => {
			return ((window as any).selectionStartPoint = newSelectionStartPoint);
		};
		const setIsSelectionActive = (newIsSelectionActive: boolean) => {
			return ((window as any).isSelectionActive = newIsSelectionActive);
		};
		const setSelectionOverlayElement = (newSelectionOverlayElement: HTMLDivElement | null) => {
			return ((window as any).selectionOverlayElement = newSelectionOverlayElement);
		};
		const setMouseTracker = (newMouseTracker: MouseTracker) => {
			return ((window as any).mouseTracker = newMouseTracker);
		};

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

		useEffect(() => {
			if (!openSeaDragonViewer) {
				return;
			}
			if (openSeaDragonViewer && activeImageTileSource) {
				openSeaDragonViewer.clearOverlays();
				openSeaDragonViewer.goToPage(activeImageIndex);
			}
			// Do not include activeImageTileSource since it causes a rerender loop since this can change in js world without react knowing about it
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [openSeaDragonViewer, activeImageIndex]);

		const addFullscreenCloseButton = useCallback(
			(openSeadragonViewer: OpenSeadragon.Viewer) => {
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
				closeFullscreenButton.title = tText(
					'modules/iiif-viewer/iiif-viewer___sluit-volledig-scherm'
				);
				closeFullscreenButton.addEventListener('click', () => {
					openSeadragonViewer.setFullScreen(false);
				});
				bottomLeftContainer?.append(closeFullscreenButton);
			},
			[]
		);

		const updateOcrOverlay = useCallback(() => {
			if (isServerSideRendering()) {
				return;
			}

			if (!openSeaDragonViewer || !openSeaDragonLib) {
				return null;
			}

			openSeaDragonViewer?.clearOverlays();

			if (!altoJsonCurrentPage) {
				// No ocr text is available for this image
				return;
			}

			if (!activeImageTileSource) {
				console.error(
					'Failed to update ocr overlay because activeImageTileSource is undefined'
				);
				return;
			}
			const imageWidth = activeImageTileSource.dimensions.x;
			const imageHeight = activeImageTileSource.dimensions.y;
			altoJsonCurrentPage?.text?.forEach((altoTextLocation, index) => {
				const x = altoTextLocation.x / imageWidth;
				const y = altoTextLocation.y / imageHeight;
				const width = altoTextLocation.width / imageWidth;
				const height = altoTextLocation.height / imageHeight;
				const isSymbols = /^[^a-zA-Z0-9]$/g.test(altoTextLocation.text);
				if (
					!x ||
					!y ||
					!width ||
					!height ||
					x > 1 ||
					y > 1 ||
					x + width > 1 ||
					y + height > 1 ||
					isSymbols
				) {
					// This text overlay doesn't make sense,
					// since it's outside the image or the position isn't fully defined
					return;
				}
				const span = document.createElement('SPAN');
				span.id = 'c-iiif-viewer__iiif__alto__text__' + index;
				span.className = 'c-iiif-viewer__iiif__alto__text';
				span.innerHTML = `
<svg
	width="${altoTextLocation.width}"
	height="${altoTextLocation.height}"
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 ${altoTextLocation.width} ${altoTextLocation.height}"
	preserveAspectRatio="xMidYMid meet"
	>
  <text
  	x="50%"
  	y="50%"
  	fill="black"
  	font-size="${altoTextLocation.height}px"
  	dominant-baseline="middle"
  	text-anchor="middle"
  >
		${altoTextLocation.text}
	</text>
</svg>`;
				openSeaDragonViewer.addOverlay(
					span,
					new openSeaDragonLib.Rect(x, y, width, height, 0),
					openSeaDragonLib.Placement.CENTER
				);
			});
			// We don't include the tile source since it causes a rerender loop
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [openSeaDragonViewer, openSeaDragonLib, altoJsonCurrentPage, activeImageIndex]);

		const resetDragState = useCallback(() => {
			if ((window as any).selectionOverlayElement as HTMLDivElement | null) {
				openSeaDragonViewer?.removeOverlay(
					(window as any).selectionOverlayElement as HTMLDivElement
				);
			}
			setSelectionStartPoint(null);
			setSelectionOverlayElement(null);
			setIsSelectionActive(false);
			openSeaDragonViewer?.setMouseNavEnabled(true);
		}, [openSeaDragonViewer]);

		const handlePress = useCallback(
			(event: PointerMouseTrackerEvent) => {
				// console.log('pressHandler', {
				// 	event,
				// 	selectionStartPoint: (window as any).selectionStartPoint as Point,
				// 	isSelectionActive: (window as any).isSelectionActive,
				// });
				if (!openSeaDragonViewer || !openSeaDragonLib) {
					return;
				}

				if (!(window as any).isSelectionActive) {
					// console.log('aborting drag from start press', {
					// 	isSelectionActive: (window as any).selectionStartPoint as Point,
					// });
					resetDragState();
					return;
				}

				const getSelectionOverlayElement = document.createElement('div');
				getSelectionOverlayElement.style.border = '4px dotted #00c8aa';
				getSelectionOverlayElement.style.background = '#00c8aa22';
				const selectionStartPointTemp = openSeaDragonViewer.viewport.pointFromPixel(
					(event as PointerMouseTrackerEvent).position
				);
				openSeaDragonViewer.addOverlay(
					getSelectionOverlayElement,
					new openSeaDragonLib.Rect(
						selectionStartPointTemp.x,
						selectionStartPointTemp.y,
						0,
						0
					)
				);

				// console.log('set drag start info', {
				// 	getSelectionOverlayElement,
				// 	selectionStartPointTemp,
				// });
				setSelectionStartPoint(selectionStartPointTemp);
				setSelectionOverlayElement(getSelectionOverlayElement);
			},
			[
				(window as any).isSelectionActive,
				openSeaDragonLib,
				openSeaDragonViewer,
				resetDragState,
			]
		);

		const handleDrag = useCallback(
			(event: PointerMouseTrackerEvent) => {
				// console.log('drag: ', {
				// 	selectionStartPoint: (window as any).selectionStartPoint as Point | null,
				// 	isSelectionActive: (window as any).isSelectionActive,
				// });
				if (!openSeaDragonViewer || !openSeaDragonLib) {
					resetDragState();
					return;
				}

				if (
					!(window as any).isSelectionActive ||
					!((window as any).selectionStartPoint as Point | null) ||
					!((window as any).selectionOverlayElement as HTMLDivElement | null)
				) {
					console.log('aborting drag from drag handler', {
						isSelectionActive: (window as any).isSelectionActive,
					});
					// setSelectionStartPoint(null);
					// setSelectionOverlayElement(null);
					// setIsSelectionActive(false);
					// openSeaDragonViewer.setMouseNavEnabled(true);
					return;
				}

				const rect = getRectFromPointerEventDrag(
					(window as any).selectionStartPoint as Point,
					(event as PointerMouseTrackerEvent).position,
					openSeaDragonViewer,
					openSeaDragonLib.Rect
				);

				openSeaDragonViewer.updateOverlay(
					(window as any).selectionOverlayElement as HTMLDivElement,
					rect
				);
			},
			[
				(window as any).isSelectionActive,
				openSeaDragonLib,
				openSeaDragonViewer,
				(window as any).selectionOverlayElement as HTMLDivElement | null,
				(window as any).selectionStartPoint as Point | null,
				resetDragState,
			]
		);

		const handleRelease = useCallback(
			(event: PointerMouseTrackerEvent) => {
				// const selectionDragStartInfo = (openSeaDragonViewer as any).selectionStart;
				// console.log('releaseHandler', {
				// 	selectionDragStartInfo,
				// });
				if (!openSeaDragonViewer || !openSeaDragonLib) {
					return;
				}
				if (
					!(window as any).isSelectionActive ||
					!((window as any).selectionStartPoint as Point | null) ||
					!((window as any).selectionOverlayElement as HTMLDivElement | null)
				) {
					// console.log('aborting drag from release handler', {
					// 	isSelectionActive: (window as any).isSelectionActive,
					// });
					resetDragState();
					return;
				}
				const rect = getRectFromPointerEventDrag(
					(window as any).selectionStartPoint as Point,
					(event as PointerMouseTrackerEvent).position,
					openSeaDragonViewer,
					openSeaDragonLib.Rect
				);
				// console.log('releaseHandler', { rect, onSelection });

				const imageSize = openSeaDragonViewer.world
					.getItemAt(activeImageIndex)
					.getContentSize();
				const imageRect = {
					x: rect.x * imageSize.x,
					y: rect.y * imageSize.x,
					width: rect.width * imageSize.x,
					height: rect.height * imageSize.x,
				};
				console.log({ imageSize, selectionRect: rect, imageRect });
				(onSelection || noop)(imageRect);

				resetDragState();
			},
			[
				(window as any).isSelectionActive,
				onSelection,
				openSeaDragonLib,
				openSeaDragonViewer,
				(window as any).selectionOverlayElement as HTMLDivElement | null,
				(window as any).selectionStartPoint as Point | null,
				resetDragState,
			]
		);

		const initOpenSeadragonViewerMouseTracker = useCallback(() => {
			if (!openSeaDragonLib?.MouseTracker || !openSeaDragonViewer?.element) {
				return;
			}
			// Code taken from https://codepen.io/iangilman/pen/qBdabGM?editors=0010
			console.log('init mouse tracker');
			setMouseTracker(
				new openSeaDragonLib.MouseTracker({
					element: openSeaDragonViewer.element,
					pressHandler: handlePress,
					dragHandler: handleDrag,
					releaseHandler: handleRelease,
				})
			);
		}, [
			handleDrag,
			handlePress,
			handleRelease,
			openSeaDragonLib?.MouseTracker,
			openSeaDragonViewer?.element,
		]);

		const applyInitialZoomAndPan = useCallback(
			(openSeadragonViewerTemp: Viewer, openSeadragonLibTemp: any) => {
				openSeadragonViewerTemp.addHandler('open', () => {
					// When the viewer is initialized, set the desired zoom and pan
					if (
						!isNil(initialFocusX) &&
						!isNil(initialFocusY) &&
						!isNil(initialZoomLevel)
					) {
						const centerPoint = new openSeadragonLibTemp.Point(
							initialFocusX,
							initialFocusY
						);
						openSeadragonViewerTemp.viewport.panTo(centerPoint, true);
						openSeadragonViewerTemp.viewport.zoomTo(
							initialZoomLevel,
							centerPoint,
							true
						);
					}
				});
			},
			// Only update the pan and zoom once when loading the iiif viewer
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[]
		);

		const addEventListeners = useCallback((openSeadragonViewerTemp: Viewer) => {
			openSeadragonViewerTemp.addHandler('viewport-change', () => {
				if (!openSeadragonViewerTemp) {
					return;
				}
				const zoomLevel = openSeadragonViewerTemp.viewport.getZoom();
				const centerPoint = openSeadragonViewerTemp.viewport.getCenter();
				// Use window to parse query params, since this native event listener doesn't have access to the update-to-date router.query query params
				// We also include ...router.query since route params (eg: slug and ieObjectId) are also part of the router.query object
				const parsedUrl = parseUrl(window.location.href);
				router.push(
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
			});
			// We don't include the tile source since it causes a rerender loop
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [openSeaDragonViewer, openSeaDragonLib, altoJsonCurrentPage, activeImageIndex]);

		const applyInitialZoomAndPan = useCallback(
			(openSeadragonViewerTemp: Viewer, openSeadragonLibTemp: any) => {
				openSeadragonViewerTemp.addHandler('open', () => {
					// When the viewer is initialized, set the desired zoom and pan
					if (
						!isNil(initialFocusX) &&
						!isNil(initialFocusY) &&
						!isNil(initialZoomLevel)
					) {
						const centerPoint = new openSeadragonLibTemp.Point(
							initialFocusX,
							initialFocusY
						);
						openSeadragonViewerTemp.viewport.panTo(centerPoint, true);
						openSeadragonViewerTemp.viewport.zoomTo(
							initialZoomLevel,
							centerPoint,
							true
						);
					}
				});
			},
			// Only update the pan and zoom once when loading the iiif viewer
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[]
		);

		const addEventListeners = useCallback((openSeadragonViewerTemp: Viewer) => {
			openSeadragonViewerTemp.addHandler('viewport-change', () => {
				if (!openSeadragonViewerTemp) {
					return;
				}
				const zoomLevel = openSeadragonViewerTemp.viewport.getZoom();
				const centerPoint = openSeadragonViewerTemp.viewport.getCenter();
				// Use window to parse query params, since this native event listener doesn't have access to the update-to-date router.query query params
				// We also include ...router.query since route params (eg: slug and ieObjectId) are also part of the router.query object
				const parsedUrl = parseUrl(window.location.href);
				router.push(
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
			});
			// Only register the viewport-change event once when loading the iiif viewer
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		const initIiifViewer = useCallback(async () => {
			console.log('init iiif viewer js lib------------------------');
			if (!!iiifViewerId && isBrowser()) {
				const iiifContainer = document.getElementById(iiifViewerId);
				if (iiifContainer) {
					iiifContainer.innerHTML = '';
				}
				const openSeadragonLibTemp = (await import('openseadragon')).default;
				// We need to use a function here,
				// since the library is a function itself,
				// and otherwise the setState thinks this is a setter function
				setOpenSeaDragonLib(() => openSeadragonLibTemp);

				const imageSources = imageInfos.map((imageInfo) => {
					if (imageInfo.imageUrl.endsWith('.jph')) {
						return imageInfo.imageUrl;
					}
					return {
						type: 'image' as const,
						url: imageInfo.imageUrl,
					};
				});

				// Init Open Seadragon viewer
				const openSeadragonViewerTemp: OpenSeadragon.Viewer =
					new openSeadragonLibTemp.Viewer(
						getOpenSeadragonConfig(imageSources, isMobile, iiifViewerId)
					);

				addFullscreenCloseButton(openSeadragonViewerTemp);

				openSeadragonViewerTemp.viewport.goHome(true);

				// Keep track of zoom and pan in the url
				addEventListeners(openSeadragonViewerTemp);

				// Apply url zoom and pan to the current viewer
				applyInitialZoomAndPan(openSeadragonViewerTemp, openSeadragonLibTemp);

				setOpenSeadragonViewer(openSeadragonViewerTemp);
			}
			// Do not rerun this function when the queryParams change,
			// since we only want apply the zoom and pan from the query params once to the iiif viewer
			// eslint-disable-next-line
		}, [imageInfos, iiifViewerId, isMobile]);

		useEffect(() => {
			if (openSeaDragonViewer) {
				openSeaDragonViewer.addHandler('open', () => {
					// When the viewer is initialized, initialize the ocr overlay
					updateOcrOverlay();
				});
			}
		}, [openSeaDragonViewer, updateOcrOverlay]);

		useEffect(() => {
			initIiifViewer();
		}, [initIiifViewer]);

		useEffect(() => {
			if ((window as any).isSelectionActive) {
				console.log('init mouse tracker');
				initOpenSeadragonViewerMouseTracker();
			}
		}, [initOpenSeadragonViewerMouseTracker, (window as any).isSelectionActive]);

		useEffect(() => {
			if (!(window as any).isSelectionActive) {
				console.log('destroying mouse tracker');
				((window as any).mouseTracker as MouseTracker | null)?.destroy();
			}
		}, [
			(window as any).isSelectionActive,
			(window as any).mouseTracker as MouseTracker | null,
		]);

		/**
		 * Content
		 */

		const iiifZoom = (multiplier: number): void => {
			if (!openSeaDragonViewer) {
				return;
			}
			const currentZoom = openSeaDragonViewer.viewport.getZoom(true);
			const desiredZoom = clamp(
				currentZoom * multiplier,
				openSeaDragonViewer.viewport.getMinZoom(),
				openSeaDragonViewer.viewport.getMaxZoom()
			);
			openSeaDragonViewer.viewport.zoomTo(desiredZoom);
		};

		const iiifFullscreen = (expand: boolean): void => {
			openSeaDragonViewer?.setFullScreen(expand);
		};

		const iiifGoToHome = (): void => {
			openSeaDragonViewer?.viewport.goHome(false);
		};

		const iiifRotate = (rotateRight: boolean): void => {
			openSeaDragonViewer?.viewport.setRotation(
				(openSeaDragonViewer?.viewport.getRotation() + 90 * (rotateRight ? 1 : -1)) % 360
			);
		};

		const iiifStartSelection = async (): Promise<void> => {
			console.log('setting selection active', { openSeaDragonViewer });
			if (!openSeaDragonViewer) {
				return;
			}
			(openSeaDragonViewer as any).id = Math.random().toString();
			console.log('random id: ', (openSeaDragonViewer as any).id);
			setIsSelectionActive(true);
			openSeaDragonViewer.setMouseNavEnabled(false);
			initOpenSeadragonViewerMouseTracker();
		};

		const iiifZoomTo = (x: number, y: number): void => {
			if (!openSeaDragonViewer) {
				console.error('iiifZoomToRect failed because openSeaDragonViewer is undefined');
				return;
			}
			if (!activeImageTileSource) {
				console.error('iiifZoomToRect failed because imageTileSource is undefined', {
					activeImageIndex,
				});
				return;
			}
			const imageWidth: number | undefined = activeImageTileSource.dimensions.x;
			const imageHeight: number | undefined = activeImageTileSource.dimensions.y;

			if (!imageWidth || !imageHeight) {
				console.error('aborting zoom to rect because activeImageTileSource is undefined', {
					item: activeImageTileSource,
					openSeaDragonViewer,
					imageWidth,
					imageHeight,
					activeImageTileSource,
				});
				return;
			}
			openSeaDragonViewer.viewport.zoomTo(1.5, undefined, true);
			openSeaDragonViewer.viewport.panTo(
				new openSeaDragonLib.Point(x / imageWidth, y / imageHeight),
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
			iiifZoomTo(x + width / 2, y + height / 2);
		};

		const clearActiveWordIndex = () => {
			document?.querySelectorAll('.c-iiif-viewer__iiif__alto__text').forEach((element) => {
				element.classList.remove('c-iiif-viewer__iiif__alto__text--active');
			});
		};

		const setActiveWordIndex = (wordIndex: number) => {
			clearActiveWordIndex();
			document
				?.querySelector('#c-iiif-viewer__iiif__alto__text__' + wordIndex)
				?.classList?.add('c-iiif-viewer__iiif__alto__text--active');
		};

		const waitForReadyState = async (): Promise<void> => {
			return new Promise<void>((resolve) => {
				console.log('waitForReadyState');
				if (viewerStatus === 'ready') {
					console.log('waitForReadyState', { currentViewerState: viewerStatus });
					resolve();
				} else {
					console.log('waitForReadyState add open handler before', {
						id: (openSeaDragonViewer as any).id,
					});
					(openSeaDragonViewer as any).id = Math.random();
					console.log('waitForReadyState add open handler after', {
						id: (openSeaDragonViewer as any).id,
					});
					openSeaDragonViewer?.addHandler('fully-loaded-change', () => {
						console.log('waitForReadyState add open handler');
						resolve();
						// setViewerStatus('ready');
					});
				}
			});
		};

		useImperativeHandle(ref, () => ({
			iiifZoomToRect,
			iiifRotate,
			iiifFullscreen,
			iiifZoom,
			iiifZoomTo,
			iiifGoToHome,
			setActiveWordIndex,
			clearActiveWordIndex,
			waitForReadyState,
		}));

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
									styles[
										'c-iiif-viewer__iiif__controls__button-group__pagination'
									],
									'u-flex-shrink'
								)}
							>
								<Button
									className={clsx(
										styles['c-iiif-viewer__iiif__controls__button'],
										'c-iiif-viewer__iiif__controls__grid-view__enable'
									)}
									icon={<Icon name={IconNamesLight.GridView} aria-hidden />}
									aria-label={tText(
										'pages/openseadragon/index___alle-paginas-in-een-grid-bekijken'
									)}
									variants={['white', 'sm']}
									onClick={() => setIiifGridViewEnabled(true)}
								/>
								<div
									className={
										styles[
											'c-iiif-viewer__iiif__controls__button-group__divider'
										]
									}
								/>
								<Button
									className={clsx(
										styles['c-iiif-viewer__iiif__controls__button'],
										'c-iiif-viewer__iiif__controls__grid-view__previous-image'
									)}
									icon={<Icon name={IconNamesLight.AngleLeft} aria-hidden />}
									aria-label={tText(
										'modules/iiif-viewer/iiif-viewer___ga-naar-de-vorige-afbeelding'
									)}
									variants={['white', 'sm']}
									onClick={() => setActiveImageIndex(activeImageIndex - 1)}
									disabled={activeImageIndex === 0}
								/>
								<span className="pagination-info">
									{tText(
										'modules/iiif-viewer/iiif-viewer___current-image-van-total-images',
										{
											currentImage: activeImageIndex + 1,
											totalImages: imageInfos?.length || 0,
										}
									)}
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
									disabled={activeImageIndex === imageInfos.length - 1}
								/>
							</div>

							<div
								className={clsx(
									styles['c-iiif-viewer__iiif__controls__button-group'],
									styles['c-iiif-viewer__iiif__controls__button-group__search'],
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
								{!!altoJsonCurrentPage && (
									<Button
										className={clsx(
											styles['c-iiif-viewer__iiif__controls__button'],
											'c-iiif-viewer__iiif__controls__toggle-ocr'
										)}
										icon={<Icon name={IconNamesLight.Ocr} aria-hidden />}
										aria-label={tText(
											'pages/openseadragon/index___tekst-boven-de-afbeelding-tonen'
										)}
										variants={[isOcrEnabled ? 'green' : 'white', 'sm']}
										onClick={() => setIsOcrEnabled(!isOcrEnabled)}
									/>
								)}
								{enableSelection && (
									<Button
										className={clsx(
											styles['p-object-detail__iiif__controls__button'],
											'p-object-detail__iiif__controls__selection'
										)}
										icon={
											<Icon name={IconNamesLight.ScissorsClip} aria-hidden />
										}
										aria-label={tText(
											'modules/iiif-viewer/iiif-viewer___selectie-downloaden'
										)}
										title={tText(
											'modules/iiif-viewer/iiif-viewer___selectie-downloaden'
										)}
										variants={
											(window as any).isSelectionActive
												? ['green']
												: ['white']
										}
										onClick={() => iiifStartSelection()}
									/>
								)}
								<Button
									className={clsx(
										styles['c-iiif-viewer__iiif__controls__button'],
										'c-iiif-viewer__iiif__controls__zoom-in'
									)}
									icon={<Icon name={IconNamesLight.ZoomIn} aria-hidden />}
									aria-label={tText(
										'pages/openseadragon/index___afbeelding-inzoemen'
									)}
									variants={['white', 'sm']}
									onClick={() => iiifZoom(1.3)}
								/>
								<Button
									className={clsx(
										styles['c-iiif-viewer__iiif__controls__button'],
										'c-iiif-viewer__iiif__controls__zoom-out'
									)}
									icon={<Icon name={IconNamesLight.ZoomOut} aria-hidden />}
									aria-label={tText(
										'pages/openseadragon/index___afbeelding-uitzoemen'
									)}
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
									aria-label={tText(
										'pages/openseadragon/index___afbeelding-rechts-draaien'
									)}
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
					{imageInfos.map((imageInfo, index) => {
						return (
							<div key={'c-iiif-viewer__iiif__reference-strip__' + index}>
								<button onClick={() => setActiveImageIndex(index)}>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img src={imageInfo.thumbnailUrl} alt={'page ' + (index + 1)} />
								</button>
							</div>
						);
					})}
				</PerfectScrollbar>
			);
		};

		const iiifViewerContainer = useMemo(() => {
			console.log('rerender iiifviewer--------------------');
			return (
				<div className={clsx(styles['c-iiif-viewer__iiif-container'])} id={iiifViewerId} />
			);
		}, [iiifViewerId]);

		return (
			<div
				className={clsx(styles['c-iiif-viewer'], {
					'c-iiif-viewer__iiif__ocr--enabled': isOcrEnabled,
					'c-iiif-viewer__iiif__ocr--disabled': !isOcrEnabled,
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
				<div
					className={styles['c-iiif-viewer__grid-view-wrapper']}
					style={{ display: iiifGridViewEnabled ? 'block' : 'none' }}
				>
					<div className={styles['c-iiif-viewer__grid-view']}>
						{imageInfos.map((imageInfo, index) => {
							return (
								<button
									key={'c-iiif-viewer__grid-view__' + index}
									onClick={() => {
										setIiifGridViewEnabled(false);
										setActiveImageIndex(index);
										openSeaDragonViewer?.forceRedraw();
									}}
								>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img src={imageInfo.thumbnailUrl} alt={'page ' + (index + 1)} />
								</button>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
);

IiifViewer.displayName = 'IiifViewer';

export default IiifViewer;
