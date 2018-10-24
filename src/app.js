/* const Koa = require("koa");
const app = new Koa();
const Router = require("koa-router");
const router = new Router();
const mongoose = require("mongoose");
const koaBody = require("koa-body");
const bodyParser = require("koa-bodyparser");
const db = require("./db");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true }
});

const UserModel = mongoose.model("User", UserSchema);

const register = async ctx => {
  // console.log(ctx.request.body);
  // console.log(JSON.parse(ctx.request.body));
  const formData = ctx.request.body;
  const { name, password } = ctx.request.body;
  if (!name || !password) {
    console.log("用户名或密码不存在！");
    return (ctx.body = { msg: "error" });
  }
  const isExist = await UserModel.findOne({ name });
  if (isExist) {
    console.log("账号已存在");
    return (ctx.body = { msg: "fail" });
  }
  const result = await UserModel.create({ name, password });
  if (!result) {
    console.log("注册失败");
    return (ctx.body = { status: "fail" });
  } else {
    console.log("注册成功");
    return (ctx.body = { status: "success" });
  }
};

app.use(koaBody());
// app.use(bodyParser());

router.all("/api/*", async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "http://localhost:4200");
  ctx.set("Access-Control-Allow-Credentials", "true");
  await next();
});

router.post("/api/register", register);

app.use(router.routes()).use(router.allowedMethods());
app.use(bodyParser());

app.listen(3000);
 */

// 引入并使用koa-bodyparser中间件 然后就可以直接在ctx.request.body 中获取到JSON格式的POST数据了。


const Koa  = require('koa');
const app = new Koa();

const bodyParser = require('koa-bodyparser');
app.use(bodyParser());
 
app.use(async(ctx)=>{
    if(ctx.url==='/' && ctx.method==='GET'){
        //显示表单页面
        let html=`
            <h1>JSPang Koa2 request POST</h1>
            <form method="POST" action="/">
                <p>userName</p>
                <input name="userName" /><br/>
                <p>age</p>
                <input name="age" /><br/>
                <p>website</p>
                <input name="webSite" /><br/>
                <button type="submit">submit</button>
            </form>
        `;
        ctx.body=html;
    }else if(ctx.url==='/' && ctx.method==='POST'){
         let postData= ctx.request.body;
         ctx.body=postData;
    }else{
        ctx.body='<h1>404!</h1>';
    }
 
});
 
app.listen(3000,()=>{
    console.log('server is starting at port 3000');
});