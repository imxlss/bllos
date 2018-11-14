const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const mongoose = require('mongoose');
const koaBody = require('koa-body');
const bodyParser = require('koa-bodyparser');
const md5 = require('md5');
const session = require('koa-session');
const db = require('./db');
const Schema = mongoose.Schema;

app.keys = ['bllo:secret'];
const CONFIG = {
    key: 'bllo',
    maxAge: 1000 * 60 * 5, // 有效期
    overwrite: true,
    signed: true,
};

/* -----------------model------------------ */
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
    /*     createdAt: {
            type: Date,
            default: Date.now
        },
        updateAt: {
            type: Date,
            default: Date.now
        } */
}, {
    timestamps: true
});

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    text_link: {
        type: String
    },
    tag: [{
        type: String
    }],
    summary: {
        type: String
    },
    // comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
    review: {
        type: Number,
        default: 0
    },
    isOriginal: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});

const UserModel = mongoose.model('User', UserSchema);
const ArticleModel = mongoose.model('Article', ArticleSchema);


/* -----------------router------------------ */
// 注册
const register = async ctx => {
    // ctx.request.body 是一个json字符串
    const {
        username,
        password,
        createdAt,
        updateAt
    } = JSON.parse(
        ctx.request.body
    );
    if (!username || !password) {
        console.log('用户名或密码不存在！');
        return (ctx.body = {
            msg: 'error'
        });
    }
    const isExist = await UserModel.findOne({
        username
    });
    if (isExist) {
        return (ctx.body = {
            status: 'fail',
            msg: '账号已存在'
        });
    }
    const result = await UserModel.create({
        username,
        password: md5(password),
        createdAt,
        updateAt
    });
    if (!result) {
        console.log('注册失败');
        return (ctx.body = {
            status: 'fail',
            msg: '注册失败'
        });
    } else {
        console.log('注册成功');
        return (ctx.body = {
            status: 'success',
            msg: '注册成功'
        });
    }
};
// 登录
const signin = async ctx => {
    const {
        username,
        password
    } = JSON.parse(ctx.request.body);
    if (!username || !password) {
        return (ctx.body = {
            status: 'fail',
            msg: '请输入账号和密码'
        });
    }
    const data = await UserModel.findOne({
        username,
        password: md5(password)
    }, {
        password: 0
    });
    if (!data)
        return (ctx.body = {
            status: 'fail',
            msg: '用户名或密码错误'
        });
    ctx.session.user = data;
    console.log('-----------------');
    console.log(ctx.session);
    const id = data._id;
    const max_age = 1000 * 60 * 10;

    ctx.cookies.set('userid', id, {
        maxAge: max_age,
        httpOnly: false
    });
    ctx.cookies.set('username', username, {
        maxAge: max_age,
        httpOnly: false
    });

    ctx.body = {
        msg: '登录成功',
        data
    };
};
// 退出
const signout = async ctx => {
    console.log(ctx.cookies.get('userid'));

    ctx.session.user = null;
    ctx.cookies.set('userid', null, {
        maxAge: 0
    });
    ctx.cookies.set('username', null, {
        maxAge: 0
    });
    return (ctx.body = {
        status: 'success',
        msg: '退出成功'
    });
};

const createArticle = async ctx => {
    const user = ctx.session.user;

    if (!user) return (ctx.body = {
        status: 'fail',
        msg: '请先进行登陆'
    });

    const {
        name,
        _id
    } = user;
    const data = JSON.parse(ctx.request.body);

    if (!data) return (ctx.body = {
        status: 'fail',
        msg: '数据发送失败'
    });
}

/* -----------------一些中间件------------------ */
app.use(session(CONFIG, app));

app.use(koaBody());
app.use(bodyParser());

// cors 解决跨域
router.all('/api/*', async (ctx, next) => {
    // ctx.set('Access-Control-Allow-Origin', 'http://www.xlss.link');
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:8000');
    ctx.set('Access-Control-Allow-Credentials', 'true');
    await next();
});

router
    .post('/api/register', register)
    .post('/api/signin', signin)
    .get('/api/signout', signout);

app.use(router.routes()).use(router.allowedMethods());

app.listen(8080, () => {
    console.log('listening to port 8080...');
});
// 引入并使用koa-bodyparser中间件 然后就可以直接在ctx.request.body 中获取到JSON格式的POST数据了。