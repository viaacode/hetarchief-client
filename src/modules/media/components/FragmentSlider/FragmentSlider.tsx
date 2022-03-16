import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import Image from 'next/image';
import { FC, useRef, useState } from 'react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { Icon } from '@shared/components';

import styles from './FragmentSlider.module.scss';
import { FragmentSliderProps } from './FragmentSlider.types';

const Metadata: FC<FragmentSliderProps> = ({ className, fragments, onChangeFragment }) => {
	const [currentFragment, setCurrentFragment] = useState<number>(0);
	const sliderRef = useRef<Slider | null>(null);

	return (
		<>
			<div className={clsx(className, styles['c-fragment-slider__grid'])}>
				<Button
					className={styles['c-fragment-slider__focus-button']}
					onClick={() => sliderRef.current?.slickGoTo(currentFragment)}
					variants={['sm', 'black']}
				>
					focus
				</Button>
				<Button
					className={styles['c-fragment-slider__nav-button']}
					disabled={currentFragment === 0}
					onClick={() => sliderRef.current?.slickPrev()}
					icon={<Icon name="angle-left" />}
					variants="black"
				/>
				<Slider
					className={styles['c-fragment-slider']}
					ref={sliderRef}
					accessibility={true}
					infinite={false}
					focusOnSelect
					slidesToShow={1}
					slidesToScroll={1}
					arrows={false}
					centerMode
					centerPadding="0"
					beforeChange={(_, index) => {
						setCurrentFragment(index);
						onChangeFragment?.(index);
					}}
				>
					{fragments.map((item, index) => (
						<div key={`fragment-${index}`}>
							<div className={styles['c-fragment-slider__item']}>
								<Image
									src={
										index % 2 === 0
											? 'https://via.placeholder.com/1920x1080'
											: 'https://via.placeholder.com/1080x1920'
									}
									alt="placeholder"
									layout="fill"
									objectFit="cover"
								/>
							</div>
						</div>
					))}
				</Slider>
				<Button
					className={styles['c-fragment-slider__nav-button']}
					disabled={currentFragment === fragments.length - 1}
					onClick={() => sliderRef.current?.slickNext()}
					icon={<Icon name="angle-right" />}
					variants="black"
				/>
			</div>
		</>
	);
};
export default Metadata;
