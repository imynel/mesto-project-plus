import User from "../models/users";
import { Request, Response } from "express";

export const getUsers = async (req: Request, res: Response) => {
    return User.find({})
        .then(user => res.send({data: user}))
        .catch(() => res.status(500).send({message: 'Произошла ошибка'}))
}

export const getUserId = async (req: Request, res: Response) => {
    const { id } = req.params
    return User.findById(id)
        .then(user => res.send({data: user}))
        .catch(() => res.status(500).send({message: 'Произошла ошибка'}))
}

export const postUser = async (req: Request, res: Response) => {
    console.log(req.body)
    const { name, about, avatar } = req.body
    return User.create({name: name, about: about, avatar: avatar})
        .then((user) => res.send({data: user}))
        .catch(() => res.status(500).send({ message: 'Произошла ошибка' }))
}



