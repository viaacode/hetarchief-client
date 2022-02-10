import { FormBladeProps } from '@shared/types';

export type ApproveRequestBladeProps = FormBladeProps<ApproveRequestFormState>;

export interface ApproveRequestFormState {
	accessFrom?: Date;
	accessTo?: Date;
	accessRemark?: string;
}
