import { Button } from '@meemoo/react-components';
import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useState } from 'react';

import Blade from './Blade';
import { BladeProps } from './Blade.types';
import { mockBladeProps } from './__mocks__/blade';

const BladeStoryComponent = ({ args }: { args: BladeProps }) => {
	const [isOpen, setOpen] = useState(false);

	const open = () => {
		action('onOpen')();
		setOpen(true);
	};

	const close = () => {
		action('onClose')();
		setOpen(false);
	};

	return (
		<>
			<div>
				<h1>Blades</h1>
				<Button label="Open modal" onClick={open} />
			</div>
			<Blade {...args} onClose={close} isOpen={isOpen} />
		</>
	);
};

export default {
	title: 'Components/Blade',
	component: Blade,
} as ComponentMeta<typeof Blade>;

const Template: ComponentStory<typeof Blade> = (args) => <BladeStoryComponent args={args} />;

export const Default = Template.bind({});
Default.args = {
	...mockBladeProps,
	children: <div style={{ backgroundColor: 'beige', height: '100%' }}>This is the content</div>,
};

export const WithoutOverlay = Template.bind({});
WithoutOverlay.args = {
	...mockBladeProps,
	children: <div style={{ backgroundColor: 'beige', height: '100%' }}>This is the content</div>,
	hideOverlay: true,
};

export const WithoutCloseButton = Template.bind({});
WithoutCloseButton.args = {
	...mockBladeProps,
	children: <div style={{ backgroundColor: 'beige', height: '100%' }}>This is the content</div>,
	hideCloseButton: true,
};

export const WithoutTitleAndCloseButton = Template.bind({});
WithoutTitleAndCloseButton.args = {
	children: <div style={{ backgroundColor: 'beige', height: '100%' }}>This is the content</div>,
	footer: (
		<div>
			<Button label="continue" variants={['block', 'text']} />
		</div>
	),
	hideCloseButton: true,
};

export const WithCustomTitle = Template.bind({});
WithCustomTitle.args = {
	heading: <h3>This is a custom h3 without styling</h3>,
	children: <div style={{ backgroundColor: 'beige', height: '100%' }}>This is the content</div>,
};

export const WithScrollingContent = Template.bind({});
WithScrollingContent.args = {
	...mockBladeProps,
	children: (
		<div style={{ backgroundColor: 'beige' }}>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ut dolor neque.
				Suspendisse orci est, feugiat non leo ac, iaculis vulputate odio. Praesent eget nunc
				at elit ullamcorper euismod sit amet placerat dolor. Mauris convallis ultrices nibh,
				posuere porttitor nibh aliquet ac. In viverra justo risus, id tincidunt felis
				vulputate ut. Morbi finibus hendrerit vehicula. Praesent eget pellentesque lacus,
				volutpat consectetur purus. Donec nec dui nisi. Donec nec ex vitae risus cursus
				luctus. In elit velit, pellentesque vel felis ut, consectetur elementum nunc. Donec
				in nulla in nulla molestie venenatis. Sed viverra tristique magna vel vulputate.
				Suspendisse potenti. Etiam auctor enim diam, eget euismod massa semper ac.
				Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis
				egestas. Donec nec massa ornare, iaculis sem nec, luctus orci.
			</p>
			<p>
				Aliquam suscipit odio eros, ut commodo lorem sollicitudin et. Vestibulum et placerat
				mauris. Etiam tellus eros, malesuada ut elit eget, faucibus lobortis orci. In hac
				habitasse platea dictumst. Proin tincidunt lectus velit, at tempor orci imperdiet
				nec. Nulla vulputate mauris sed maximus aliquam. Praesent tempus libero porta purus
				tempor, pretium porta ante tincidunt. Praesent ac nunc ac orci maximus rhoncus. Sed
				sodales eros at condimentum tempor. Pellentesque efficitur luctus sapien ut
				interdum. Etiam sed turpis et diam varius imperdiet. Suspendisse potenti. Cras eros
				massa, pharetra quis euismod vulputate, ultrices id lorem. Duis neque tortor, porta
				ac ornare at, pulvinar imperdiet diam. Vivamus a commodo lacus.
			</p>
			<p>
				Cras bibendum mi sapien, blandit tristique tellus placerat in. Nullam suscipit
				ligula tortor, nec varius ipsum malesuada in. Nam sit amet turpis diam. Interdum et
				malesuada fames ac ante ipsum primis in faucibus. Quisque luctus arcu nec erat
				mattis lacinia. Nunc porta justo nibh, quis faucibus ante ultricies ac. Cras a
				lobortis nunc. Nunc id vulputate arcu. Vivamus a velit a urna tristique condimentum.
				Suspendisse nec felis ante. Vivamus in nunc gravida, hendrerit libero ac, ornare
				nulla. Suspendisse sodales laoreet nisi, vitae mattis velit condimentum non. Aenean
				laoreet nunc lacus, nec fringilla diam consequat eget. Maecenas elementum orci
				dolor, nec tincidunt purus semper et. Phasellus scelerisque nunc eu sapien tempus,
				in rhoncus libero luctus. Curabitur eget risus purus.
			</p>
			<p>
				Etiam at odio scelerisque, pretium ex a, volutpat diam. Interdum et malesuada fames
				ac ante ipsum primis in faucibus. Cras sollicitudin leo risus, in congue mauris
				interdum sit amet. Curabitur elementum ipsum sed nisl fermentum, a luctus risus
				ultrices. Vestibulum sed diam fringilla, malesuada nisl quis, ultrices ligula.
				Phasellus vehicula fermentum felis. Donec ac tempus ex.
			</p>
			<p>
				Praesent nec nisl mi. Nulla aliquam justo arcu, et rhoncus risus ornare eu.
				Suspendisse potenti. Integer dapibus, ligula in gravida scelerisque, magna orci
				hendrerit enim, pulvinar blandit leo nisl pharetra quam. Ut eget lacinia ligula, in
				fringilla ligula. Nam justo sem, tempus at iaculis ut, aliquam aliquam arcu.
				Vestibulum feugiat nisi libero. Nulla rutrum finibus ex, nec molestie ligula feugiat
				et. Nunc ut libero eros. Curabitur euismod tempus nunc. Mauris consequat enim
				lobortis, efficitur ante in, pellentesque arcu. Integer ac mauris id lorem iaculis
				molestie elementum eget justo.
			</p>
		</div>
	),
};
