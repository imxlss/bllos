const ArticleModel = require('../models/article.model');

class ArticleController {
  static async createArticle(ctx) {
    const user = ctx.session.user;

    if (!user)
      return (ctx.body = {
        status: 'fail',
        msg: '请先进行登陆'
      });

    const { _id } = user;
    const data = JSON.parse(ctx.request.body);
    //   console.log(data);
    if (!data)
      return (ctx.body = {
        status: 'fail',
        msg: '数据发送失败'
      });

    const isExist = await ArticleModel.findOne({
      title: data.title
    });
    if (isExist)
      return (ctx.body = {
        status: 'fail',
        msg: '文章标题重复'
      });
    data.author = _id;
    const result = await ArticleModel.create(data);
    if (!result)
      return (ctx.body = {
        status: 'fail',
        msg: '文章创建失败'
      });

    return (ctx.body = {
      status: 'success',
      msg: '文章创建成功',
      data: data
    });
  }

  static async getArticleList(ctx) {
    let { page, pagesize } = ctx.query;
    if (!page) page = 1;
    if (!pagesize) pagesize = 10;
    const skip = (Number(page) - 1) * Number(pagesize);
    const total = await ArticleModel.count();

    const articleList = await ArticleModel.find(null, {
      content: 0,
      _v: 0,
      author: 0
    })
      .skip(Number(skip))
      .limit(Number(pagesize));

    return (ctx.body = {
      status: 'success',
      data: {
        total,
        articleList
      }
    });
  }

  static async getArticleDetail(ctx) {
    const { id } = ctx.query;
    console.log(id);

    /*   const data = await ArticleModel.findById(id).populate('author', {
            password: 0
          }); */
    const data = await ArticleModel.findById(id);
    console.log(data);
    if (!data)
      return (ctx.body = {
        status: 'fail',
        msg: '获取失败'
      }); // $set 用来指明更新的字段

    /*   const review = data.review + 1;
          const updateview = await ArticleModel.findByIdAndUpdate(data.id, {
            $set: {
              review
            }
          });  */ return (ctx.body = {
      status: 'success',
      data: data
    });
  }
}

module.exports = ArticleController;
