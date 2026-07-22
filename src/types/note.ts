export type Note = {
  id: string;
  to: string;
  from: string;
  message: string;
  color: string;
  rotate: number;
  x: number;
  y: number;
  pinColor: string;
  tag?: string;
  createdAt?: unknown;
};
