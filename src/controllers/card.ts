import { NextFunction, Request, Response } from "express";
import Card from '../models/cards'
import { ERROR_CODE_BAD_REQUEST, ERROR_CODE_DEFAULT, ERROR_CODE_NOT_FOUND } from "../utils/constants"
import { IUserRequest } from "types/types";
import NotFoundError from "../utils/errors/notFoundError";

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
    return Card.find({})
        .then(card => res.send({data: card}))
        .catch(next)
}

export const postCard = async (req: IUserRequest, res: Response, next: NextFunction) => {
    const _id = req.user?._id;
    const { name, link } = req.body
    return Card.create({ name, link, owner: _id })
        .then(card => {
          if(card) return res.status(201).send({data: card})
          else return res.status(ERROR_CODE_NOT_FOUND).send({message: 'Карточка не найдена'})
        })
        .catch(next)
}

export const deleteCard = async (req: IUserRequest, res: Response, next: NextFunction) => {
    const { cardId } = req.params
    const owner = req.user?._id;
    return Card.findById(cardId)
        .then((card) => {
          if(!card) return res.status(ERROR_CODE_NOT_FOUND).send({message: 'Карточка не найдена'})

          if (card.owner.toString() === owner) {
            return Card.deleteOne(card._id)
              .then(() => res.send({message: "Карточка удалена"}))
          } else return res.status(ERROR_CODE_NOT_FOUND).send({message: 'Вы можете удалять только свои карточки'});
        })
        .catch(next)
}

export const putCardLike = async (req: IUserRequest, res: Response, next: NextFunction) => {
  const _id = req.user?._id;
  const { cardId } = req.params
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true },
    )
    .then(card => {
      if(card) return res.send({data: card})
      else throw new NotFoundError('Карточка не найдена')
    })
    .catch(next)
}

export const deleteCardLike = async (req: IUserRequest, res: Response, next: NextFunction) => {
  const _id = req.user?._id;
  const { cardId } = req.params
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } },
    { new: true },
    )
    .then(card => {
      if(card) return res.send({data: card})
      else throw new NotFoundError('Карточка не найдена')
    })
    .catch(next)
}


