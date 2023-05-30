import { Timestamp } from "firebase/firestore";

export const formatDateTime = timeToFormat => {
  const firebaseTimestamp = new Timestamp(
    timeToFormat.seconds,
    timeToFormat.nanoseconds
  );

  const date = firebaseTimestamp.toDate();

  const formattedDate = date.toLocaleDateString("hr-HR");
  const formattedTime = date.toLocaleTimeString("hr-HR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate} - ${formattedTime}`;
};
