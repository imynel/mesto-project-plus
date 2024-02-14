import { deleteCard, deleteCardLike, getCards, postCard, putCardLike } from "../controllers/card";
import { Router } from "express";


const router = Router()

router.get('/',  getCards)
router.post('/',  postCard)
router.delete('/:cardId', deleteCard)
router.put('/:cardId/likes', putCardLike)
router.delete('/:cardId/likes', deleteCardLike)

export default router