/*
 * 添加评论
 * @Author: Miracle
 */

const { mysql } = require('../qcloud');


module.exports = async (ctx) =>{
  const { bookId, openId, comment, location, phone } = ctx.request.body;
  console.log(bookId, openId, comment);
  if(bookId && openId && comment) {
    try {
      await mysql('comments').insert({
        open_id: openId, book_id: bookId, comment, location, phone
      });
      ctx.state.data = {
        msg: 'success'
      }
    } catch (e) {
      ctx.state = {
        code: -1,
        data: {
          msg: e.sqlMessage
        }
      }
    }
  } else {
    ctx.state = {
      code: -2,
      data: {
        msg: '请求参数错误'
      }
    }
  }
}
