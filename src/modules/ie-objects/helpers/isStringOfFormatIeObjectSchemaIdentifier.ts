export function isStringOfFormatIeObjectSchemaIdentifier(id: string): boolean {
	return /^[0-9a-f]{64}[0-9a-f]*$/g.test(id);
}
