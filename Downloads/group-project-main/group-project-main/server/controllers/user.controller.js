import User from '../models/user.model.js'
import extend from 'lodash/extend.js'
import errorHandler from './error.controller.js'

// Controller function to create a new user
const create = async (req, res) => {
    const user = new User(req.body)
    try {
        // Try to save the user to the database
        await user.save()
        return res.status(200).json({
            message: "Successfully signed up!"
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
// Controller function to list all users
const list = async (req, res) => {
    try {
        // Find all users and select specific fields
        let users = await User.find().select('name email updated created')
        res.json(users)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
// Controller function to find a user by ID
const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id)
        if (!user)
            return res.status('400').json({
                error: "User not found"
            })
        // Attach user to request object
        req.profile = user
        // Proceed to next middleware
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve user"
        })
    }
}
const read = (req, res) => {
    // Set hashed_password to undefined to prevent it from being sent in the response
    req.profile.hashed_password = undefined
    // Set salt to undefined to prevent it from being sent in the response
    req.profile.salt = undefined
    return res.json(req.profile)
}
const update = async (req, res) => {
    try {
        // Retrieve the user object from the (userByID)request profile
        let user = req.profile
        // Extend the user object with the new data from the request body
        user = extend(user, req.body)
        // Update the `updated` timestamp to the current time
        user.updated = Date.now()
        // Save the updated user object to the database
        await user.save()
        // Remove sensitive information before sending the response
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
const remove = async (req, res) => {
    try {
        // Retrieve the user object from the request profile
        let user = req.profile
        // Delete the user from the database
        let deletedUser = await user.deleteOne()
        // Remove sensitive information from the deleted user object before sending the response
        deletedUser.hashed_password = undefined
        deletedUser.salt = undefined
        res.json(deletedUser)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
export default { create, userByID, read, list, remove, update }
