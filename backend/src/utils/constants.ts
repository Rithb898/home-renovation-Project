export const RoleEnum = {
  ADMIN: "admin",
  HOME_OWNER: "home_owner",
  PROFESSIONAL: "professional",
  VENDOR: "vendor",
} as const;

export const AvailableRoles = Object.values(RoleEnum);
