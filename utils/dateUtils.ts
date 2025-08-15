export const dateUtils = {
  /** e.g. "2025-08-14T16:00:00.000Z" -> "2025-08-14T09:00:00.000Z" */
  stringTimestampToPSTString: (timestamp: string) => {
    const utcDate = new Date(timestamp);
    // Create a new date in PST by converting from UTC
    return new Date(
      utcDate.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
    );
  },
  /** Returns the number of minutes since midnight in PST */
  getPSTMinutes: (timestamp: string) => {
    const pstDate = dateUtils.stringTimestampToPSTString(timestamp);
    return pstDate.getHours() * 60 + pstDate.getMinutes();
  },
  getYYYYMMDD: (date: Date) => {
    return YMD_PACIFIC.format(date);
  },
  /** e.g. day: "14", hour: "20", minute: "36", month: "08", weekday: "Thu", year: "2025" */
  getPacificParts: (date: Date) => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(date);

    // Turn into a simple object { year, month, day, weekday, hour, minute }
    return Object.fromEntries(
      parts.filter((p) => p.type !== "literal").map((p) => [p.type, p.value]),
    );
  },
};

const YMD_PACIFIC = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Los_Angeles",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
