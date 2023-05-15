import { Timestamp } from "firebase/firestore";

export const formatDateTime = timeToFormat => {
  const firebaseTimestamp = new Timestamp(
    timeToFormat.seconds,
    timeToFormat.nanoseconds
  );

  const date = firebaseTimestamp.toDate();

  const formattedDate = date.toLocaleDateString("hr-HR");
  const formattedTime = date.toLocaleTimeString("hr-HR");

  return `${formattedDate} - ${formattedTime}`;
};
