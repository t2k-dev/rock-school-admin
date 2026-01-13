import { format, getDay } from "date-fns";

/**
 * Converts an array of time slots to schedule periods
 * @param {Array} slots - Array of slot objects with start, end, roomId, and optionally teacherId
 * @param {Object} options - Configuration options
 * @param {boolean} options.includeTeacherId - Whether to include teacherId in the output (default: true)
 * @returns {Array} Array of schedule period objects
 */
export const convertSlotsToSchedules = (slots, options = {}) => {
  const { includeTeacherId = true } = options;

  if (!Array.isArray(slots)) {
    console.warn('convertSlotsToSchedules: slots should be an array');
    return [];
  }

  return slots
    .filter(slot => {
      // Filter out invalid slots
      if (!slot || !slot.start || !slot.end) {
        console.warn('convertSlotsToSchedules: Invalid slot detected', slot);
        return false;
      }
      return true;
    })
    .map(slot => {
      try {
        const schedule = {
          weekDay: getDay(slot.start),
          startTime: format(slot.start, "HH:mm"),
          endTime: format(slot.end, "HH:mm"),
          roomId: slot.roomId,
        };

        // Only include teacherId if requested and available
        if (includeTeacherId && slot.teacherId) {
          schedule.teacherId = slot.teacherId;
        }

        return schedule;
      } catch (error) {
        console.error('convertSlotsToSchedules: Error processing slot', slot, error);
        return null;
      }
    })
    .filter(Boolean); // Remove any null entries from errors
};