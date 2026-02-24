import { Icon } from "./Icon";

interface CosmicSectionHeaderProps {
  title: string;
  level?: 2 | 3;
  iconName?: string;
}

export function CosmicSectionHeader({
  title,
  level = 2,
  iconName,
}: CosmicSectionHeaderProps) {
  const Tag = level === 2 ? "h2" : "h3";

  return (
    <div className="flex items-center gap-3 mb-6">
      {iconName && (
        <Icon name={iconName} size={28} className="shrink-0 opacity-80" />
      )}
      <Tag>{title}</Tag>
    </div>
  );
}
