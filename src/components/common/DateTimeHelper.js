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
  console.log("sourceDate");
  console.log(sourceDate);
  const month = sourceDate.getMonth();
  const date = sourceDate.getDate();

  let monthText = "";
  switch (month) {
    case 0:
      monthText = "января";
      break;
    case 1:
      monthText = "февраля";
      break;
    case 2:
      monthText = "марта";
      break;
    case 3:
      monthText = "апреля";
      break;
    case 4:
      monthText = "мая";
      break;
    case 5:
      monthText = "июня";
      break;
    case 6:
      monthText = "июля";
      break;
    case 7:
      monthText = "августа";
      break;
    case 8:
      monthText = "сентября";
      break;
    case 9:
      monthText = "октября";
      break;
    case 10:
      monthText = "ноября";
      break;
    case 11:
      monthText = "декабря";
      break;
  }

  return `${date} ${monthText}`;
}

export function formatDateDot(sourceDate) {
  const month = sourceDate.getMonth();
  const date = sourceDate.getDate();

  return `${date}.${month + 1}.${sourceDate.getYear()}`;
}

export function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  // If the birth month hasn't occurred yet, or it's the birth month but the day hasn't occurred, subtract 1 from the age
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export function getWeekDayNameLong(date) {
  return new Intl.DateTimeFormat("ru-RU", { weekday: "long" }).format(date);
}

export function calculateDateFromAge(age) {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    // Calculate
    const birthYear = currentYear - age;
    const birthDate = new Date(birthYear, today.getMonth(), today.getDate());
    
    return birthDate;
}
