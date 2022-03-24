export interface NavigationElement {
	id: number;
	label: string | null;
	icon_name: string;
	description: string | null;
	user_group_ids: number[] | null;
	content_type: string | null;
	content_path: string | number | null;
	link_target: '_blank' | '_self' | null;
	position: number;
	placement: string | null;
	created_at: string;
	updated_at: string;
	tooltip: string | null;
}

export interface NavigationOverviewCellProps {
	row: {
		original: NavigationElement;
	};
}
