import slugify from "slugify";

import * as workspaceRepository from "./workspaceRepository.js";
import { randomUUID } from "crypto";
import { workspace } from "../db/schema/workspaceSchema.js";
import { users } from "../db/schema/userSchema.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import {
  freeTierWorkspaceLimit,
  teamTierWorkspaceLimit,
  enterpriseTierWorkspaceLimit,
} from "../config/tier.js";

export const createWorkspaceService = async (
  userId: string,
  payload: {
    name: string;
    description?: string;
  },
) => {
  // 1. Fetch user's subscription tier
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { tier: true },
  });

  if (!user) {
    throw new Error("User profile not found");
  }

  // 2. Count owned workspaces
  const ownedWorkspaces =
    await workspaceRepository.findWorkspaceByOwnerId(userId);
  const workspaceCount = ownedWorkspaces.length;

  // 3. Enforce quotas

  if (user.tier === "developer") {
    if (workspaceCount > freeTierWorkspaceLimit) {
      throw new Error(
        "Free tier users can only create one workspace. Please upgrade to Pro or Elite to create more.",
      );
    }
  }

  if (user.tier === "team") {
    if (workspaceCount > teamTierWorkspaceLimit) {
      throw new Error(
        "team tier users can only create three workspaces. Please upgrade to Elite to create more.",
      );
    }
  }

  if (user.tier === "enterprise") {
    if (workspaceCount > enterpriseTierWorkspaceLimit) {
      throw new Error(
        "Elite users can only create six workspaces. Please upgrade to Enterprise to create more.",
      );
    }
  }

  if (workspaceCount > enterpriseTierWorkspaceLimit) {
    throw new Error("sorry, max Workspace count reaced");
  }

  const slug = slugify(payload.name, {
    lower: true,
    strict: true,
  });

  const existing = await workspaceRepository.findWorkspaceBySlug(slug);

  if (existing) {
    throw new Error("Workspace already exists");
  }

  const newWorkspace = await workspaceRepository.createWorkspace({
    id: randomUUID(),
    name: payload.name,
    slug,
    description: payload.description,
    ownerId: userId,
  });

  // Automatically add the creator as OWNER member
  await workspaceRepository.addMember(newWorkspace.id, userId, "OWNER");

  return newWorkspace;
};

export const addWorkspaceMemberService = async (
  workspaceId: string,
  requesterId: string,
  targetEmail: string,
  role: "ADMIN" | "MEMBER" | "VIEWER",
) => {
  // 1. Fetch workspace to check existence
  const workspaceObj = await workspaceRepository.findWorkspaceById(workspaceId);
  if (!workspaceObj) {
    throw new Error("Workspace not found");
  }

  // 2. Check if requester is authorized to add members (must be owner or ADMIN/OWNER member)
  const canManage = await workspaceRepository.canUpdateWorkspace(
    workspaceId,
    requesterId,
  );
  if (!canManage) {
    throw new Error(
      "You do not have permission to add members to this workspace",
    );
  }

  // 3. Find the target user by email
  const targetUser = await db.query.users.findFirst({
    where: eq(users.email, targetEmail),
  });

  if (!targetUser) {
    throw new Error("User with this email does not exist");
  }

  // 4. Check if target user is already a member
  const isTargetAlreadyMember = await workspaceRepository.hasAccess(
    workspaceId,
    targetUser.id,
  );
  if (isTargetAlreadyMember) {
    throw new Error("User is already a member of this workspace");
  }

  // 5. Enforce tier restrictions:
  // Fetch requester's tier
  const requester = await db.query.users.findFirst({
    where: eq(users.id, requesterId),
    columns: { tier: true },
  });

  if (!requester) {
    throw new Error("Requester profile not found");
  }

  // Free/developer tier can only invite as VIEWER
  if (requester.tier === "developer" && role !== "VIEWER") {
    throw new Error(
      "Free tier users can only share workspaces with VIEWER role. Please upgrade to Pro or Elite to add ADMIN or MEMBERs.",
    );
  }

  // 6. Insert new member record
  await workspaceRepository.addMember(workspaceId, targetUser.id, role);
};

export const updateWorkspaceService = async (
  workspaceId: string,
  payload: {
    name?: string;
    description?: string;
  },
) => {
  const updateData: Partial<typeof workspace.$inferInsert> = { ...payload };

  if (payload.name) {
    const slug = slugify(payload.name, {
      lower: true,
      strict: true,
    });

    const existing = await workspaceRepository.findWorkspaceBySlug(slug);

    if (existing) {
      throw new Error("Workspace already exists");
    }

    updateData.slug = slug;
  }

  const updated = await workspaceRepository.updateWorkspace(
    workspaceId,
    updateData,
  );

  return updated;
};
