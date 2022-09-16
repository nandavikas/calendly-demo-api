const addMinutesToTimestamp = (timestamp, minutes) => {
  const endTime = new Date(timestamp)
  endTime.setTime(timestamp.getTime() + minutes * 60 * 1000);
  return endTime;
};

module.exports = {
  addMinutesToTimestamp,
};
