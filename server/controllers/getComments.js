/*
 * 评论列表
 * @Author: Miracle
 */
const { mysql } = require('../qcloud');

module.exports = async (ctx) => {
  const { bookId, openId } = ctx.query;

  const mysqlSelect = mysql('comments')
    .select('comments.*', 'cSessionInfo.user_info')
    .join('cSessionInfo','comments.open_id', 'cSessionInfo.open_id')

  let data ='';
  if (bookId) {
    data = await mysqlSelect.where('comments.book_id', bookId);
  } else if (openId) {
    data = await mysqlSelect.where('comments.open_id', openId);
  } else {
    ctx.state = {
      code: -2,
      data: {
        msg: '参数错误'
      }
    }
    return
  }
  ctx.state.data = {
    list: data.map(item => {
      const userInfo = JSON.parse(item.user_info);
      return Object.assign({},item, {
        user_info: {
          nickname: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      })
    })
  }
};
