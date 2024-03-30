import { toyService } from './toy.service.js'
import { logger } from '../../services/logger.service.js'

export async function getToys(req, res) {

    const { filterBy } = req.query.params
    const { sortBy } = req.query.params

    try {
        const filterCriteria = {
            txt: filterBy.txt || '',
            inStock: filterBy.inStock || '',
        }

        // console.log("🚀 ~ sortBy.asc type:", typeof sortBy.asc, ", value:", sortBy.asc);
        let dir = sortBy.asc === 'true' ? 1 : -1;
        let sortCriteria = {}
        if (sortBy.by) {

            sortCriteria = {
                [sortBy.by]: dir
            }
        }
        else {
            sortCriteria = {}
        }


        logger.debug('Getting Toys', filterCriteria, sortCriteria)

        const toys = await toyService.query(filterCriteria, sortCriteria)
        res.json(toys)
    } catch (err) {
        logger.error('Failed to get toys', err)
        res.status(500).send({ err: 'Failed to get toys' })
    }
}

export async function getToyById(req, res) {
    try {
        const toyId = req.params.id
        const toy = await toyService.getById(toyId)
        res.json(toy)
    } catch (err) {
        logger.error('Failed to get toy', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

export async function addToy(req, res) {
    console.log("🚀 ~ addToy ~ req.query:", req.query)
    const { loggedinUser } = req

    try {
        const toy = req.body
        toy.createdAt = new Date().getTime()
        const addedToy = await toyService.add(toy)
        res.json(addedToy)
    } catch (err) {
        logger.error('Failed to add toy', err)
        res.status(500).send({ err: 'Failed to add toy' })
    }
}

export async function updateToy(req, res) {
    console.log("🚀 ~ updateToy ~ req:", req.body)

    try {
        const toy = req.body
        console.log("🚀 ~ updateToy ~ toy:", toy)

        const updatedToy = await toyService.update(toy)
        res.json(updatedToy)
    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToy(req, res) {
    try {
        const toyId = req.params.id
        await toyService.remove(toyId)
        res.send()
    } catch (err) {
        logger.error('Failed to remove toy', err)
        res.status(500).send({ err: 'Failed to remove toy' })
    }
}

export async function addToyMsg(req, res) {
    const { loggedinUser } = req
    try {
        const toyId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: loggedinUser,
        }
        const savedMsg = await toyService.addToyMsg(toyId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToyMsg(req, res) {
    const { loggedinUser } = req
    try {
        const toyId = req.params.id
        const { msgId } = req.params

        const removedId = await toyService.removeToyMsg(toyId, msgId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove toy msg', err)
        res.status(500).send({ err: 'Failed to remove toy msg' })
    }
}