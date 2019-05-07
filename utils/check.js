const checkHead = function(e, state, fn){  //检查响应头是否返回token
  if (e.Authorization){
    let token = e.Authorization.split(' ')[1];
    wx.setStorageSync('token', token)
  }
  if (state && state == 401) {
    wx.clearStorage()
    if (fn && typeof fn == 'function') {
      fn()
    }
  }
}

const checkToken = function(option){  //检查token是否过期
  if (wx.getStorageSync('token')) {
    if ((wx.getStorageSync('expiredAt') - 60) * 1000 > new Date().getTime()) {
      if (option.success && typeof option.success == 'function'){
        option.success()
      }
    } else {
      if (option.fail && typeof option.fail == 'function'){
        option.fail()
      }
      wx.clearStorage()
      wx.showModal({
        title: '提示',
        content: '登录已过期，请重新登录',
        showCancel: false,
        success: function(){
          wx.switchTab({
            url: '../index/index',
          })
        }
      })
    }
  }else{
    if (option.complete && typeof option.complete == 'function') {
      option.complete()
    }
  }
}

module.exports = {
  checkHead,
  checkToken
}