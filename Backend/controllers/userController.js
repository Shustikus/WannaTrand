//controllers/userController.js
const ApiError = require('../error/ApiError')
const userService = require('../service/userService')
const {validationResult} = require('express-validator')

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()))
            }
            const {email, password, role} = req.body
            const userData = await userService.registration(email, password, role)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                secure: true,
                path: '/',
                sameSite: 'None',
            })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                secure: true,
                path: '/',
                sameSite: 'None',
            })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            if (!res.headersSent) {
                return res.redirect(process.env.CLIENT_URL) // не отрабатывает
            }
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                secure: true,
                path: '/',
                sameSite: 'None',
            })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async getUserInfo(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const user = await userService.getUserInfo(refreshToken); // Передаем refreshToken в функцию
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async updateUserInfo(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const newUserInfo = req.body;
            const updatedUser = await userService.updateUserInfo(refreshToken, newUserInfo);
            res.json(updatedUser);
        } catch (e) {
            next(e);
        }
    }

    async deleteAccount(req, res, next) {
        try {
            const {refreshToken} = req.cookies; // Получаем refreshToken из тела запроса
            const deleted = await userService.deleteAccount(refreshToken);
            res.clearCookie('refreshToken')
            if (deleted) {
                return res.status(200).json({message: 'Аккаунт успешно удален.'});
            } else {
                return res.status(404).json({message: 'Аккаунт не найден.'});
            }
        } catch (e) {
            next(e);
        }
    }

    async changePassword(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {password, newPassword} = req.body;
            const result = await userService.changePassword(password, newPassword, refreshToken);
            return res.json(result);
        } catch (e) {
            next(e)
        }
    }

    async acceptBrand(req, res, next) {
        try {
            const {userId} = req.body
            const result = await userService.acceptBrand(userId)
            return res.json(result)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()