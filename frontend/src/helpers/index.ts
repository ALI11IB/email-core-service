export const getDayAndMonth = (isoString: string) => {
  const date = new Date(isoString);
  const day = date.getUTCDate();
  const monthIndex = date.getUTCMonth();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[monthIndex];
  return day + " " + monthName;
};
