import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getToys, getToyById, addToy, updateToy, removeToy, addToyMsg, removeToyMsg } from './toy.controller.js'

export const toyRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

toyRoutes.get('/', log, getToys)
toyRoutes.get('/:id', getToyById)

// --- ONLY ADMIN CAN ADD/EDIT/DELETE TOYS (AUTH) ---
toyRoutes.post('/', requireAdmin, addToy)
toyRoutes.put('/:id', requireAdmin, updateToy)
toyRoutes.delete('/:id', requireAdmin, removeToy)

// --- MSG AUTH ---
toyRoutes.post('/:id/msg', requireAuth, addToyMsg)
toyRoutes.delete('/:id/msg/:msgId', requireAuth, removeToyMsg)


// --- EVERY USER CAN ADD/EDIT/DELETE TOYS (NO AUTH)---
// router.delete('/:id', requireAuth, requireAdmin, removeToy)
// toyRoutes.post('/', addToy)
// toyRoutes.put('/:id', updateToy)
// toyRoutes.delete('/:id', removeToy)