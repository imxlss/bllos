const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const db = require('./models/db');
const router = require('./routers/router');

/* const axios = require('axios');

axios.get('xxx_url').then(res => {
  console.log(res);
}); */

app.keys = ['bllo:secret'];
const CONFIG = {
  key: 'bllo',
  maxAge: 1000 * 60 * 5, // 有效期
  overwrite: true,
  signed: true
};

/* 一些中间件 */
app.use(session(CONFIG, app));
// app.use(koaBody());
app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

app.listen(8080, () => {
  console.log('listening to port 8080...');
});
// 引入并使用koa-bodyparser中间件 然后就可以直接在ctx.request.body 中获取到JSON格式的POST数据了。

