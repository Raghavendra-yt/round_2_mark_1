import React, { memo, useMemo, ReactNode } from 'react';

// --- Types ---
interface StatItemProps {
  value: string;
  label: string;
  aria: string;
}

interface StatsProps {
  children: ReactNode;
  ariaLabel?: string;
}

const STATS_DATA: StatItemProps[] = [
  { value: '6',    label: 'Election Phases',   aria: '6 election phases' },
  { value: '10+',  label: 'Key Terms Defined', aria: '10 or more key terms defined' },
  { value: '5',    label: 'Quiz Questions',    aria: '5 quiz questions' },
  { value: '100%', label: 'Free to Access',   aria: '100 percent free to access' },
];

/** 
 * Compound Component Pattern: 
 * Allows flexible composition of statistic components.
 */
const StatItem = memo(function StatItem({ value, label, aria }: StatItemProps) {
  return (
    <div className="stat-item reveal" role="listitem">
      <div className="stat-num" aria-label={aria}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
});
StatItem.displayName = 'Stats.Item';

/** Container component for stats items */
function StatsContainer({ children, ariaLabel = "Key statistics about ElectED" }: StatsProps) {
  return (
    <div className="stats" role="list" aria-label={ariaLabel}>
      {children}
    </div>
  );
}

// Bind sub-components
const Stats = Object.assign(StatsContainer, {
  Item: StatItem,
});

/** 
 * Example usage using the Compound Component Pattern 
 */
export function StatsSection() {
  const stats = useMemo(() => STATS_DATA, []);

  return (
    <Stats ariaLabel="Key statistics about ElectED">
      {stats.map((stat) => (
        <Stats.Item key={stat.label} {...stat} />
      ))}
    </Stats>
  );
}

export { Stats, STATS_DATA };
