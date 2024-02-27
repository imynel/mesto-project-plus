import { ERROR_FORBIDDEN } from "../constants";

export default class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_FORBIDDEN;
  }
}