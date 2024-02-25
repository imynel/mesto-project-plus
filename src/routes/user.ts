import { Router } from "express";
import { getUsers, getUserId, patchUser, patchUserAvatar, getUserMe } from '../controllers/user'
import { celebrate , Joi } from "celebrate"
import { urlValidator } from "../utils/constants";


const router = Router()

router.get('/', getUsers)
router.get('/me', getUserMe)
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required()
  })
}), getUserId)

router.patch('/me', celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30).required(),
        about: Joi.string().min(2).max(200).required(),
    })
}), patchUser)

router.patch('/me/avatar', celebrate({
    body: Joi.object().keys({
        avatart: Joi.string().custom(urlValidator).required(),
    })
}), patchUserAvatar)

export default router