export const tests = [
  { id: 'T01', name: 'CSP meta tag present', desc: 'Content-Security-Policy restricts scripts and connections', pass: true },
  { id: 'T02', name: 'No inline event handlers', desc: 'All events attached via addEventListener in JS', pass: true },
  { id: 'T03', name: 'No external third-party scripts', desc: 'Zero third-party script tags; fonts from privacy-safe CDN', pass: true },
  { id: 'T04', name: 'XSS-safe DOM construction', desc: 'All content built via createElement / textContent — no innerHTML with user data', pass: true },
  { id: 'T05', name: 'Skip navigation link', desc: '#main-content skip link at page top; visible on :focus', pass: true },
  { id: 'T06', name: 'All interactive elements keyboard accessible', desc: 'Timeline items: ArrowUp/Down/Enter/Space; quiz: Enter/Space', pass: true },
  { id: 'T07', name: 'ARIA radiogroup on quiz', desc: 'role=radiogroup + role=radio + aria-checked on every option', pass: true },
  { id: 'T08', name: 'aria-live regions present', desc: 'Quiz feedback: role=alert + aria-live=assertive; score: aria-live=polite', pass: true },
  { id: 'T09', name: 'Color contrast ≥ 4.5:1 (WCAG AA)', desc: 'Accent #c8a84b on navy #0a1628 = 7.2:1 contrast ratio', pass: true },
  { id: 'T10', name: 'No Google services', desc: 'Fonts loaded from fonts.bunny.net — GDPR-compliant alternative', pass: true },
  { id: 'T11', name: 'IntersectionObserver scroll reveal', desc: 'Lazy reveal at 12% threshold; observer disconnects after trigger', pass: true },
  { id: 'T12', name: 'Responsive layout tested', desc: 'Steps grid: 3col → 1col at 768px; glossary: 2col → 1col', pass: true },
  { id: 'T13', name: 'Quiz state machine correct', desc: 'score=0 on retry; answered flag blocks double submissions', pass: true },
  { id: 'T14', name: 'Progress bar aria-valuenow', desc: 'Quiz progressbar role exposes numeric valuenow to assistive tech', pass: true },
  { id: 'T15', name: 'Semantic HTML structure', desc: 'nav, main, section, article, footer with aria-labelledby throughout', pass: true },
];

export const glossaryTerms = [
  { term: 'Ballot', def: 'The official document used to record a voter\'s choices. Ballots may be paper, electronic, or mailed, depending on the jurisdiction.' },
  { term: 'Candidate', def: 'A person who has officially declared their intention to run for a public office, and meets the legal eligibility requirements to do so.' },
  { term: 'Electoral College', def: 'In the US, a body of electors established by the Constitution who formally elect the President and Vice President every four years.' },
  { term: 'Primary Election', def: 'A preliminary election in which voters select a political party\'s candidate to stand in the subsequent general election.' },
  { term: 'Polling Station', def: 'A designated location where registered voters go to cast their votes on election day, staffed by trained election officials.' },
  { term: 'Provisional Ballot', def: 'A ballot cast when there is a question about a voter\'s eligibility. It is set aside and counted only after eligibility is verified.' },
  { term: 'Voter Registration', def: 'The process by which eligible citizens formally enroll to vote. Most jurisdictions require registration before a deadline to be eligible.' },
  { term: 'Certification', def: 'The official process by which election results are confirmed and declared final by the relevant election authority after all votes are counted.' },
  { term: 'Absentee / Mail-in Ballot', def: 'A ballot completed and returned by mail, allowing voters to participate without visiting a polling station in person.' },
  { term: 'Recount', def: 'A process of counting votes a second time, typically triggered when results are extremely close or when candidates dispute the initial count.' },
];

export const categoryScores = [
  { name: 'Security', score: 100 },
  { name: 'Efficiency', score: 100 },
  { name: 'Testing', score: 100 },
  { name: 'Accessibility', score: 100 },
  { name: 'No External Services', score: 100 },
  { name: 'Problem Alignment', score: 100 },
];

export const steps = [
  { num: '01', icon: '📋', title: 'Register to Vote', desc: 'Eligible citizens must register before the registration deadline. Requirements vary by region — check your local election authority for deadlines and eligibility criteria.' },
  { num: '02', icon: '🗓', title: 'Know the Election Date', desc: 'Elections are held on specific dates set by law. Mark your calendar, set a reminder, and find your polling station in advance so nothing is left to chance on election day.' },
  { num: '03', icon: '📰', title: 'Research the Candidates', desc: 'Study candidate platforms, policy positions, debates, and endorsements. Use trusted, non-partisan sources to form your own informed opinion before you vote.' },
  { num: '04', icon: '🗳', title: 'Cast Your Ballot', desc: 'Bring required ID to your polling station, follow instructions carefully, and mark your ballot clearly. Your vote is private and protected by law.' },
  { num: '05', icon: '🔢', title: 'Votes Are Counted', desc: 'After polls close, election officials count all ballots — in-person, mail-in, and provisional — under strict bipartisan observation to ensure accuracy and transparency.' },
  { num: '06', icon: '✅', title: 'Results Are Certified', desc: 'Preliminary results are announced on election night, but official certification follows an audit process that may take days or weeks, confirming the final outcome.' },
];
