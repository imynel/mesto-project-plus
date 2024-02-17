import { Router } from "express";
import { getUsers, getUserId, patchUser, patchUserAvatar, getUserMe } from '../controllers/user'
import { celebrate , Joi } from "celebrate"

const router = Router()

router.get('/', getUsers)
router.get('/me', getUserMe)
router.get('/:userId', getUserId)

router.patch('/me', celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(200),
    })
}), patchUser)

router.patch('/me/avatar', celebrate({
    body: Joi.object().keys({
        avatart: Joi.string().uri(),
    })
}), patchUserAvatar)

export default router