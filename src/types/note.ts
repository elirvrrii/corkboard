export type Note = {
  id: string | number;
  to: string;
  from: string;
  message: string;
  color: string;
  rotate: number;
  x: number;
  y: number;
  pinColor: string;
  ps?: string;
};
