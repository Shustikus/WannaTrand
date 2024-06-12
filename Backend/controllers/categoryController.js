//controllers/categoryController.js
const {Category} = require('../models/index')
const ApiError = require('../error/ApiError')

class CategoryController {
    async create(req, res) {
        const {name} = req.body
        const category = await Category.create({name})
        return res.json(category)
    }

    async getAll(req, res) {
        const categories = await Category.findAll()
        return res.json(categories)
    }

    async getSub(req, res) {
        const {parent_id} = req.params;
        const subcategories = await Category.findAll({
            where: {parent_id: parent_id}
        });
        return res.json(subcategories);
    }

    async getOne(req, res) {
        const nameEn = req.params.name_en; // Получаем name_en категории из параметров запроса
        // Извлекаем категорию из базы данных по имени на английском
        const category = await Category.findOne({
            where: {name_en: nameEn}
        });
        // Возвращаем найденную категорию в ответе
        return res.json(category);
    }

    async getParentAndChildren(req, res) {
        const childCategoryId = req.params.id;
        const childCategory = await Category.findByPk(childCategoryId);
        if (!childCategory) {
            return res.status(404).json({error: 'Дочерняя категория не найдена'});
        }
        const parentId = childCategory.parent_id;
        const parentCategoryId = parentId ? parentId : childCategoryId; // проверяем parent_id, и если он равен null, то используем id дочерней категории
        const parentCategory = await Category.findByPk(parentCategoryId);
        if (!parentCategory) {
            return res.status(404).json({error: 'Родительская категория не найдена'});
        }
        const subcategories = await Category.findAll({
            where: {parent_id: parentCategoryId}
        });
        let data = {parent: parentCategory};
        if (parentId) {
            data.child = childCategory;
        }
        data.subcategories = subcategories;
        res.json(data);
    }

    async convertNameEnToId(req, res) {
        const nameEn = req.params.name_en; // Получаем name_en из параметров запроса
        // Ищем категорию по name_en
        const category = await Category.findOne({
            where: {name_en: nameEn},
        });
        if (!category) {
            return res.status(404).json({error: 'Категория не найдена'});
        }
        // Возвращаем id найденной категории
        res.json({id: category.id});
    }

}

module.exports = new CategoryController()