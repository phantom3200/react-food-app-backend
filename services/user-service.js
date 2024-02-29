const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exeptions/api-error')

class UserService {
    async registration (email, password) {
        console.log(0)
        const candidate = await UserModel.findOne({email})
        console.log(1)
        if(candidate) {
            throw ApiError.BadRequest(`Пользователь с ${email} уже существует`)
        }
        console.log(2)
        const hashPassword = await bcrypt.hash(password, 3)
        console.log(3)
        const activationLink = uuid.v4()
        console.log(4)
        const user = await UserModel.create({email, password: hashPassword, activationLink})
        console.log(5)
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

        const userDto = new UserDto(user)
        console.log(6)
        const tokens = tokenService.generateTokens({...userDto})
        console.log(7)

        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        console.log(8)

        return {
            ...tokens,
            user: userDto
        }
    }

    async activate (activationLink) {
        const user = await UserModel.findOne({activationLink})
        if(!user) {
            throw ApiError.BadRequest('Неккоректная ссылка активации')
        }
        user.isActivated = true
        await user.save()
    }

    async login (email ,password) {
        const user = await UserModel.findOne({email})
        if(!user) {
            throw ApiError.BadRequest('Такого пользователя не существует')
        }
        const isPasswordsEqual = await bcrypt.compare(password, user.password)
        if(!isPasswordsEqual) {
            throw ApiError.BadRequest('Неверный пароль')
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = await tokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await tokenService.findToken(refreshToken)

        if(!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedError()
        }
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }

    async getAllUsers() {
        const users = await UserModel.find()
        return users
    }
}

module.exports = new UserService()
