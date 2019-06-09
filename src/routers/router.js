const Router = require('koa-router');
const router = new Router();
const UserController = require('../controllers/user');
const articleController = require('../controllers/article');

// cors 解决跨域
// ctx.set('Access-Control-Allow-Origin', 'http://www.xxxx.com');
router.all('/api/*', async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:8000');
  ctx.set('Access-Control-Allow-Credentials', 'true');
  await next();
});

router
  .post('/api/register', UserController.register)
  .post('/api/signin', UserController.signin)
  .get('/api/signout', UserController.signout)
  .post('/api/check', UserController.checkConnect)

  .post('/api/create', articleController.createArticle)
  .get('/api/articleList', articleController.getArticleList)
  .get('/api/articleDetail', articleController.getArticleDetail);

module.exports = router;
