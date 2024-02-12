import User from "../models/users";
import { Request, Response } from "express";
import { ERROR_CODE_DEFAULT, ERROR_CODE_NOT_FOUND, ERROR_CODE_BAD_REQUEST } from '../utils/constants'

export const getUsers = async (req: Request, res: Response) => {
    return User.find({})
        .then(user => res.send({data: user}))
        .catch((err) => res.status(ERROR_CODE_BAD_REQUEST).send({message: 'Данные не верны'}))
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

export const postUser = async (req: Request, res: Response) => {
    const { name, about, avatar } = req.body
    return User.create({name, about, avatar})
        .then((user) => res.send({data: user}))
        .catch(err => {
          if(err.name === 'InternalServerError') return res.status(ERROR_CODE_DEFAULT).send({message: 'С сервером что-то не так'})
          else return res.status(ERROR_CODE_BAD_REQUEST).send({message: 'Данные не валидны'})
        })
}

export const patchUser = async (req: Request, res: Response) => {
  const { name, about } = req.body
  const id = req.user?.id

  return User.findByIdAndUpdate(id, { name, about })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if(err.name === 'InternalServerError') return res.status(ERROR_CODE_DEFAULT).send({message: 'С сервером что-то не так'})
      else if(err.name === 'ValidationError') return res.status(ERROR_CODE_BAD_REQUEST).send({message: 'Данные не валидны'})
      else return res.status(ERROR_CODE_NOT_FOUND).send({message: 'Пользователь не найден'})
    })

}

export const patchUserAvatar = async (req: Request, res: Response) => {
  const { avatar } = req.body
  const id = req.user?.id

  return User.findByIdAndUpdate(id, { avatar })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if(err.name === 'InternalServerError') return res.status(ERROR_CODE_DEFAULT).send({message: 'С сервером что-то не так'})
      else if(err.name === 'ValidationError') return res.status(ERROR_CODE_BAD_REQUEST).send({message: 'Данные не валидны'})
      else return res.status(ERROR_CODE_NOT_FOUND).send({message: 'Пользователь не найден'})
    });
}



