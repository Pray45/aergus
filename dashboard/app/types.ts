export type NavItemData = {
  id: string;
  title: string;
  icon: React.ElementType;
  badge?: number | string;
  shortcut?: string;
  children?: NavItemData[];
  href?: string;
};

export type NavGroupData = {
  heading?: string;
  items: NavItemData[];
};