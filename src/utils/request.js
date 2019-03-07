/*
 * 请求封装
 * @Author: Miracle
 */

const baseUrl = 'https://02alqooj.qcloud.la/weapp';

export default function request({ url, ...rest }) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl}${url}`,
      ...rest,
      success(res) {
        if (res.data.code === 0) {
          resolve(res.data.data);
        } else {
          wx.showModal({
            title: '失败',
            content: `${res.data.data.msg}`,
            showCancel: false,
          });
          reject(res.data);
        }
      },
      fail(res) {
        wx.showToast({
          title: '请求失败',
          icon: 'none',
        });
        reject(res);
      },
    });
  });
}
