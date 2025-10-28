class AuthUtils {
	private constructor() {}
	private static instance: AuthUtils;
	public static getInstance(): AuthUtils {
		if (!AuthUtils.instance) {
			AuthUtils.instance = new AuthUtils();
		}
		return AuthUtils.instance;
	}

	public convert<S extends Record<string, any>, T extends Record<string, any>>(
		source: S & Partial<T>,
	): T {
		const result: Partial<T> = {};
		const targetKeys = Object.keys({} as T) as (keyof T)[];
		console.log("targetKeys ", targetKeys);
		for (const key of targetKeys) {
			if (key in source) {
				result[key] = source[key] as T[keyof T];
			}
		}
		return result as T;
	}

	public convertToType<S, T>(
		source: S & Partial<T>,
		schema: { [K in keyof T]: true },
	): T {
		const result = {} as T;
		const targetKeys = Object.keys(schema) as (keyof T)[];

		for (const key of targetKeys) {
			if (key in source) {
				result[key] = source[key] as T[keyof T];
			}
		}
		return result;
	}

	public getParentDomain(url: string): string | undefined {
		try {
			const parsedUrl = new URL(url);
			const hostname = parsedUrl.hostname;
			const parts = hostname.split(".");

			if (parts.length < 2) {
				return undefined;
			}

			const tldRegex = /^(co|com|org|net|gov|edu)\.[a-z]{2}$/i;
			const isComplexTLD =
				parts.length >= 3 &&
				tldRegex.test(`${parts[parts.length - 2]}.${parts[parts.length - 1]}`);

			if (isComplexTLD) {
				// For complex TLDs (e.g., example.co.uk), return last three parts
				return parts.slice(-3).join(".");
			} else {
				// For standard TLDs (e.g., example.com), return last two or more parts
				return parts.slice(-2 - (parts.length > 2 ? 1 : 0)).join(".");
			}
		} catch (error) {
			console.error("Invalid URL:", error);
			return undefined;
		}
	}
}

export const authUtils = AuthUtils.getInstance();
