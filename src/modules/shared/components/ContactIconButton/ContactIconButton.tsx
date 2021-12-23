import clsx from 'clsx';
import React, { FC, MouseEventHandler } from 'react';

import { Button } from '../Button/Button.stories';
import Icon from '../Icon/Icon';

import styles from './ContactIconButton.module.scss';

export interface ContactIconButtonProps {
	color?: string;
	onClick?: MouseEventHandler<HTMLButtonElement>;
}

const ContactIconButton: FC<ContactIconButtonProps> = ({ color, onClick }) => {
	return (
		<Button
			onClick={onClick}
			className={clsx(
				styles['c-contact-icon-button'],
				'c-button--sm',
				'c-button--icon',
				color && `c-button--${color}`
			)}
			icon={<Icon type="light" name="contact" />}
		/>
	);
};

export default ContactIconButton;
