//middleware/checkRoleMiddleware.js
const tokenService = require("../service/tokenService");
const ApiError = require("../error/ApiError");

module.exports = function (role) {
    return function (req, res, next) {
        try {
            const authorizationHeader = req.headers.authorization
            if (!authorizationHeader) {
                return next(ApiError.unauthorizedError())
            }
            const accessToken = authorizationHeader.split(' ')[1] // Bearer
            if (!accessToken) {
                return next(ApiError.unauthorizedError())
            }
            const decoded = tokenService.validateAccessToken(accessToken)
            if (!role.includes(decoded.role)) {
                return res.status(403).json({ message: "Нет доступа" });
            }
            req.user = decoded
            next()
        } catch (e) {
            console.log(e)
        }
    }
}
