import User from "../models/users";
import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcryptjs'
import { ERROR_CODE_DEFAULT, ERROR_CODE_NOT_FOUND, ERROR_CODE_BAD_REQUEST } from '../utils/constants'
import jwt from 'jsonwebtoken'
import { IUserRequest } from "../types/types";
import NotFoundError from "../utils/errors/notFoundError";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    return User.find({})
        .then(user => res.send({data: user}))
        .catch(next)
}

export const getUserId = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params
    return User.findById(userId)
        .then(user => {
          if(!user) throw new NotFoundError('Пользователя с таким ID не найден');
          res.send({ data: user })
        })
        .catch(next)

}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, about, avatar, email, password } = req.body
    return bcrypt.hash(password, 10)
        .then((hash: string) => User.create({name, about, avatar, email, password: hash})
            .then((user) => res.status(201).send({data: user}))
            .catch(err => {
              if (err.code === 11000) {
                next((new Error('Пользователь с таким email уже существует')));
              } else {
                next(err);
              }

            }))
}

export const patchUser = async (req: IUserRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body
  const _id = req.user?._id

  return User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then(user => {
      if(user) return res.send({ data: user })
      else throw new NotFoundError('Пользователя с таким ID не найден');
    })
    .catch(next)

}

export const patchUserAvatar = async (req: IUserRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body
  const _id = req.user?._id

  return User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then(user => {
      if(user) return res.send({ data: user })
      else throw new NotFoundError('Пользователя с таким ID не найден');
    })
    .catch(next);
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    return User.findUserByCredentials(email, password)
        .then((user) => {

            res.send({
                token:  jwt.sign({_id: user._id}, 'super-strong-secret', { expiresIn: '7d' })
            })
        })
        .catch((err) => {
            res.status(401).send({ message: err.message });
          });
}

export const getUserMe = async (req: IUserRequest, res: Response, next: NextFunction) => {
  const _id = req.user?._id
  return User.findOne({ _id })
    .then(user => res.send({data: user}))
    .catch(next)
}
