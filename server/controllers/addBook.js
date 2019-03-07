/*
 * 添加图书
 * @Author: Miracle
 */

const https = require('https');
const { mysql } = require('../qcloud');

function getJson(url){
  return new Promise((resolve, reject) =>{
    let dataSrt = ''
    https.get(url, res=> {
      res.on('data', data=>{
        dataSrt += data;
      });
      res.on('end', ()=>{
        const dataObj = JSON.parse(dataSrt);
        if (dataObj.title) {
          resolve(dataObj)
        } else {
          reject('fail')
        }
      })
    })
  })
}

module.exports = async (ctx) =>{
  const { isbn, openId } = ctx.request.body;
  console.log(isbn, openId);
  if(isbn && openId) {
    const findIsnc = await mysql('books').select().where('isbn', isbn);
    if (findIsnc.length) {
      ctx.state = {
        code: -1,
        data: {
          msg: '该书已存在，请勿重复添加！'
        }
      }
      return;
    }
    const url = `https://api.douban.com/v2/book/isbn/${isbn}`;
    const bookInfo = await getJson(url);
    if (bookInfo === 'fail') {
      ctx.state = {
        code: -1,
        data: {
          msg: '从豆瓣获取该书失败！'
        }
      }
      return;
    }

    const { numRaters, average } = bookInfo.rating;  // 评价人数， 评分
    // 作者、 发布时间、 封面图、目录、页数、出版方、标题、 作者简介、本书简介、本书价格
    const { pubdate, image, catalog, pages, publisher, title, author_intro, summary, price } = bookInfo;
    // 标签
    const tags = bookInfo.tags.map(item=> {
      return item.name
    }).join(',')
    // 作者
    const author = bookInfo.author.join(',');

    try {
      await mysql('books').insert({
        open_id: openId, author, tags, pubdate, image, catalog, pages, publisher, isbn, title, author_intro, summary, price, numRaters, average
      });
      ctx.state.data = {
        title,
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
