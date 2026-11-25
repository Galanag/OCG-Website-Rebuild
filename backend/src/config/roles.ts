export const ROLE_DEFINITIONS = [
  {
    name: "SUPER_ADMIN",
    description: "Full system control including users, roles and settings.",
    permissions: [
      "content:read", "content:write", "content:publish", "content:delete",
      "submissions:read", "media:write", "users:manage", "roles:manage",
      "settings:manage", "audit:read",
    ],
  },
  {
    name: "ADMINISTRATOR",
    description: "Manage projects, announcements, news, events and submissions.",
    permissions: [
      "content:read", "content:write", "content:publish", "content:delete",
      "submissions:read", "media:write", "audit:read",
    ],
  },
  {
    name: "EDITOR",
    description: "Create and edit content, manage drafts and upload media.",
    permissions: ["content:read", "content:write", "media:write"],
  },
  {
    name: "PUBLISHER",
    description: "Review, publish and unpublish content.",
    permissions: ["content:read", "content:publish", "submissions:read"],
  },
  {
    name: "VIEWER",
    description: "Read-only administrative access.",
    permissions: ["content:read", "submissions:read"],
  },
] as const;

export const ALL_PERMISSIONS = [
  "content:read", "content:write", "content:publish", "content:delete",
  "submissions:read", "media:write", "users:manage", "roles:manage",
  "settings:manage", "audit:read",
] as const;

export type Permission = (typeof ALL_PERMISSIONS)[number];