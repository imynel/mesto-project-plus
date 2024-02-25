import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUserRequest } from "types/types";
import UnauthorizedError from "../utils/errors/unauthorizedError";

interface MyJwtPayload extends JwtPayload {
    _id: string;
}

export default (req: IUserRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers

    if (!authorization || !authorization.startsWith('Bearer ')) throw new UnauthorizedError('Необходима авторизация');

    const token = authorization.replace('Bearer ', '')

    let payload;

    try {
        payload = jwt.verify(token, 'super-strong-secret') as MyJwtPayload
    } catch (err) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    req.user = payload

    next()
}
