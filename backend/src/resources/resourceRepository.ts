import { db } from "../db/index.js";
import { resources } from "../db/schema/resourcesSchema.js";

export const createResourceRepository = async (body: any) => {
  try {
    const createResource = await db.insert(resources).values(body);
    return createResource;
  } catch (error) {
    throw error;
  }
};