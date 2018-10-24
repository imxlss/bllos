const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const mongoose = require('mongoose');
const koaBody = require('koa-body');
const koaBodyParser = require('koa-bodyparser');
const db = require('./db');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true}
});

const UserModel = mongoose.model('User', UserSchema);

const register = async ctx => {
    console.log()
    console.log(JSON.parse(ctx.request.body));
    const {name, password} = ctx.request.body;
    if (!name || !password) {
        console.log('用户名或密码不存在！');
        return ctx.body = {msg: 'error'};
    }
    const isExist = await UserModel.findOne({name});
    if (isExist) {
        console.log('账号已存在');
        return ctx.body = {mag: 'fail'};
    }
    const result = await UserModel.create({name, password});
    if (!result) {
        console.log('注册失败');
        return ctx.body = {status: 'fail'};
    } else {
        console.log('注册成功');
        return ctx.body = {status: 'success'};
    }
};

app.use(koaBody());
app.use(koaBodyParser());

router.all('/api/*', async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    ctx.set('Access-Control-Allow-Credentials', 'true');
    await next();
});

router.post('/api/register', register);

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);