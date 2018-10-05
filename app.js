var util = require('utils/util.js');

/*---------------*/

App({
  url: 'https://srkj.xin/xcx/flower',
  imageURL:'http://117.34.105.198:8888',
  requestData: function (data, url, getdata) {
    var that = this;
    var session_3rd = wx.getStorageSync('session_3rd');
    data['session_3rd'] = session_3rd;
     wx.request({
      url: url,
      data: data,
      dataType: 'JSON',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
      },
      success: function (res) {
        //888  成功
        if (JSON.parse(res.data).success == '888') {
          that.requestData1(data, url, function (event) {
              getdata(event)
            })
        } else {
          getdata(res);
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    sysWidth: wx.getSystemInfoSync().windowWidth,//屏幕宽度
  },
  requestData1: function (data1, url, getdata) {
    var session_3rd = '';
    var that = this
    wx.login({//login流程
      success: function (res) {
        //console.log(res.code)
        that.requestData({
          code: res.code,
          query: data1.query
        }, that.url + '/login/onLogin', function (event) {
          session_3rd = JSON.parse(event.data).data;
            // // 获取用户信息
          wx.getUserInfo({
            success: function (res2) {
              that.requestData(res2.userInfo, that.url + '/login/userInfo', function (event2) {
              })
            }
          })
          wx.setStorageSync('session_3rd', session_3rd);    
               session_3rd = wx.getStorageSync('session_3rd')
                data1['session_3rd'] = session_3rd
                wx.request({
                url: url,
                data: data1,
                dataType: 'JSON',
                method: 'POST',
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
                },
                success: function (res) {
                  getdata(res);
                }
              })
            })
        }
    })
  }
})