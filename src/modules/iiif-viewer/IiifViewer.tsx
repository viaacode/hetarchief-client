import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { clamp, noop } from 'lodash-es';
import { type MouseTracker, type Point, type PointerMouseTrackerEvent } from 'openseadragon';
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
import altoTextLocations from '@iiif-viewer/alto2-simplified.json';
import { getRectFromPointerEventDrag } from '@iiif-viewer/helpers/rect-from-pointer-event-drag';
import { getOpenSeadragonConfig } from '@iiif-viewer/openseadragon-config';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useStickyLayout } from '@shared/hooks/use-sticky-layout';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { Breakpoints } from '@shared/types';
import { isBrowser, isServerSideRendering } from '@shared/utils/is-browser';

import iiifStyles from './IiifViewer.module.scss';
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
			onSelection,
			enableSelection = false,
		},
		ref
	) => {
		/**
		 * Hooks
		 */
		const { tText } = useTranslation();

		// Internal state
		const [iiifGridViewEnabled, setIiifGridViewEnabled] = useState<boolean>(false);
		const [openSeaDragonLib, setOpenSeaDragonLib] = useState<any | null>(null);
		const [openSeaDragonViewer, setOpenSeadragonViewer] = useState<OpenSeadragon.Viewer | null>(
			null
		);

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
			if (openSeaDragonViewer) {
				openSeaDragonViewer.goToPage(activeImageIndex);
			}
		}, [activeImageIndex, openSeaDragonViewer]);

		const addFullscreenCloseButton = useCallback(
			(openSeadragonViewer: OpenSeadragon.Viewer) => {
				if (!openSeadragonViewer.container) {
					return;
				}
				const topLeftContainer = openSeadragonViewer.container.querySelector(
					'.openseadragon-canvas + div'
				);
				if (!topLeftContainer) {
					return;
				}
				topLeftContainer.innerHTML = '';
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
				topLeftContainer?.append(closeFullscreenButton);
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

		const initIiifViewer = useCallback(async () => {
			console.log('initIiifViewer', {
				imageInfos,
				id,
				isOcrEnabled,
				setIsOcrEnabled,
				activeImageIndex,
				setActiveImageIndex,
				onSelection,
			});
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

				setOpenSeadragonViewer(openSeadragonViewerTemp);
			}
		}, [
			activeImageIndex,
			addFullscreenCloseButton,
			id,
			iiifViewerId,
			imageInfos,
			isMobile,
			isOcrEnabled,
			onSelection,
			setActiveImageIndex,
			setIsOcrEnabled,
		]);

		useEffect(() => {
			updateOcrOverlay();
		}, [updateOcrOverlay]);

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
				<div className={iiifStyles['p-object-detail__iiif__controls']}>
					{!iiifGridViewEnabled && (
						<>
							{
								<Button
									className={clsx(
										iiifStyles['p-object-detail__iiif__controls__button'],
										'p-object-detail__iiif__controls__grid-view__previous-image'
									)}
									icon={<Icon name={IconNamesLight.ArrowLeft} aria-hidden />}
									aria-label={tText(
										'modules/iiif-viewer/iiif-viewer___ga-naar-de-vorige-afbeelding'
									)}
									variants={['white']}
									onClick={() => setActiveImageIndex(activeImageIndex - 1)}
									disabled={activeImageIndex === 0}
								/>
							}
							{
								<Button
									className={clsx(
										iiifStyles['p-object-detail__iiif__controls__button'],
										'p-object-detail__iiif__controls__grid-view__next-image'
									)}
									icon={<Icon name={IconNamesLight.ArrowRight} aria-hidden />}
									aria-label={tText(
										'modules/iiif-viewer/iiif-viewer___ga-naar-de-volgende-afbeelding'
									)}
									variants={['white']}
									onClick={() => setActiveImageIndex(activeImageIndex + 1)}
									disabled={activeImageIndex === imageInfos.length - 1}
								/>
							}
							<Button
								className={clsx(
									iiifStyles['p-object-detail__iiif__controls__button'],
									'p-object-detail__iiif__controls__grid-view__enable'
								)}
								icon={<Icon name={IconNamesLight.GridView} aria-hidden />}
								aria-label={tText(
									'pages/openseadragon/index___alle-paginas-in-een-grid-bekijken'
								)}
								variants={['white']}
								onClick={() => setIiifGridViewEnabled(true)}
							/>
							<Button
								className={clsx(
									iiifStyles['p-object-detail__iiif__controls__button'],
									'p-object-detail__iiif__controls__zoom-in'
								)}
								icon={<Icon name={IconNamesLight.ZoomIn} aria-hidden />}
								aria-label={tText(
									'pages/openseadragon/index___afbeelding-inzoemen'
								)}
								variants={['white']}
								onClick={() => iiifZoom(1.3)}
							/>
							<Button
								className={clsx(
									iiifStyles['p-object-detail__iiif__controls__button'],
									'p-object-detail__iiif__controls__zoom-out'
								)}
								icon={<Icon name={IconNamesLight.ZoomOut} aria-hidden />}
								aria-label={tText(
									'pages/openseadragon/index___afbeelding-uitzoemen'
								)}
								variants={['white']}
								onClick={() => iiifZoom(0.7)}
							/>
							<Button
								className={clsx(
									iiifStyles['p-object-detail__iiif__controls__button'],
									'p-object-detail__iiif__controls__fullscreen'
								)}
								icon={<Icon name={IconNamesLight.Expand} aria-hidden />}
								aria-label={tText(
									'pages/openseadragon/index___afbeelding-op-volledig-scherm-weergeven'
								)}
								variants={['white']}
								onClick={() => iiifFullscreen(true)}
							/>
							<Button
								className={clsx(
									iiifStyles['p-object-detail__iiif__controls__button'],
									'p-object-detail__iiif__controls__rotate-right'
								)}
								icon={<Icon name={IconNamesLight.Redo} aria-hidden />}
								aria-label={tText(
									'pages/openseadragon/index___afbeelding-rechts-draaien'
								)}
								variants={['white']}
								onClick={() => iiifRotate(true)}
							/>
							{enableSelection && (
								<Button
									className={clsx(
										iiifStyles['p-object-detail__iiif__controls__button'],
										'p-object-detail__iiif__controls__selection'
									)}
									icon={<Icon name={IconNamesLight.ScissorsClip} aria-hidden />}
									aria-label={tText('Selectie downloaden')}
									title={tText('Selectie downloaden')}
									variants={
										(window as any).isSelectionActive ? ['green'] : ['white']
									}
									onClick={() => iiifStartSelection()}
								/>
							)}
							{!!imageInfos[activeImageIndex].altoUrl && (
								<Button
									className={clsx(
										iiifStyles['p-object-detail__iiif__controls__button'],
										'p-object-detail__iiif__controls__toggle-ocr'
									)}
									icon={
										<Icon
											name={
												isOcrEnabled
													? IconNamesLight.NoNewspaper
													: IconNamesLight.Newspaper
											}
											aria-hidden
										/>
									}
									aria-label={tText(
										'pages/openseadragon/index___tekst-boven-de-afbeelding-tonen'
									)}
									variants={['white']}
									onClick={() => setIsOcrEnabled(!isOcrEnabled)}
								/>
							)}
						</>
					)}
					{iiifGridViewEnabled && (
						<Button
							className={clsx(
								iiifStyles['p-object-detail__iiif__controls__button'],
								'p-object-detail__iiif__controls__grid-view__disable'
							)}
							icon={<Icon name={IconNamesLight.File} aria-hidden />}
							aria-label={tText('pages/openseadragon/index___een-pagina-bekijken')}
							variants={['white']}
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
				<PerfectScrollbar className={iiifStyles['p-object-detail__iiif__reference-strip']}>
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

		// IIIF viewer container div
		const renderedIiifViewerContainer = useMemo(() => {
			console.log('rerendering iiif viewer ------------------------');
			return (
				<div
					className={clsx(iiifStyles['p-object-detail__iiif'], {
						'p-object-detail__iiif__ocr--enabled': isOcrEnabled,
						'p-object-detail__iiif__ocr--disabled': !isOcrEnabled,
					})}
					id={iiifViewerId}
					style={{ display: iiifGridViewEnabled ? 'none' : 'block' }}
				/>
			);
		}, [isOcrEnabled, iiifViewerId, iiifGridViewEnabled]);

		return (
			<div className={iiifStyles['c-iiif-viewer']}>
				{renderedIiifViewerContainer}

				{/* IIIF sidebar with pages*/}
				{!iiifGridViewEnabled && renderIiifViewerReferenceStrip()}

				{/* IIIF viewer buttons */}
				{renderIiifViewerButtons()}

				{/* IIIF Grid view */}
				<div
					className={iiifStyles['p-object-detail__iiif__grid-view-wrapper']}
					style={{ display: iiifGridViewEnabled ? 'block' : 'none' }}
				>
					<div className={iiifStyles['p-object-detail__iiif__grid-view']}>
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
