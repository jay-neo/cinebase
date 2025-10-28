import { config } from "dotenv";
config();

const isValidUrl = (url: string): boolean => {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
};

export const env = {
	nodeEnv: process.env.NODE_ENV,

	port: parseInt(process.env.SERVER_PORT || "8080", 10),
	baseUrl: process.env.SERVER_URL || "http://localhost:8080",

	clients: Object.keys(process.env)
		.filter((key) => key.startsWith("CLIENT_"))
		.map((key) => process.env[key] as string)
		.filter((client) => client && isValidUrl(client)),

	jwtSecretKey: process.env.JWT_SECRET_KEY!,
	accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY!,
	refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY!,

	googleClientId: process.env.GOOGLE_CLIENT_ID!,
	googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,

	githubClientId: process.env.GITHUB_CLIENT_ID!,
	githubClientSecret: process.env.GITHUB_CLIENT_SECRET!,

	cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
	cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
	cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
};
