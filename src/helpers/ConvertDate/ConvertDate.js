import { format, fromUnixTime, isToday, formatDistanceToNowStrict } from 'date-fns';

// convert firebase serverTimestamp to human readable format
const convertDate = (dateInSeconds) => {
  // convert serverTimestamp to date object
  function toDateTime(secs) {
    const t = new Date(0);
    t.setUTCSeconds(secs);
    return t;
  }
  // change return format depending on the post time
  if (isToday(toDateTime(dateInSeconds))) {
    return formatDistanceToNowStrict(toDateTime(dateInSeconds), {
      addSuffix: true
    });
  }
  return format(fromUnixTime(dateInSeconds), 'MMM dd');
};

export default convertDate;
