import User from "../models/users";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs'
import { ERROR_CODE_DEFAULT, ERROR_CODE_NOT_FOUND, ERROR_CODE_BAD_REQUEST } from '../utils/constants'
import jwt from 'jsonwebtoken'
import { IUserRequest } from "types/types";

export const getUsers = async (req: Request, res: Response) => {
    return User.find({})
        .then(user => res.send({data: user}))
        .catch(() => res.status(ERROR_CODE_BAD_REQUEST).send({message: 'Данные не верны'}))
}

export const getUserId = async (req: Request, res: Response) => {
    const { userId } = req.params
    return User.findById(userId)
        .then(user => res.send({data: user}))
        .catch((err) => {
          if(err.name === 'InternalServerError') return res.status(ERROR_CODE_DEFAULT).send({message: 'С сервером что-то не так'})
          else return res.status(ERROR_CODE_BAD_REQUEST).send({message: 'Пользователь не найден'})
        })

}

export const createUser = async (req: Request, res: Response) => {
    const { name, about, avatar, email, password } = req.body
    return bcrypt.hash(password, 10)
        .then((hash: string) => User.create({name, about, avatar, email, password: hash})
            .then((user) => res.status(201).send({data: user}))
            .catch(err => {
              if (err.name === 'ValidationError') return res.status(ERROR_CODE_BAD_REQUEST).send({message: 'Данные не валидны'})
              else return res.status(ERROR_CODE_DEFAULT).send({message: 'С сервером что-то не так'})
            }))
}

export const patchUser = async (req: IUserRequest, res: Response) => {
  const { name, about } = req.body
  const _id = req.user?._id

  return User.findByIdAndUpdate(_id, { name, about })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if(err.name === 'InternalServerError') return res.status(ERROR_CODE_DEFAULT).send({message: 'С сервером что-то не так'})
      else if(err.name === 'ValidationError') return res.status(ERROR_CODE_BAD_REQUEST).send({message: 'Данные не валидны'})
      else return res.status(ERROR_CODE_NOT_FOUND).send({message: 'Пользователь не найден'})
    })

}

export const patchUserAvatar = async (req: IUserRequest, res: Response) => {
  const { avatar } = req.body
  const _id = req.user?._id

  return User.findByIdAndUpdate(_id, { avatar })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if(err.name === 'InternalServerError') return res.status(ERROR_CODE_DEFAULT).send({message: 'С сервером что-то не так'})
      else if(err.name === 'ValidationError') return res.status(ERROR_CODE_BAD_REQUEST).send({message: 'Данные не валидны'})
      else return res.status(ERROR_CODE_NOT_FOUND).send({message: 'Пользователь не найден'})
    });
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

export const getUserMe = async (req: IUserRequest, res: Response) => {
  const _id = req.user?._id
  return User.findOne({ _id })
    .then(user => res.send({data: user}))
    .catch(() => res.status(ERROR_CODE_BAD_REQUEST).send({message: 'Данные не верны'}))
}
