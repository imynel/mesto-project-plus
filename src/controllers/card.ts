import { Request, Response } from "express";
import Card from '../models/cards'
import { ERROR_CODE_BAD_REQUEST, ERROR_CODE_DEFAULT, ERROR_CODE_NOT_FOUND } from "../utils/constants"

export const getCards = async (req: Request, res: Response) => {
    return Card.find({})
        .then(card => res.send({data: card}))
        .catch(() => res.status(ERROR_CODE_BAD_REQUEST).send({message: 'Данные не верны'}))
}

export const postCard = async (req: Request, res: Response) => {
    const id = req.user?.id;
    const { name, link } = req.body
    return Card.create({ name, link, owner: id })
        .then(card => res.send({data: card}))
        .catch(err => {
          if(err.name === 'InternalServerError') return res.status(ERROR_CODE_DEFAULT).send({message: 'С сервером что-то не так'})
          else if(err.name === 'ValidationError') return res.status(ERROR_CODE_BAD_REQUEST).send({message: 'Данные не валидны'})
          else return res.status(ERROR_CODE_NOT_FOUND).send({message: 'Пользователь не найден'})
        })
}

export const deleteCard = async (req: Request, res: Response) => {
    const { cardId } = req.params
    return Card.findByIdAndRemove(cardId)
        .then(card => res.send({data: card}))
        .catch(err => {
          if(err.name === 'InternalServerError') return res.status(ERROR_CODE_DEFAULT).send({message: 'С сервером что-то не так'})
          else return res.status(ERROR_CODE_NOT_FOUND).send({message: 'Пользователь не найден'})
        })
}

export const putCardLike = async (req: Request, res: Response) => {
  const id = req.user?.id;
  const { cardId } = req.params
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: id } },
    { new: true },
    )
      .then(() => res.send({ message: "Вы поставили лайк"}))
      .catch(err => {
        if(err.name === 'InternalServerError') return res.status(ERROR_CODE_DEFAULT).send({message: 'С сервером что-то не так'})
        else return res.status(ERROR_CODE_NOT_FOUND).send({message: 'Пользователь не найден'})
      })
}

export const deleteCardLike = async (req: Request, res: Response) => {
  const id = req.user?.id;
  const { cardId } = req.params
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: id } },
    { new: true },
    )
      .then(() => res.send({ message: "Вы удалили лайк"}))
      .catch(err => {
        if(err.name === 'InternalServerError') return res.status(ERROR_CODE_DEFAULT).send({message: 'С сервером что-то не так'})
        else return res.status(ERROR_CODE_NOT_FOUND).send({message: 'Пользователь не найден'})
      })
}


