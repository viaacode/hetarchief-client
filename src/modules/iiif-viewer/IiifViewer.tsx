import { Button } from '@meemoo/react-components';

import { IiifViewerFunctions, IiifViewerProps } from '@iiif-viewer/IiifViewer.types';
import altoTextLocations from '@iiif-viewer/alto2-simplified.json';
import { getOpenSeadragonConfig } from '@iiif-viewer/openseadragon-config';
import { Icon, IconNamesLight } from '@shared/components';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useStickyLayout } from '@shared/hooks/use-sticky-layout';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { Breakpoints } from '@shared/types';
import { isBrowser } from '@shared/utils';

import 'react-perfect-scrollbar/dist/css/styles.css';
import clsx from 'clsx';
import { clamp } from 'lodash-es';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import iiifStyles from './IiifViewer.module.scss';

const IiifViewer = forwardRef<IiifViewerFunctions, IiifViewerProps>(
	(
		{ imageInfos, id, isOcrEnabled, setIsOcrEnabled, activeImageIndex, setActiveImageIndex },
		ref
	) => {
		/**
		 * Hooks
		 */
		const { tText } = useTranslation();

		// Internal state
		const [iiifGridViewEnabled, setIiifGridViewEnabled] = useState<boolean>(false);
		const [openSeaDragonLib, setOpenSeaDragonLib] = useState<any | null>(null);
		const [openSeaDragonInstance, setOpenSeadragonInstance] =
			useState<OpenSeadragon.Viewer | null>(null);

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
			if (openSeaDragonInstance) {
				openSeaDragonInstance.goToPage(activeImageIndex);
			}
		}, [activeImageIndex, openSeaDragonInstance]);

		const addFullscreenCloseButton = (openSeadragonViewer: OpenSeadragon.Viewer) => {
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
			closeFullscreenButton.title = tText('Sluit volledig scherm');
			closeFullscreenButton.addEventListener('click', () => {
				openSeadragonViewer.setFullScreen(false);
			});
			topLeftContainer?.append(closeFullscreenButton);
		};

		const initIiifViewer = useCallback(async () => {
			if (!!iiifViewerId && isBrowser()) {
				const iiifContainer = document.getElementById(iiifViewerId);
				if (iiifContainer) {
					iiifContainer.innerHTML = '';
				}
				const OpenSeadragon = (await import('openseadragon')).default;
				// We need to use a function here,
				// since the library is a function itself,
				// and otherwise the setState thinks this is a setter function
				setOpenSeaDragonLib(() => OpenSeadragon);

				// Init Open Seadragon viewer
				const openSeadragonInstanceTemp: OpenSeadragon.Viewer = new OpenSeadragon.Viewer(
					getOpenSeadragonConfig(isMobile, iiifViewerId)
				);

				addFullscreenCloseButton(openSeadragonInstanceTemp);

				openSeadragonInstanceTemp.viewport.goHome(true);

				// const altoTextLocations: TextLine[] = extractTextLinesFromAlto();
				// console.log(altoTextLocations);

				if (isBrowser()) {
					altoTextLocations.forEach((altoTextLocation, index) => {
						const span = document.createElement('SPAN');
						span.className =
							'p-object-detail__iiif__alto__text p-object-detail__iiif__alto__text__' +
							index;
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
						openSeadragonInstanceTemp.addOverlay(
							span,
							new OpenSeadragon.Rect(
								altoTextLocation.x / imageInfos[activeImageIndex].width,
								altoTextLocation.y / imageInfos[activeImageIndex].height,
								altoTextLocation.width / imageInfos[activeImageIndex].width,
								altoTextLocation.height / imageInfos[activeImageIndex].height,
								0
							),
							OpenSeadragon.Placement.CENTER
						);
					});
				}

				setOpenSeadragonInstance(openSeadragonInstanceTemp);
			}
		}, [iiifViewerId, isMobile]);

		useEffect(() => {
			initIiifViewer();
		}, [initIiifViewer]);

		/**
		 * Content
		 */

		const iiifZoom = (multiplier: number): void => {
			if (!openSeaDragonInstance) {
				return;
			}
			const currentZoom = openSeaDragonInstance.viewport.getZoom(true);
			const desiredZoom = clamp(
				currentZoom * multiplier,
				openSeaDragonInstance.viewport.getMinZoom(),
				openSeaDragonInstance.viewport.getMaxZoom()
			);
			//
			console.log('zoom: ', {
				zoom: openSeaDragonInstance?.viewport.getZoom(true),
				min: openSeaDragonInstance?.viewport.getMinZoom(),
				max: openSeaDragonInstance?.viewport.getMaxZoom(),
				home: openSeaDragonInstance?.viewport.getHomeZoom(),
			});
			openSeaDragonInstance.viewport.zoomTo(desiredZoom);
		};

		const iiifFullscreen = (expand: boolean): void => {
			openSeaDragonInstance?.setFullScreen(expand);
		};

		const iiifGoToPage = (pageIndex: number): void => {
			setActiveImageIndex(pageIndex);
			openSeaDragonInstance?.goToPage(pageIndex);
		};

		const iiifRotate = (rotateRight: boolean): void => {
			openSeaDragonInstance?.viewport.setRotation(
				(openSeaDragonInstance?.viewport.getRotation() + 90 * (rotateRight ? 1 : -1)) % 360
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
			if (!openSeaDragonInstance) {
				return;
			}
			openSeaDragonInstance.viewport.zoomTo(2.5, undefined, true);
			openSeaDragonInstance.viewport.panTo(
				new openSeaDragonLib.Point(
					(x + width / 2) / imageInfos[activeImageIndex].width,
					(y + height / 2) / imageInfos[activeImageIndex].height
				),
				false
			);
		};

		const clearActiveWordIndex = () => {
			openSeaDragonInstance?.container
				?.querySelectorAll('.p-object-detail__iiif__alto__text')
				.forEach((element) => {
					element.classList.remove('p-object-detail__iiif__alto__text--active');
				});
		};

		const setActiveWordIndex = (wordIndex: number) => {
			clearActiveWordIndex();
			openSeaDragonInstance?.container
				?.querySelector('.p-object-detail__iiif__alto__text__' + wordIndex)
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
							{isMobile && imageInfos.length > 1 && (
								<Button
									className={clsx(
										iiifStyles['p-object-detail__iiif__controls__button'],
										'p-object-detail__iiif__controls__grid-view__previous-image'
									)}
									icon={<Icon name={IconNamesLight.ArrowLeft} aria-hidden />}
									aria-label={tText('Ga naar de vorige afbeelding')}
									variants={['white']}
									onClick={() => setActiveImageIndex(activeImageIndex - 1)}
									disabled={activeImageIndex === 0}
								/>
							)}
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
							{isMobile && imageInfos.length > 1 && (
								<Button
									className={clsx(
										iiifStyles['p-object-detail__iiif__controls__button'],
										'p-object-detail__iiif__controls__grid-view__next-image'
									)}
									icon={<Icon name={IconNamesLight.ArrowRight} aria-hidden />}
									aria-label={tText('Ga naar de volgende afbeelding')}
									variants={['white']}
									onClick={() => setActiveImageIndex(activeImageIndex + 1)}
									disabled={activeImageIndex === imageInfos.length - 1}
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

		return (
			<div className={iiifStyles['c-iiif-viewer']}>
				{/* IIIF viewer*/}
				<div
					className={
						iiifStyles['p-object-detail__iiif'] +
						(isOcrEnabled
							? ' p-object-detail__iiif__ocr--enabled'
							: ' p-object-detail__iiif__ocr--disabled')
					}
					id={iiifViewerId}
					style={{ display: iiifGridViewEnabled ? 'none' : 'block' }}
				/>

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
										openSeaDragonInstance?.forceRedraw();
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
