export function getPaginationParams(page: any, limit: any): [number, number] {
	// Ensure 'page' and 'limit' are strings (if present), and provide defaults if necessary
	const pageNumber = page ? (Array.isArray(page) ? page[0] : page) : "1"; // Default to '1' if not provided
	const pageLimit = limit ? (Array.isArray(limit) ? limit[0] : limit) : "10"; // Default to '10' if not provided

	// Convert pageNumber and pageLimit to integers
	const pageInt = parseInt(pageNumber, 10);
	const limitInt = parseInt(pageLimit, 10);

	// Fallback to default values if conversion fails (i.e., NaN)
	const finalPage: number = Number.isNaN(pageInt) ? 1 : pageInt;
	const finalLimit: number = Number.isNaN(limitInt) ? 10 : limitInt;

	return [finalPage, finalLimit];
}
