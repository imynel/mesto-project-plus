import { Router } from "express";
import { getUsers, getUserId, postUser} from '../controllers/user'


const router = Router()

router.get('/users', getUsers)
router.get('/users/:userId', getUserId)
router.post('/users', postUser)

export default router