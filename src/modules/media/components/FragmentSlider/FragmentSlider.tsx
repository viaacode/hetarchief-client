import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import Image from 'next/image';
import { FC, useEffect, useRef, useState } from 'react';

import { FLOWPLAYER_FORMATS, IMAGE_FORMATS } from '@media/const';
import { MediaRepresentation } from '@media/types';
import { Icon, IconNamesLight } from '@shared/components';
import { useElementSize } from '@shared/hooks/use-element-size';
import useTranslation from '@shared/hooks/use-translation/use-translation';

import { ObjectPlaceholder } from '../ObjectPlaceholder';

import styles from './FragmentSlider.module.scss';
import { FragmentSliderProps } from './FragmentSlider.types';

const Metadata: FC<FragmentSliderProps> = ({
	className,
	thumbnail,
	fragments,
	onChangeFragment,
}) => {
	const { tText } = useTranslation();
	const [offset, setOffset] = useState<number>(0);
	const [active, setActive] = useState<number>(0);
	const [isBlurred, setIsBlurred] = useState<boolean>(true);
	const [needsScrolling, setNeedsScrolling] = useState<boolean>(false);

	const fragmentsRef = useRef(null);
	const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const fragmentsSize = useElementSize(fragmentsRef);

	const totalFragments = fragments.length;

	// Equal to variables in FragmentSlider.module.scss
	const fragmentSize = 16; // rem
	const fragmentSpacing = 2.5; // rem
	const buttonSize = 3.6; // rem

	// Debounce blur event to avoid rubberbanding
	useEffect(() => {
		if (isBlurred) {
			blurTimerRef.current && clearTimeout(blurTimerRef.current);
			blurTimerRef.current = setTimeout(() => needsScrolling && setOffset(active), 150);
		} else {
			blurTimerRef.current && clearTimeout(blurTimerRef.current);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isBlurred]);

	// Control reflow between scrollable/non-scrollable slider
	useEffect(() => {
		if (fragmentsSize) {
			const updatedNeedsScrolling =
				fragmentsSize.width / 10 <
				totalFragments * (fragmentSize + fragmentSpacing) + buttonSize * 2;
			setNeedsScrolling(updatedNeedsScrolling);

			if (!updatedNeedsScrolling && offset > 0) {
				setOffset(0);
			} else if (updatedNeedsScrolling && offset !== active) {
				setOffset(active);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fragmentsSize, totalFragments]);

	const renderThumbnail = (representation: MediaRepresentation) => {
		let image = null;
		if (FLOWPLAYER_FORMATS.includes(representation.dctermsFormat)) {
			image = thumbnail || '';
		}
		if (IMAGE_FORMATS.includes(representation.dctermsFormat)) {
			// TODO: image preview
			image = undefined; // Currently no images in representations
		}

		// No renderer
		return image ? (
			<Image
				unoptimized
				src={image}
				alt={representation.alternateName}
				layout="fill"
				objectFit="cover"
			/>
		) : (
			<ObjectPlaceholder className={styles['c-fragment-slider__item-image']} small />
		);
	};

	return (
		<div className={clsx(className, styles['c-fragment-slider__grid'])}>
			<Button
				tabIndex={-1}
				className={styles['c-fragment-slider__nav-button']}
				icon={<Icon name={IconNamesLight.AngleLeft} aria-hidden />}
				aria-label={tText(
					'modules/media/components/fragment-slider/fragment-slider___naar-het-vorige-fragment'
				)}
				variants="black"
				disabled={!needsScrolling || offset === 0}
				onClick={() => {
					if (offset > 0) {
						needsScrolling && setOffset(offset - 1);
						setIsBlurred(false);
					}
				}}
			/>
			<div ref={fragmentsRef} className={styles['c-fragment-slider__items']}>
				<ul
					role="list"
					className={clsx(
						styles['c-fragment-slider__track'],
						!needsScrolling && styles['c-fragment-slider__track--centered']
					)}
					style={{
						transform: `translateX(${
							needsScrolling
								? -offset * (fragmentSize + fragmentSpacing) +
								  (fragmentsSize ? fragmentsSize?.width / 20 : 0) -
								  fragmentSize / 2
								: -offset * (fragmentSize + fragmentSpacing)
						}rem)`,
					}}
					onBlur={() => {
						setIsBlurred(true);
					}}
					onFocus={() => {
						setIsBlurred(false);
					}}
				>
					{fragments.map((item, index) => (
						<li
							role="listitem"
							className={clsx(
								styles['c-fragment-slider__item'],
								index === active && styles['c-fragment-slider__item--active']
							)}
							key={`fragment-${index}`}
							tabIndex={0}
							data-index={index}
							onClick={(e) => {
								const index = parseInt(
									e.currentTarget.getAttribute('data-index') as string
								);
								needsScrolling && setOffset(index);
								setActive(index);
								onChangeFragment?.(index);
							}}
							onKeyUp={(e) => {
								if (e.key === 'Tab') {
									// Scroll through fragments
									const offsetIndex = parseInt(
										e.currentTarget.getAttribute('data-index') as string
									);
									needsScrolling && setOffset(offsetIndex);
								}
								if (e.key === 'Enter') {
									// Select fragment
									const activeIndex = parseInt(
										e.currentTarget.getAttribute('data-index') as string
									);
									setActive(activeIndex);
									onChangeFragment?.(index);
								}
							}}
						>
							<div className={styles['c-fragment-slider__item-image-wrapper']}>
								{renderThumbnail(item)}
							</div>
						</li>
					))}
				</ul>
			</div>
			<Button
				tabIndex={-1}
				className={styles['c-fragment-slider__nav-button']}
				icon={<Icon name={IconNamesLight.AngleRight} aria-hidden />}
				aria-label={tText(
					'modules/media/components/fragment-slider/fragment-slider___naar-het-volgende-fragment'
				)}
				variants="black"
				disabled={!needsScrolling || offset === totalFragments - 1}
				onClick={() => {
					if (offset < totalFragments - 1) {
						needsScrolling && setOffset(offset + 1);
						setIsBlurred(false);
					}
				}}
			/>
		</div>
	);
};
export default Metadata;
