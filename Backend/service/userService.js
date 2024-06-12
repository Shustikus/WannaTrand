//service/userService.js
const {User, Brand} = require('../models/index')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')
const UserDto = require('../dto/userDto')
const ApiError = require('../error/ApiError')
const mailService = require('./mailService')
const tokenService = require('./tokenService')
const favouriteService = require("./favouriteService");
const cartService = require("./cartService");

class UserService {
    async registration(email, password, role) {
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            throw ApiError.badRequest(`Пользователь с таким ${email} уже существует `)
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const activationLink = uuid.v4(); //

        const user = await User.create({email, role, password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/activate/${activationLink}`)

        const userDto = new UserDto(user); // id, email, isActivated, role
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await User.findOne({where: {activationLink}}); // не отрабатывает
        if (!user) {
            throw ApiError.badRequest('Неккоректная ссылка активации')
        }
        user.isActivated = true;
        await user.save()
    }

    async login(email, password) {
        const user = await User.findOne({where: {email}})
        if (!user) {
            throw ApiError.badRequest('Пользователь с таким email не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.badRequest('Неверный пароль')
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.unauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDb) {
            throw ApiError.unauthorizedError()
        }
        const user = await User.findByPk(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async getUserInfo(refreshToken) {
        const token = await tokenService.findToken(refreshToken);
        if (!token) {
            throw ApiError.unauthorizedError();
        }

        // Получаем информацию о пользователе
        const user = await User.findOne({
            where: {id: token.user_id},
            attributes: ['id', 'email', 'role', 'phone', 'firstname', 'lastname', 'middlename', 'birthday'],
        });

        // Получаем информацию о бренде
        const brand = await Brand.findOne({
            where: {user_id: token.user_id}, // Предположим, что в таблице Brand есть поле user_id
            attributes: ['id'],
        });
        // Добавляем информацию о бренде к объекту пользователя
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            phone: user.phone,
            firstname: user.firstname,
            lastname: user.lastname,
            middlename: user.middlename,
            birthday: user.birthday,
            brand: brand || null,
        };
    }

    async updateUserInfo(refreshToken, newUserInfo) {
        const token = await tokenService.findToken(refreshToken)
        if (!token) {
            throw ApiError.unauthorizedError() // Обработка случая, когда нет записи с указанным refreshToken
        }
        const user = await User.findOne({
            where: {id: token.user_id}, // Ищем пользователя по user_id из токена
            attributes: ['id', 'email', 'phone', 'firstname', 'lastname', 'middlename', 'birthday']
        });
        if (!user) {
            throw ApiError.unauthorizedError()
        }
        if (newUserInfo.phone) {
            user.phone = newUserInfo.phone;
        }
        if (newUserInfo.firstname) {
            user.firstname = newUserInfo.firstname;
        }
        if (newUserInfo.lastname) {
            user.lastname = newUserInfo.lastname;
        }
        if (newUserInfo.middlename) {
            user.middlename = newUserInfo.middlename;
        }
        if (newUserInfo.birthday) {
            user.birthday = newUserInfo.birthday;
        }
        // Сохраняем изменения в базе данных
        await user.save();
        return user;
    }

    async deleteAccount(refreshToken) {
        const token = await tokenService.findToken(refreshToken)
        if (!token) {
            throw ApiError.unauthorizedError() // Обработка случая, когда нет записи с указанным refreshToken
        }
        const userId = token.user_id;
        // Добавить удаление корзины
        await cartService.clearCart(refreshToken)
        // Удаляем избранные
        await favouriteService.deleteAllFavouriteProducts(refreshToken);
        // Удаляем токен
        await tokenService.removeToken(refreshToken)
        // Затем удаляем пользователя
        await User.destroy({where: {id: userId}});
        return true; // Возвращаем успешный результат удаления
    }

    async changePassword(password, newPassword, refreshToken) {
        const token = await tokenService.findToken(refreshToken)
        if (!token) {
            throw ApiError.unauthorizedError() // Обработка случая, когда нет записи с указанным refreshToken
        }
        const user = await User.findOne({where: {id: token.user_id}});
        if (!user) {
            throw ApiError.badRequest('Пользователь с таким email не найден')
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw ApiError.badRequest('Текущий пароль недействителен');
        }

        // Хэшируйте новый пароль
        const NewPassword = await bcrypt.hash(newPassword, 5);

        // Обновите пароль пользователя
        user.password = NewPassword;
        await user.save();
        return {success: true, message: 'Пароль успешно изменен'};
    }

    async acceptBrand(userId) {
        const user = await User.findByPk(userId)
        if (!user) {
            throw ApiError.internal(`Пользователь с id ${userId} не найден`);
        }
        user.isActivated = !user.isActivated;
        await user.save();
        return {success: true, message: `Статус активации пользователя ${userId} успешно обновлен`};
    }
}

module.exports = new UserService()