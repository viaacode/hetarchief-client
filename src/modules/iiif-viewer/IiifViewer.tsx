import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { clamp, isNil, round } from 'lodash-es';
import { useRouter } from 'next/router';
import { type Viewer } from 'openseadragon';
import { parseUrl } from 'query-string';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { type IiifViewerFunctions, type IiifViewerProps } from '@iiif-viewer/IiifViewer.types';
import altoTextLocations from '@iiif-viewer/alto2-simplified.json';
import { SearchInputWithResultsPagination } from '@iiif-viewer/components/SearchInputWithResults/SearchInputWithResultsPagination';
import { getOpenSeadragonConfig } from '@iiif-viewer/openseadragon-config';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useStickyLayout } from '@shared/hooks/use-sticky-layout';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { Breakpoints } from '@shared/types';
import { isBrowser, isServerSideRendering } from '@shared/utils/is-browser';

import styles from './IiifViewer.module.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';

const IiifViewer = forwardRef<IiifViewerFunctions, IiifViewerProps>(
	(
		{
			imageInfos,
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
			searchPages,
			currentSearchIndex,
			searchResults,
			setSearchResultIndex,
		},
		ref
	) => {
		/**
		 * Hooks
		 */
		const { tText } = useTranslation();
		const router = useRouter();

		// Internal state
		const [iiifGridViewEnabled, setIiifGridViewEnabled] = useState<boolean>(false);
		const [openSeaDragonLib, setOpenSeaDragonLib] = useState<any | null>(null);
		const [openSeaDragonViewer, setOpenSeadragonViewer] = useState<OpenSeadragon.Viewer | null>(
			null
		);

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
			if (openSeaDragonViewer) {
				openSeaDragonViewer.goToPage(activeImageIndex);
			}
		}, [activeImageIndex, openSeaDragonViewer]);

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
					'p-object-detail__iiif__close-fullscreen c-button c-button--icon c-button--white';
				closeFullscreenButton.innerHTML = 'times';
				closeFullscreenButton.title = tText(
					'modules/iiif-viewer/iiif-viewer___sluit-volledig-scherm'
				);
				closeFullscreenButton.addEventListener('click', () => {
					openSeadragonViewer.setFullScreen(false);
				});
				bottomLeftContainer?.append(closeFullscreenButton);
			},
			[tText]
		);

		const updateOcrOverlay = useCallback(() => {
			if (isServerSideRendering()) {
				return;
			}

			if (!openSeaDragonViewer || !openSeaDragonLib) {
				return null;
			}

			openSeaDragonViewer?.clearOverlays();

			// TODO link altoTextLocations to activeImageIndex
			const altoUrl = imageInfos[activeImageIndex].altoUrl;
			console.log('alto file: ' + altoUrl);

			if (!altoUrl) {
				// No ocr text is available for this image
				return;
			}

			altoTextLocations.forEach((altoTextLocation, index) => {
				const span = document.createElement('SPAN');
				span.id = 'p-object-detail__iiif__alto__text__' + index;
				span.className = 'p-object-detail__iiif__alto__text';
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
  	font-size="300%"
  	dominant-baseline="middle"
  	text-anchor="middle"
  >
		${altoTextLocation.text}
	</text>
</svg>`;
				openSeaDragonViewer.addOverlay(
					span,
					new openSeaDragonLib.Rect(
						altoTextLocation.x / imageInfos[activeImageIndex].width,
						altoTextLocation.y / imageInfos[activeImageIndex].height,
						altoTextLocation.width / imageInfos[activeImageIndex].width,
						altoTextLocation.height / imageInfos[activeImageIndex].height,
						0
					),
					openSeaDragonLib.Placement.CENTER
				);
			});
		}, [activeImageIndex, imageInfos, openSeaDragonViewer, openSeaDragonLib]);

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

		const initZoomAndPanListeners = useCallback((openSeadragonViewerTemp: Viewer) => {
			openSeadragonViewerTemp.addHandler('viewport-change', () => {
				if (!openSeadragonViewerTemp) {
					return;
				}
				const zoomLevel = openSeadragonViewerTemp.viewport.getZoom();
				const centerPoint = openSeadragonViewerTemp.viewport.getCenter();
				// Use window to parse query params, since this native event listener doesn't have access to the update-to-date router.query query params
				// WE also include ...router.query since route params (eg: slug and ieObjectId) are also part of the router.query object
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
				initZoomAndPanListeners(openSeadragonViewerTemp);

				// Apply url zoom and pan to the current viewer
				applyInitialZoomAndPan(openSeadragonViewerTemp, openSeadragonLibTemp);

				setOpenSeadragonViewer(openSeadragonViewerTemp);
			}
			// Do not rerun this function when the queryParams change,
			// since we only want apply the zoom and pan from the query params once to the iiif viewer
			// eslint-disable-next-line
		}, [addFullscreenCloseButton, iiifViewerId, imageInfos, isMobile]);

		useEffect(() => {
			updateOcrOverlay();
		}, [updateOcrOverlay]);

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

		const iiifGoToPage = (pageIndex: number): void => {
			openSeaDragonViewer?.clearOverlays();
			setActiveImageIndex(pageIndex);
			openSeaDragonViewer?.goToPage(pageIndex);
		};

		const iiifRotate = (rotateRight: boolean): void => {
			openSeaDragonViewer?.viewport.setRotation(
				(openSeaDragonViewer?.viewport.getRotation() + 90 * (rotateRight ? 1 : -1)) % 360
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
			if (!openSeaDragonViewer) {
				return;
			}
			openSeaDragonViewer.viewport.zoomTo(2.5, undefined, true);
			openSeaDragonViewer.viewport.panTo(
				new openSeaDragonLib.Point(
					(x + width / 2) / imageInfos[activeImageIndex].width,
					(y + height / 2) / imageInfos[activeImageIndex].height
				),
				false
			);
		};

		const clearActiveWordIndex = () => {
			openSeaDragonViewer?.container
				?.querySelectorAll('.p-object-detail__iiif__alto__text')
				.forEach((element) => {
					element.classList.remove('p-object-detail__iiif__alto__text--active');
				});
		};

		const setActiveWordIndex = (wordIndex: number) => {
			clearActiveWordIndex();
			openSeaDragonViewer?.container
				?.querySelector('#p-object-detail__iiif__alto__text__' + wordIndex)
				?.classList?.add('p-object-detail__iiif__alto__text--active');
		};

		useImperativeHandle(ref, () => ({
			iiifZoomToRect,
			iiifRotate,
			iiifGoToPage,
			iiifFullscreen,
			iiifZoom,
			setActiveWordIndex,
			clearActiveWordIndex,
		}));

		/**
		 * Render
		 */

		const renderIiifViewerButtons = () => {
			return (
				<div className={styles['p-object-detail__iiif__controls']}>
					{!iiifGridViewEnabled && (
						<>
							<div
								className={clsx(
									styles['p-object-detail__iiif__controls__button-group'],
									'u-flex-shrink'
								)}
							>
								<Button
									className={clsx(
										styles['p-object-detail__iiif__controls__button'],
										'p-object-detail__iiif__controls__grid-view__enable'
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
											'p-object-detail__iiif__controls__button-group__divider'
										]
									}
								/>
								<Button
									className={clsx(
										styles['p-object-detail__iiif__controls__button'],
										'p-object-detail__iiif__controls__grid-view__previous-image'
									)}
									icon={<Icon name={IconNamesLight.AngleLeft} aria-hidden />}
									aria-label={tText(
										'modules/iiif-viewer/iiif-viewer___ga-naar-de-vorige-afbeelding'
									)}
									variants={['white', 'sm']}
									onClick={() => setActiveImageIndex(activeImageIndex - 1)}
									disabled={activeImageIndex === 0}
								/>
								<span>
									{tText(
										'modules/iiif-viewer/iiif-viewer___current-search-index-van-total-search-results',
										{
											currentSearchIndex,
											totalSearchResults: searchResults?.length || 0,
										}
									)}
								</span>
								<Button
									className={clsx(
										styles['p-object-detail__iiif__controls__button'],
										'p-object-detail__iiif__controls__grid-view__next-image'
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
									styles['p-object-detail__iiif__controls__button-group'],
									'u-flex-shrink'
								)}
							>
								<SearchInputWithResultsPagination
									value={searchTerms}
									onChange={setSearchTerms}
									onSearch={() => searchPages(searchTerms)}
									searchResults={searchResults}
									currentSearchIndex={currentSearchIndex}
									onChangeSearchIndex={setSearchResultIndex}
								/>
							</div>

							<div
								className={clsx(
									styles['p-object-detail__iiif__controls__button-group'],
									'u-flex-shrink'
								)}
							>
								{!!imageInfos[activeImageIndex].altoUrl && (
									<Button
										className={clsx(
											styles['p-object-detail__iiif__controls__button'],
											'p-object-detail__iiif__controls__toggle-ocr'
										)}
										icon={<Icon name={IconNamesLight.Ocr} aria-hidden />}
										aria-label={tText(
											'pages/openseadragon/index___tekst-boven-de-afbeelding-tonen'
										)}
										variants={['white', 'sm']}
										onClick={() => setIsOcrEnabled(!isOcrEnabled)}
									/>
								)}
								<Button
									className={clsx(
										styles['p-object-detail__iiif__controls__button'],
										'p-object-detail__iiif__controls__zoom-in'
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
										styles['p-object-detail__iiif__controls__button'],
										'p-object-detail__iiif__controls__zoom-out'
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
										styles['p-object-detail__iiif__controls__button'],
										'p-object-detail__iiif__controls__fullscreen'
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
										styles['p-object-detail__iiif__controls__button'],
										'p-object-detail__iiif__controls__rotate-right'
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
								styles['p-object-detail__iiif__controls__button'],
								'p-object-detail__iiif__controls__grid-view__disable'
							)}
							icon={<Icon name={IconNamesLight.File} aria-hidden />}
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
				<PerfectScrollbar className={styles['p-object-detail__iiif__reference-strip']}>
					{imageInfos.map((imageInfo, index) => {
						return (
							<button
								key={'p-object-detail__iiif__reference-strip__' + index}
								onClick={() => iiifGoToPage(index)}
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src={imageInfo.thumbnailUrl} alt={'page ' + (index + 1)} />
							</button>
						);
					})}
				</PerfectScrollbar>
			);
		};

		return (
			<div className={styles['c-iiif-viewer']}>
				{/* IIIF viewer container div */}
				<div
					className={clsx(styles['p-object-detail__iiif'], {
						'p-object-detail__iiif__ocr--enabled': isOcrEnabled,
						'p-object-detail__iiif__ocr--disabled': !isOcrEnabled,
					})}
					id={iiifViewerId}
					style={{ display: iiifGridViewEnabled ? 'none' : 'block' }}
				/>

				{/* IIIF sidebar with pages*/}
				{!iiifGridViewEnabled && renderIiifViewerReferenceStrip()}

				{/* IIIF viewer buttons */}
				{renderIiifViewerButtons()}

				{/* IIIF Grid view */}
				<div
					className={styles['p-object-detail__iiif__grid-view-wrapper']}
					style={{ display: iiifGridViewEnabled ? 'block' : 'none' }}
				>
					<div className={styles['p-object-detail__iiif__grid-view']}>
						{imageInfos.map((imageInfo, index) => {
							return (
								<button
									key={'p-object-detail__iiif__reference-strip__' + index}
									onClick={() => {
										iiifGoToPage(index);
										setIiifGridViewEnabled(false);
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
