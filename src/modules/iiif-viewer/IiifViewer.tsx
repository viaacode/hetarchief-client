import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { clamp, compact, isNil, round } from 'lodash-es';
import { useRouter } from 'next/router';
import type { TileSource, TiledImageOptions, Viewer } from 'openseadragon';
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

import {
	HIGHLIGHT_MARGIN,
	type IiifViewerFunctions,
	type IiifViewerProps,
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

const IiifViewer = forwardRef<IiifViewerFunctions, IiifViewerProps>(
	(
		{
			imageInfosWithTokens,
			id,
			isTextOverlayVisible,
			setIsTextOverlayVisible,
			activeImageIndex,
			setActiveImageIndex,
			initialFocusX,
			initialFocusY,
			initialZoomLevel,
			isLoading,
			setIsLoading,
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
		},
		ref
	) => {
		/**
		 * Hooks
		 */
		const router = useRouter();

		// Internal state
		const [iiifGridViewEnabled, setIiifGridViewEnabled] = useState<boolean>(false);
		// biome-ignore lint/suspicious/noExplicitAny: open sea dragon lib isn't typed yet
		const [openSeaDragonLib, setOpenSeaDragonLib] = useState<any | null>(null);
		// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
		const openSeaDragonViewer = (window as any).meemoo__iiifViewer || null;
		const setOpenSeadragonViewer = (newOpenSeaDragonViewer: Viewer) => {
			// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
			(window as any).meemoo__iiifViewer = newOpenSeaDragonViewer;
		};
		const getActiveImageTileSource = (): TileSource | undefined =>
			openSeaDragonViewer?.world?.getItemAt(0)?.source;

		const [isSelectionActive, setIsSelectionActive] = useState<boolean>(false);

		const handleIsSelectionActiveChange = (newIsSelectionActive: boolean) => {
			setIsSelectionActive(newIsSelectionActive);
			// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
			(window as any).isSelectionActive = newIsSelectionActive;
			return newIsSelectionActive;
		};

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

		// biome-ignore lint/correctness/useExhaustiveDependencies: render loop
		useEffect(() => {
			if (!openSeaDragonViewer) {
				return;
			}
			if (openSeaDragonViewer && getActiveImageTileSource()) {
				openSeaDragonViewer.clearOverlays();
				openSeaDragonViewer.goToPage(activeImageIndex);
			}
			// Do not include getActiveImageTileSource() since it causes a rerender loop since this can change in js world without react knowing about it
		}, [openSeaDragonViewer, activeImageIndex]);

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
			closeFullscreenButton.title = tText(
				'modules/iiif-viewer/iiif-viewer___sluit-volledig-scherm'
			);
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
			(highlightedAltoTexts: TextLine[], selectedHighlightedAltoText: TextLine | null) => {
				if (isServerSideRendering()) {
					return;
				}

				if (!openSeaDragonViewer || !openSeaDragonLib) {
					return null;
				}

				openSeaDragonViewer?.clearOverlays();

				if (!highlightedAltoTexts?.length) {
					return;
				}

				// biome-ignore lint/suspicious/noExplicitAny: tile source isn't typed yet
				const tileSource = getActiveImageTileSource() as any;
				if (!tileSource) {
					return;
				}
				const imageWidth: number | undefined = tileSource.width || tileSource?.dimensions?.x;
				const imageHeight: number | undefined = tileSource.height || tileSource?.dimensions?.y;

				if (!imageWidth || !imageHeight) {
					throw new Error('Failed to find current page width/height');
				}

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
					openSeaDragonViewer.addOverlay(
						span,
						new openSeaDragonLib.Rect(x, y, width, height, 0),
						openSeaDragonLib.Placement.TOP_LEFT
					);
				}
			},
			[openSeaDragonLib, getActiveImageTileSource()]
		);

		// biome-ignore lint/correctness/useExhaustiveDependencies: Only update the pan and zoom once when loading the iiif viewer
		const applyInitialZoomAndPan = useCallback(
			// biome-ignore lint/suspicious/noExplicitAny: open sea dragon lib isn't typed yet
			(openSeadragonViewerTemp: Viewer, openSeadragonLibTemp: any) => {
				openSeadragonViewerTemp.addHandler('open', () => {
					// When the viewer is initialized, set the desired zoom and pan
					if (!isNil(initialFocusX) && !isNil(initialFocusY) && !isNil(initialZoomLevel)) {
						const centerPoint = new openSeadragonLibTemp.Point(initialFocusX, initialFocusY);
						openSeadragonViewerTemp.viewport.panTo(centerPoint, true);
						openSeadragonViewerTemp.viewport.zoomTo(initialZoomLevel, centerPoint, true);
					}
				});
			},
			[]
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
			const handleViewportChangeTemp = () => handleViewportChanged(openSeadragonViewerTemp);
			openSeadragonViewerTemp.addHandler('viewport-change', handleViewportChangeTemp);

			// Keep track of the loading state of the viewer page
			const handleOpenTemp = () => {
				setIsLoading(false);
			};

			// Keep track of the current page index
			const handlePageChanged = () => {
				onPageChanged(openSeadragonViewerTemp.currentPage());
			};

			openSeadragonViewerTemp.addHandler('open', handleOpenTemp);
			openSeadragonViewerTemp.addHandler('page', handlePageChanged);

			return () => {
				openSeadragonViewerTemp.removeHandler('viewport-change', handleViewportChangeTemp);
				openSeadragonViewerTemp.removeHandler('open', handleOpenTemp);
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
				setOpenSeaDragonLib(() => openSeadragonLibTemp);

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
			}
		}, [imageInfosWithTokens, iiifViewerId, isMobile]);

		useEffect(() => {
			initIiifViewer();
		}, [initIiifViewer]);

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

		const handleSelectionCreated = (rect: Rect) => {
			if (onSelection) {
				onSelection(rect);
			}
			handleIsSelectionActiveChange(false);
		};

		const iiifToggleSelection = async (): Promise<void> => {
			if (!openSeaDragonViewer) {
				return;
			}
			const newIsSelectionActive = !isSelectionActive;

			handleIsSelectionActiveChange(newIsSelectionActive);

			if (newIsSelectionActive) {
				openSeaDragonViewer.setMouseNavEnabled(false);
				initOpenSeadragonViewerMouseTracker(
					getCurrentImageSize(),
					handleSelectionCreated,
					openSeaDragonLib,
					openSeaDragonViewer
				);
			} else {
				openSeaDragonViewer.setMouseNavEnabled(true);
				destroyOpenSeadragonViewerMouseTracker();
			}
		};

		const iiifZoomTo = (x: number, y: number): void => {
			// biome-ignore lint/suspicious/noExplicitAny: tile source isn't typed yet
			const tileSource = getActiveImageTileSource() as any;
			console.log('zoom to ', {
				x,
				y,
				openSeaDragonViewer,
				activeImageTileSource: tileSource,
			});
			if (!openSeaDragonViewer) {
				console.error('iiifZoomToRect failed because openSeaDragonViewer is undefined');
				return;
			}
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
					openSeaDragonViewer,
					imageWidth,
					activeImageTileSource: tileSource,
				});
				return;
			}
			openSeaDragonViewer.viewport.zoomTo(1.5, undefined, true);
			openSeaDragonViewer.viewport.panTo(
				new openSeaDragonLib.Point(x / imageWidth, y / imageWidth), // All relative coordinates are relative to the image width
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

		const waitForReadyState = async (): Promise<void> => {
			return new Promise<void>((resolve) => {
				if (!isLoading) {
					resolve();
				} else {
					// biome-ignore lint/suspicious/noExplicitAny: open sea dragon lib isn't typed yet
					(openSeaDragonViewer as any).id = Math.random();

					openSeaDragonViewer?.addHandler('fully-loaded-change', () => {
						console.log(
							`[PERFORMANCE] ${new Date().toISOString()} iiif viewer fully-loaded image tiles`
						);
						resolve();
					});
				}
			});
		};

		const iiifGoToPage = (pageIndex: number): void => {
			if (!openSeaDragonViewer) {
				console.error('Failed to go to pageIndex because openSeaDragonViewer is not initialized', {
					pageIndex,
				});
				return;
			}
			openSeaDragonViewer.goToPage(pageIndex);
		};

		useImperativeHandle(ref, () => ({
			iiifZoomToRect,
			iiifRotate,
			iiifFullscreen,
			iiifZoom,
			iiifZoomTo,
			iiifGoToHome,
			iiifGoToPage,
			waitForReadyState,
			updateHighlightedAltoTexts,
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
									aria-label={tText(
										'pages/openseadragon/index___alle-paginas-in-een-grid-bekijken'
									)}
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
									aria-label={tText(
										'modules/iiif-viewer/iiif-viewer___ga-naar-de-vorige-afbeelding'
									)}
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
									onClick={() => {
										setIiifGridViewEnabled(false);
										setActiveImageIndex(index);
										openSeaDragonViewer?.forceRedraw();
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
	}
);

IiifViewer.displayName = 'IiifViewer';

export default IiifViewer;
