const md5 = require('md5');
const AdminModel = require('../models/admin.model');

class AdminController {
    static createAdmin(ctx) {
        const {
            username,
            password
        } = ctx.request.body;
    }
}

module.exports = AdminController;