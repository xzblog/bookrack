/*
 * 图书详情
 * @Author: Miracle
 */
const { mysql } = require('../qcloud');

module.exports = async (ctx) => {
  const {id} = ctx.query;
  await mysql('books').where('id', id).increment('count', 1)
  const data = await mysql('books').select('books.*', 'cSessionInfo.user_info')
    .join('cSessionInfo','books.open_id', 'cSessionInfo.open_id' )
    .where('id',id).first();
  const userInfo = JSON.parse(data.user_info);
  const details = Object.assign({}, data, {
    tags: data.tags.split(','),
    summary: data.summary.split('\n'),
    catalog: data.catalog.split('\n'),
    user_info: {
      nickname: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl
    }
  })
  ctx.state.data = details;
};
