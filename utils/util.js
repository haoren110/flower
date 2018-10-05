//数据转化  
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formatTime(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}  
module.exports = {
  formatTime: formatTime
}
var app = getApp();
/*
 * 登录
 */
function login(e, fun) {
  var app = getApp();
  var session_3rd = '';
  wx.login({//login流程
    success: function (res) {
      //console.log(res.code)
      // 判断是否有参数
      var obj = {}
      if (e) {
        obj = {
          code: res.code,
          query: e
        }
      } else {
        obj = {
          code: res.code,
          query: ''
        }
      }

      app.requestData(obj, app.url + '/login/onLogin.html', function (event) {
        session_3rd = JSON.parse(event.data).data;
        console.log(session_3rd)
        wx.setStorageSync('session_3rd', session_3rd)
        // 获取用户信息
        wx.getUserInfo({
          success: function (res2) {
            console.log(res2)
            app.requestData(res2.userInfo, app.url + '/login/userInfo.html', function

(event2) {
              // console.log(event2)
              // wx.setStorageSync('userInfo', res2.userInfo)
            })
          }
        })
        fun()
      })
    }
  })
}
