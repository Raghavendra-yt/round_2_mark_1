export default function Stats() {
  const stats = [
    { num: '6', label: 'Election Phases', aria: '6 election phases' },
    { num: '10+', label: 'Key Terms Defined', aria: '10 key terms defined' },
    { num: '5', label: 'Quiz Questions', aria: '5 quiz questions' },
    { num: '100%', label: 'Free to Access', aria: '100 percent free to access' },
  ];

  return (
    <div className="stats" role="list" aria-label="Key statistics">
      {stats.map((s) => (
        <div key={s.label} className="stat-item reveal" role="listitem">
          <div className="stat-num" aria-label={s.aria}>
            {s.num}
          </div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
