import { Socket } from "socket.io";
export interface ISocketInterface extends Socket{
  userId?: number;
}
