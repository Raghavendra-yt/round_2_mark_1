import { haversineKm, estimateDriveMinutes, estimateWalkMinutes, formatDistance, clamp } from './geo';

describe('haversineKm', () => {
  it('returns 0 for identical coordinates', () => {
    expect(haversineKm(51.5, -0.1, 51.5, -0.1)).toBeCloseTo(0, 3);
  });

  it('returns approximately 111 km per degree of latitude', () => {
    const distance = haversineKm(0, 0, 1, 0);
    expect(distance).toBeCloseTo(111, 0);
  });

  it('computes known distance between London and Paris (~340 km)', () => {
    const distance = haversineKm(51.5074, -0.1278, 48.8566, 2.3522);
    expect(distance).toBeGreaterThan(330);
    expect(distance).toBeLessThan(360);
  });

  it('returns a positive number regardless of direction', () => {
    expect(haversineKm(48.8566, 2.3522, 51.5074, -0.1278)).toBeGreaterThan(0);
  });
});

describe('estimateDriveMinutes', () => {
  it('returns at least 3 minutes for very short distances', () => {
    expect(estimateDriveMinutes(0.01)).toBe(3);
  });

  it('returns a reasonable estimate for 1 km (~2 min at 27 km/h)', () => {
    expect(estimateDriveMinutes(1)).toBeGreaterThanOrEqual(2);
    expect(estimateDriveMinutes(1)).toBeLessThanOrEqual(4);
  });

  it('scales linearly with distance', () => {
    const single = estimateDriveMinutes(1);
    const double = estimateDriveMinutes(2);
    expect(double).toBeGreaterThan(single);
  });
});

describe('estimateWalkMinutes', () => {
  it('returns at least 1 minute', () => {
    expect(estimateWalkMinutes(0.001)).toBe(1);
  });

  it('returns roughly 12 minutes for 1 km (~5 km/h)', () => {
    expect(estimateWalkMinutes(1)).toBeCloseTo(12, 0);
  });
});

describe('formatDistance', () => {
  it('formats to one decimal place with km suffix', () => {
    expect(formatDistance(1.2567)).toBe('1.3 km');
    expect(formatDistance(0)).toBe('0.0 km');
    expect(formatDistance(10.999)).toBe('11.0 km');
  });
});

describe('clamp', () => {
  it('returns value when within bounds', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('returns min when below lower bound', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('returns max when above upper bound', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('handles edge cases at boundaries', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });
});
