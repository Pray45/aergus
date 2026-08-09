import { Request, Response, NextFunction } from "express";
import { createResourceService } from "./resourceService.js";

export const createResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const resource = await createResourceService(req.body);

    return res.status(201).json({
      success: true,
      message: "Resource created successfully",
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};
