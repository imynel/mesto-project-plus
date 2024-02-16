import { Request, Response } from "express";
import Card from '../models/cards'
import { ERROR_CODE_BAD_REQUEST, ERROR_CODE_DEFAULT, ERROR_CODE_NOT_FOUND } from "../utils/constants"
import { IUserRequest } from "types/types";

export const getCards = async (req: Request, res: Response) => {
    return Card.find({})
        .then(card => res.send({data: card}))
        .catch(() => res.status(ERROR_CODE_BAD_REQUEST).send({message: 'Данные не верны'}))
}

export const postCard = async (req: IUserRequest, res: Response) => {
    const _id = req.user?._id;
    const { name, link } = req.body
    return Card.create({ name, link, owner: _id })
        .then(card => {
          if(card) return res.status(201).send({data: card})
          else return res.status(ERROR_CODE_NOT_FOUND).send({message: 'Карточка не найдена'})
        })
        .catch(err => {
          if(err.name === 'ValidationError') return res.status(ERROR_CODE_BAD_REQUEST).send({message: 'Данные не валидны'})
          else if(err.name === 'CastError')  res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Передан некорректный _id' });
          else return res.status(ERROR_CODE_DEFAULT).send({message: 'С сервером что-то не так'})
        })
}

export const deleteCard = async (req: Request, res: Response) => {
    const { cardId } = req.params
    return Card.findByIdAndRemove(cardId)
        .then(card => {
          if(card) return res.send({data: card})
          else return res.status(ERROR_CODE_NOT_FOUND).send({message: 'Карточка не найдена'})
        })
        .catch(err => {
          if(err.name === 'CastError')  res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Передан некорректный _id' });
          else return res.status(ERROR_CODE_DEFAULT).send({message: 'С сервером что-то не так'})
        })
}

export const putCardLike = async (req: IUserRequest, res: Response) => {
  const _id = req.user?._id;
  const { cardId } = req.params
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true },
    )
    .then(card => {
      if(card) return res.send({data: card})
      else return res.status(ERROR_CODE_NOT_FOUND).send({message: 'Карточка не найдена'})
    })
    .catch(err => {
      if(err.name === 'CastError')  res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Передан некорректный _id' });
      else return res.status(ERROR_CODE_DEFAULT).send({message: 'С сервером что-то не так'})
    })
}

export const deleteCardLike = async (req: IUserRequest, res: Response) => {
  const _id = req.user?._id;
  const { cardId } = req.params
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } },
    { new: true },
    )
    .then(card => {
      if(card) return res.send({data: card})
      else return res.status(ERROR_CODE_NOT_FOUND).send({message: 'Карточка не найдена'})
    })
    .catch(err => {
      if(err.name === 'CastError')  res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Передан некорректный _id' });
      else return res.status(ERROR_CODE_DEFAULT).send({message: 'С сервером что-то не так'})
    })
}


