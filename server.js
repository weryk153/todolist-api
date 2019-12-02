const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const mongo = require('koa-mongo');
const app = new Koa();
const router = new Router({
  prefix: '/todos'
});
let index = 1;

app.use(bodyParser());
app.use(cors());
app.use(mongo({
  host: 'localhost',
  port: 27017,
  db: 'todolistAPI',
}));

router
    .get('/', async ctx => {
      const todo = await ctx.db.collection('todolist').find().toArray()
      if (todo) {
        ctx.body = JSON.stringify(todo, null, 2) ;
        ctx.status = 200;
      } else {
        ctx.status = 404;
      }
    })
    .get('/:id', async ctx => {
      // 把資料分別存在 id 變數
      const id = parseInt(ctx.params.id);
      if (id) {
        // 首先找出文章
        const todo = await ctx.db.collection('todolist').findOne({id: id});
        if (todo) {
          // 如果有文章的話就依照文件回傳文章內容（預設就是狀態 200）
          ctx.body = todo;
        } else {
          // 沒有找到的話就依照文件回傳 404
          ctx.body = {};
          ctx.status = 404;
        }
      } else {
        // 如果沒送 id，文章就不存在，就依照文件回傳 404
        ctx.status = 404;
      }
    })
    .delete('/:id', async ctx => {
      // 把資料分別存在 id 變數
      const id = parseInt(ctx.params.id);
      if (id) {
        // 首先找出文章
        const todo = await ctx.db.collection('todolist').findOne({id: id});
        if (todo) {
          // 如果有文章的話就刪除文章，然後依照文件回傳 204
          await ctx.db.collection('todolist').deleteOne({id: id});
          ctx.status = 204;
        } else {
          // 沒有找到的話就依照文件回傳 404
          ctx.status = 404;
        }
      } else {
        // 如果沒送 id，文章就不存在，就依照文件回傳 404
        ctx.status = 404;
      }
    })
    .post('/', async ctx => {
      const { content } = ctx.request.body;
      if(content) {
        const data = await ctx.db.collection('todolist').insertOne({
          id: index++,
          content,
          isCompleted: false,
        });

      ctx.status = 201;
      ctx.body = data.insertedId;
      } else {
        // 如果有欄位沒有填，就依照文件回傳 400
        ctx.status = 400;
      }
    })
    .patch('/:id', async ctx => {
      const id = parseInt(ctx.params.id);
      const { content } = ctx.request.body;
      if(content) {        
        // 如果必填資料都有，就編輯文章
        // 首先找出文章
        const todo = await ctx.db.collection('todolist').findOne({id: id});
        if (todo) {
          todo.content = content;
          await ctx.db.collection('todolist').update({id: id}, {$set: {
            content,
          }})
          // 如果有文章的話就編輯，並依照文件回傳 204
          ctx.status = 204;
        } else {
          ctx.status = 404;
        }
      } else {
        // 如果有欄位沒有填，就依照文件回傳 400
        ctx.status = 400;
      }
    });

app.use(router.routes());
app.listen(3000);
