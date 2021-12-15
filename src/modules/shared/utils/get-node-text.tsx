export type Stringifiable = string | number | JSX.Element;

export const getNodeText = (node: Stringifiable | Array<Stringifiable>): string => {
	if (['string', 'number'].includes(typeof node)) return node.toString();
	if (node instanceof Array) return node.map(getNodeText).join('');
	if (typeof node === 'object' && node) return getNodeText(node.props.children);

	return '';
};

export default getNodeText;
