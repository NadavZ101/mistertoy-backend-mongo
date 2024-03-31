import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export const toyService = {
    remove,
    query,
    getById,
    add,
    update,
    addToyMsg,
    removeToyMsg
}

async function query(filterBy = { txt: '', inStock: '' }, sortBy = {}) {
    // const { name, price, createdAt } = sortBy

    // console.log("🚀 ~ service-query ~ filterBy:", filterBy)
    // console.log("🚀 ~ service-query ~ sortBy:", sortBy)

    try {


        const filterCriteria = {
            name: { $regex: filterBy.txt, $options: 'i' },

            inStock: filterBy.inStock !== '' ? (filterBy.inStock === 'true') : { $ne: 'false' },
        }

        // console.log("🚀 ~ service-query inside try ~ sortBy:", sortBy)
        if (sortBy) {
            const dir = sortBy.asc ? 1 : -1;

        } else {
            sortBy = {}
        }


        const collection = await dbService.getCollection('toy')

        var toys = await collection.find(filterCriteria).sort(sortBy).toArray()
        return toys

    } catch (err) {
        logger.error('cannot find toys', err)
        throw err
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        var toy = collection.findOne({ _id: ObjectId(toyId) })
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: ObjectId(toyId) })
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}

async function add(toy) {
    console.log("🚀 ~ add ~ toy:", toy)

    try {
        const collection = await dbService.getCollection('toy')
        await collection.insertOne(toy)
        return toy
    } catch (err) {
        logger.error('cannot insert toy', err)
        throw err
    }
}

async function update(toy) {
    console.log("🚀 ~ update ~ toy:", toy)

    try {
        const toyToUpdate = {
            name: toy.name,
            price: toy.price,
            inStock: toy.inStock,
            labels: toy.labels
        }
        console.log("🚀 ~ update ~ toyToSave:", toyToUpdate)


        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId(toy._id) }, { $set: toyToUpdate })
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${toyId}`, err)
        throw err
    }
}

async function addToyMsg(toyId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId(toyId) }, { $push: { msgs: msg } })
        console.log("🚀 ~ addToyMsg ~ msg:", msg)

        return msg
    } catch (err) {
        logger.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}

async function removeToyMsg(toyId, msgId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId(toyId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}

