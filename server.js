const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const cors = require('@koa/cors');

const app = new Koa();
const router = new Router();

app.use(koaBody());
app.use(cors());

let todoId = 0;
let todolist = [];

router
    .get('/todos', ctx => {
      ctx.body = JSON.stringify(todolist, null, 2);
    })
    .get('/todos/:id', ctx => {
      // 把資料分別存在 id 變數
      const id = parseInt(ctx.params.id);
      if (id) {
        // 首先找出文章
        const todo = todolist.find(x => x.id === id);  
        if (todo) {
          // 如果有文章的話就依照文件回傳文章內容（預設就是狀態 200）
          ctx.body = JSON.stringify(todo, null, 2);
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
    .delete('/todos/:id', ctx => {
      // 把資料分別存在 id 變數
      const id = parseInt(ctx.params.id);
      if (id) {
        // 首先找出文章
        const todo = todolist.find(x => x.id === id); 
        if (todo) {
          // 如果有文章的話就刪除文章，然後依照文件回傳 204
          todolist = todolist.filter(x => x.id !== id);
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
    .post('/todos', ctx => {
      const { content } = ctx.request.body;
      if(content) {
        todolist.push({
          id: todoId += 1 ,
          content,
          isCompleted: false,
      });
      ctx.status = 201;
      ctx.body = todoId;
      } else {
        // 如果有欄位沒有填，就依照文件回傳 400
        ctx.status = 400;
      }
    })
    .patch('/todos/:id', ctx => {
      const id = parseInt(ctx.params.id);
      const { content } = ctx.request.body;
      if(content) {        
        // 如果必填資料都有，就編輯文章
        // 首先找出文章
        const todo = todolist.find(x => x.id === id);
        if(todo) {
          // 如果有文章的話就編輯，並依照文件回傳 204
          todo.content = content;
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
