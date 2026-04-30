import { memo, useMemo } from 'react';

const STATS_DATA = [
  { value: '6',    label: 'Election Phases',   aria: '6 election phases' },
  { value: '10+',  label: 'Key Terms Defined', aria: '10 or more key terms defined' },
  { value: '5',    label: 'Quiz Questions',    aria: '5 quiz questions' },
  { value: '100%', label: 'Free to Access',   aria: '100 percent free to access' },
];

/** Individual statistic display item. */
const StatItem = memo(function StatItem({ value, label, aria }) {
  return (
    <div className="stat-item reveal" role="listitem">
      <div className="stat-num" aria-label={aria}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
});

StatItem.displayName = 'StatItem';

/** Key statistics banner shown below the hero. */
function Stats() {
  const stats = useMemo(() => STATS_DATA, []);

  return (
    <div className="stats" role="list" aria-label="Key statistics about ElectED">
      {stats.map((stat) => (
        <StatItem key={stat.label} {...stat} />
      ))}
    </div>
  );
}

export { Stats };
