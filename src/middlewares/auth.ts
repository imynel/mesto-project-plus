import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface MyJwtPayload extends JwtPayload {
    id: string;
}

export default (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers

    if (!authorization || !authorization.startsWith('Bearer ')) return res.status(401).send({message: 'Необходима авторизация'})

    const token = authorization.replace('Bearer ', '')

    let payload;

    try {
        payload = jwt.verify(token, 'super-strong-secret') as MyJwtPayload
    } catch (err) {
        return res.status(401).send({ message: "Ошибка авторизации" })
    }

    req.user = payload

    next()
}
