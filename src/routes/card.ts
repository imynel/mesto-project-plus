import { Joi, celebrate } from "celebrate";
import { deleteCard, deleteCardLike, getCards, postCard, putCardLike } from "../controllers/card";
import { Router } from "express";


const router = Router()

router.get('/',  getCards)

router.post('/', celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30).required(),
        link: Joi.string().required().uri(),
    })
}), postCard)

router.delete('/:cardId', celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().required()
    })
}), deleteCard)

router.put('/:cardId/likes', celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().required()
    })
}), putCardLike)

router.delete('/:cardId/likes', celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().required()
    })
}), deleteCardLike)

export default router