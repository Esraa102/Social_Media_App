import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString: string): string {
  const currentDate: Date = new Date();
  const postDate: Date = new Date(dateString);

  const timeDifference: number = currentDate.getTime() - postDate.getTime();
  const seconds: number = Math.floor(timeDifference / 1000);
  const minutes: number = Math.floor(seconds / 60);
  const hours: number = Math.floor(minutes / 60);
  const days: number = Math.floor(hours / 24);
  const weeks: number = Math.floor(days / 7);
  const months: number = Math.floor(days / 30);
  const years: number = Math.floor(days / 365);

  if (seconds < 60) {
    return seconds === 1 ? "a second ago" : `${-seconds} seconds ago`;
  } else if (minutes < 60) {
    return minutes === 1 ? "a minute ago" : `${minutes} minutes ago`;
  } else if (hours < 24) {
    return hours === 1 ? "an hour ago" : `${hours} hours ago`;
  } else if (days < 30) {
    return days === 1 ? "a day ago" : `${days} days ago`;
  } else if (days < 7) {
    return days === 1 ? "a day ago" : `${days} days ago`;
  } else if (weeks < 4) {
    return weeks === 1 ? "a week ago" : `${weeks} weeks ago`;
  } else if (months < 12) {
    return months === 1 ? "a month ago" : `${months} months ago`;
  } else {
    return years === 1 ? "a year ago" : `${years} years ago`;
  }
}

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};
