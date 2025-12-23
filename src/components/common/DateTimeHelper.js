/**
 * DateTimeHelper utility for date and time operations
 */
class DateTimeHelper {
  /**
   * Get current date in YYYY-MM-DD format
   * @returns {string} Current date string
   */
  static getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Get current datetime in YYYY-MM-DDTHH:mm format
   * @returns {string} Current datetime string
   */
  static getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  /**
   * Format date to readable string
   * @param {string|Date} date - Date to format
   * @param {string} locale - Locale for formatting (default: 'ru-RU')
   * @returns {string} Formatted date string
   */
  static formatDate(date, locale = 'ru-RU') {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale);
  }

  /**
   * Format datetime to readable string
   * @param {string|Date} datetime - DateTime to format
   * @param {string} locale - Locale for formatting (default: 'ru-RU')
   * @returns {string} Formatted datetime string
   */
  static formatDateTime(datetime, locale = 'ru-RU') {
    const dateObj = typeof datetime === 'string' ? new Date(datetime) : datetime;
    return dateObj.toLocaleString(locale);
  }

  /**
   * Check if date is valid
   * @param {string|Date} date - Date to validate
   * @returns {boolean} True if valid date
   */
  static isValidDate(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj instanceof Date && !isNaN(dateObj);
  }

  /**
   * Get date string in YYYY-MM-DD format from Date object
   * @param {Date} date - Date object
   * @returns {string} Date string
   */
  static toDateString(date) {
    if (!this.isValidDate(date)) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

export default DateTimeHelper;