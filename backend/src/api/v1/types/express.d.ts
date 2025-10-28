import type { UserPayloadPrivate } from "../service/auth/types";

declare global {
	namespace Express {
		interface Request {
			user?: UserPayloadPrivate;
		}
	}
}

