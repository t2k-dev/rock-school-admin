export function formatTime(date) {
  // Get hours and minutes
  const hours = date.getHours(); // Returns the hour (0-23)
  const minutes = date.getMinutes(); // Returns the minutes (0-59)

  // Ensure hours and minutes are 2 digits
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  // Combine into 'hh:mm' format
  return `${formattedHours}:${formattedMinutes}`;
}

export function formatDate(sourceDate) {
  const month = sourceDate.getMonth();
  const date = sourceDate.getDate();

  let monthText = "";
  switch (month) {
    case 0:
      monthText = "января";
    case 1:
      monthText = "февраля";
    case 2:
      monthText = "марта";
    case 3:
      monthText = "апреля";
    case 4:
      monthText = "мая";
    case 5:
      monthText = "июня";
    case 6:
      monthText = "июля";
    case 7:
      monthText = "августа";
    case 8:
      monthText = "сентября";
    case 9:
      monthText = "октября";
    case 10:
      monthText = "ноября";
    case 11:
      monthText = "декабря";
  }

  return `${date} ${monthText}`;
}

export function formatDateDot(sourceDate) {
  const month = sourceDate.getMonth();
  const date = sourceDate.getDate();

  return `${date}.${month+1}.${sourceDate.getYear()}`;
}
