export interface ZmanItem {
  label: string;
  time: Date;
}

export interface ZmanimData {
  location: string;
  date: string;
  zmanim: ZmanItem[];
}

export interface CountdownState {
  nextZman: ZmanItem | null;
  timeRemaining: string;
  isExpired: boolean;
}