const md5 = require('md5');
const AdminModel = require('../models/admin.model');

class AdminController {
  static async createAdmin(ctx) {
    const { username, password } = ctx.request.body;

    if (!username || !password) {
      return (ctx.body = {
        status: 'fail',
        msg: '用户名或密码不能为空'
      });
    }

    const isExist = AdminModel.findOne({ username });

    if (isExist) {
      return (ctx.body = {
        status: 'fail',
        msg: '账号已存在'
      });
    }

    const result = await AdminModel.create({
      username,
      password: md5(password)
    });

    if (!result) {
      return (ctx.body = {
        status: 'fail',
        msg: '注册成功'
      });
    }

    return (ctx.body = {
      status: 'success',
      msg: '注册失败'
    });
  }

  static async signin(ctx) {
    const { username, password } = ctx.request.body;
    if (!username || !password) {
      return (ctx.body = {
        status: 'fail',
        msg: '请输入用户名或密码'
      });
    }

    const data = AdminModel.findOne(
      {
        username,
        password: md5(password)
      },
      {
        password: 0
      }
    );

    if (!data) {
      return (ctx.body = {
        status: 'fail',
        msg: '用户名或密码错误'
      });
    }

    ctx.session.user = data;

    const id = data._id;
    const max_age = 1000 * 60 * 10;
    ctx.cookies.set('user_id', id, {
      maxAge: max_age,
      httpOnly: false
    });

    ctx.cookies.set('username', username, {
      maxAge: max_age,
      httpOnly: false
    });

    ctx.body = {
      status: 'success',
      msg: '登陆成功',
      data
    };
  }
}

module.exports = AdminController;
