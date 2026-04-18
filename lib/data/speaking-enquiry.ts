/** Allowed values for speaking enquiry — keep in sync with SpeakingForm and /api/speaking */

export const SPEAKING_EVENT_TYPES = [
  "Conference",
  "Corporate Event",
  "University",
  "Faith-Based",
  "Women's Leadership",
  "Other",
] as const;

export const SPEAKING_PREFERRED_TOPICS = [
  "From the Bedroom to the Boardroom",
  "Cultural Intelligence in Practice",
  "Relational Intelligence for the Next Generation",
  "Other",
] as const;

export type SpeakingEventType = (typeof SPEAKING_EVENT_TYPES)[number];
export type SpeakingPreferredTopic = (typeof SPEAKING_PREFERRED_TOPICS)[number];
