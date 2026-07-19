import { users } from "../db/schema/userSchema.js";

declare global {
    namespace Express {
        interface Request {
            user?: typeof users.$inferSelect;
        }
    }
}

export {};