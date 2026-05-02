import { z } from 'zod';

/**
 * Security Schema for User Geolocation inputs.
 */
export const GeolocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

/**
 * Security Schema for Weather API response.
 * Ensures we only process data that matches our expected structure.
 */
export const WeatherSchema = z.object({
  temperature: z.number(),
  weathercode: z.number().int().nonnegative(),
  windspeed: z.number().nonnegative(),
  time: z.string().datetime({ offset: true }),
});

/**
 * Security Schema for Leaderboard submissions.
 * Prevents injection and over-sized payloads.
 */
export const LeaderboardSubmissionSchema = z.object({
  name: z.string().min(1).max(32).regex(/^[a-zA-Z\s'-]+$/),
  score: z.number().int().min(0).max(100),
  total: z.number().int().min(1).max(100),
});

export type ValidatedLeaderboard = z.infer<typeof LeaderboardSubmissionSchema>;
