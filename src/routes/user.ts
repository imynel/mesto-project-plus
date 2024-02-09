import { Router } from "express";
import { getUsers, getUserId, postUsers} from '../controllers/user'


const router = Router()

router.get('/users', getUsers)
router.get('/users/:userId', getUserId)
router.post('/users', postUsers)

export default router