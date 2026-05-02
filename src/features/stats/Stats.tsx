import React, { memo, useMemo, ReactNode } from 'react';

/**
 * Props for the individual StatItem component.
 */
interface StatItemProps {
  /** The value to display (e.g., "100%"). */
  value: string;
  /** The descriptive label for the statistic. */
  label: string;
  /** ARIA label for screen readers to provide context. */
  aria: string;
}

/**
 * Props for the StatsContainer component.
 */
interface StatsProps {
  /** Stat items to render within the container. */
  children: ReactNode;
  /** Optional ARIA label for the statistics list. */
  ariaLabel?: string;
}

/**
 * Static data for the statistics section.
 */
const STATS_DATA: StatItemProps[] = [
  { value: '6',    label: 'Election Phases',   aria: '6 election phases' },
  { value: '10+',  label: 'Key Terms Defined', aria: '10 or more key terms defined' },
  { value: '5',    label: 'Quiz Questions',    aria: '5 quiz questions' },
  { value: '100%', label: 'Free to Access',   aria: '100 percent free to access' },
];

/** 
 * Single statistic display item.
 * 
 * @component
 */
const StatItem: React.FC<StatItemProps> = memo(({ value, label, aria }) => {
  return (
    <div className="stat-item reveal" role="listitem">
      <div className="stat-num" aria-label={aria}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
});

StatItem.displayName = 'StatItem';

/** 
 * Container component for stats items.
 * Implements the compound component pattern.
 * 
 * @component
 */
const StatsContainer: React.FC<StatsProps> = memo(({ children, ariaLabel = "Key statistics about ElectED" }) => {
  return (
    <div className="stats" role="list" aria-label={ariaLabel}>
      {children}
    </div>
  );
});

StatsContainer.displayName = 'StatsContainer';

/**
 * Combined Stats component using the Compound Component Pattern.
 */
const Stats = Object.assign(StatsContainer, {
  Item: StatItem,
});

/** 
 * Main statistics section component.
 * Maps through the statistics data and renders the compound Stats component.
 * 
 * @component
 */
export const StatsSection: React.FC = memo(() => {
  const stats = useMemo(() => STATS_DATA, []);

  return (
    <Stats ariaLabel="Key statistics about ElectED">
      {stats.map((stat) => (
        <Stats.Item key={stat.label} {...stat} />
      ))}
    </Stats>
  );
});

StatsSection.displayName = 'StatsSection';

export { Stats, STATS_DATA };
