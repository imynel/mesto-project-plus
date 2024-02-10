import { deleteCard, getCards, postCard } from "../controllers/card";
import { Router } from "express";


const router = Router()

router.get('/cards',  getCards)
router.post('/cards',  postCard)
router.delete('/cards/:cardId', deleteCard)

export default router