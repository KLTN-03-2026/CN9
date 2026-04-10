import { IconType } from "react-icons";
import { FaPeopleGroup, FaUserGroup, FaUserShield } from "react-icons/fa6";
import { MdInventory, MdOutlineShoppingCart, MdVpnKey } from "react-icons/md";

export type PermissionGroupKey =
  | "product"
  | "order"
  | "role"
  | "permission"
  | "user"
  | "employee";

export const iconForPermissionGroup: Record<PermissionGroupKey, IconType> = {
  user: FaUserGroup,
  role: FaUserShield,
  product: MdInventory,
  permission: MdVpnKey,
  employee: FaPeopleGroup,
  order: MdOutlineShoppingCart,
};
