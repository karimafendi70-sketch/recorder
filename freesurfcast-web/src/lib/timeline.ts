export type TimelineRow<TQuality = unknown> = {
  time: string;
  dayPart: string | undefined;
  score: number;
  quality: TQuality;
  slotKey: string | null;
  slotOffset: number | undefined;
};

export function buildTimelineDataForDay<TSlotContext, TQuality>(
  spotId: string,
  dayKey: string,
  allSlotsForSpotAndDay: TSlotContext[],
  options: {
    passesHardConditionFilters: (slotContext: TSlotContext) => boolean;
    getScore: (slotContext: TSlotContext) => TQuality & { score: number };
    buildSlotKey: (slotContext: TSlotContext) => string | null;
    formatTime: (slotContext: TSlotContext) => string;
  }
): Array<TimelineRow<TQuality>> {
  if (!spotId || !dayKey || !Array.isArray(allSlotsForSpotAndDay)) return [];

  return allSlotsForSpotAndDay
    .filter((slotContext) => (slotContext as { dayKey?: string })?.dayKey === dayKey)
    .filter((slotContext) => options.passesHardConditionFilters(slotContext))
    .sort((left, right) => {
      const leftOffset = Number((left as { offsetHours?: number }).offsetHours ?? 0);
      const rightOffset = Number((right as { offsetHours?: number }).offsetHours ?? 0);
      return leftOffset - rightOffset;
    })
    .map((slotContext) => {
      const quality = options.getScore(slotContext);
      return {
        time: options.formatTime(slotContext),
        dayPart: (slotContext as { dayPart?: string }).dayPart,
        score: quality.score,
        quality,
        slotKey: options.buildSlotKey(slotContext),
        slotOffset: (slotContext as { offsetHours?: number }).offsetHours,
      };
    });
}
