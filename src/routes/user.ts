import { Router } from "express";
import { getUsers, getUserId, patchUser, patchUserAvatar, getUserMe } from '../controllers/user'


const router = Router()

router.get('/', getUsers)
router.get('/me', getUserMe)
router.get('/:userId', getUserId)
router.patch('/me', patchUser)
router.patch('/me/avatar', patchUserAvatar)

export default router