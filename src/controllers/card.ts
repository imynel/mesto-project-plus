import { Request, Response } from "express";
import Card from '../models/cards'

export const getCards = async (req: Request, res: Response) => {
    return Card.find({})
        .then(card => res.send({data: card}))
        .catch(() => res.status(500).send({message: 'Произошла ошибка'}))
}

export const postCard = async (req: Request, res: Response) => {
    const { name, link } = req.body
    return Card.create({ name, link })
        .then(card => res.send({data: card}))
        .catch(() => res.status(500).send({message: 'Произошла ошибка'}))
}

export const deleteCard = async (req: Request, res: Response) => {
    const { id } = req.params
    return Card.findByIdAndRemove(id)
        .then(card => res.send({data: card}))
        .catch(() => res.status(500).send({message: 'Произошла ошибка'}))
}
