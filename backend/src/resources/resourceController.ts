import { Request, Response, NextFunction } from "express";
import {
  createResourceService,
  deleteResourceService,
  getProjectResourcesService,
  getResourceService,
  updateResourceService,
} from "./resourceService.js";

export const createResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const resource = await createResourceService({
      userId,
      projectId: req.params.projectId as string,
      type: req.body.type,
      name: req.body.name,
      provider: req.body.provider,
      description: req.body.description,
    });

    return res.status(201).json({
      success: true,
      message: "Resource created successfully",
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

export const getResources = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // @ts-ignore
    const userId = req.user.id;

    const resources = await getProjectResourcesService({
      userId,
      projectId: req.params.projectId as string,
    });

    return res.status(200).json({
      success: true,
      message: "Resources fetched successfully",
      data: resources,
    });
  } catch (error) {
    next(error);
  }
};

export const getResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // @ts-ignore
    const userId = req.user.id;

    const resource = await getResourceService({
      userId,
      resourceId: req.params.resourceId as string,
      projectId: req.params.projectId as string | undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Resource fetched successfully",
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

export const updateResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // @ts-ignore
    const userId = req.user.id;

    const resource = await updateResourceService({
      userId,
      resourceId: req.params.resourceId as string,
      projectId: req.params.projectId as string | undefined,
      name: req.body.name,
      type: req.body.type,
      description: req.body.description,
      status: req.body.status,
      metadata: req.body.metadata,
    });

    return res.status(200).json({
      success: true,
      message: "Resource updated successfully",
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // @ts-ignore
    const userId = req.user.id;

    await deleteResourceService({
      userId,
      resourceId: req.params.resourceId as string,
      projectId: req.params.projectId as string | undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Resource deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
