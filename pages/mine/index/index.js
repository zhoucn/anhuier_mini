// pages/mine/index/index.js
import util from '../../../utils/util'
import check from '../../../utils/check'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: false,
    isDriver: 0, //0-乘客 1-司机 2-代理
    amount: 0.00,
    income: 0.00
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!wx.getStorageSync('token')) {
      this.setData({
        login: false
      })
    }else{
      this.setData({
        login: true
      })
    }
    let role = wx.getStorageSync('isDriver')
    if (role == 1) {
      this.amount()
      this.setData({
        isDriver: role
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 登录
   */
  onGotUserInfo: function(e) {
    var that = this
    wx.login({
      success: res => {
        var code = res.code;
        // console.log(res.code)
        wx.request({
          url: util.urls.onlogin,
          method: 'POST',
          data: {
            "code": code,
            "rawData": e.detail.rawData,
            "signature": e.detail.signature,
            'iv': e.detail.iv,
            'encryptedData': e.detail.encryptedData,
            "name": e.detail.userInfo.nickName,
            "avatar": e.detail.userInfo.avatarUrl,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function(info) {
            console.log(info)
            if (info.data.code == 0) {
              wx.setStorageSync('token', info.data.body.token)
              wx.setStorageSync('expiredAt', info.data.body.expiredAt)
              that.setData({
                login: true
              })
              app.globalData.is_login = true
              if (info.data.body.isDriver == 1) {
                that.amount();
              }
              wx.request({
                url: util.urls.userInfo,
                header: {
                  'content-type': 'application/json',
                  'Authorization': 'Bearer ' + wx.getStorageSync('token')
                },
                method: 'POST',
                success: function (info) {
                  check.checkHead(info.header);
                  console.log(info)
                  if (info.data.code == 0) {
                    that.setData({
                      isDriver: info.data.body.isDriver
                    })
                    wx.setStorageSync('isDriver', info.data.body.isDriver)
                    wx.setStorageSync('isTester', info.data.body.isTester)
                  }
                }
              })
            }
          }
        })
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })

  },

  /**
   * 去提现
   */
  withdraw: function() {
    wx.navigateTo({
      url: '../withdraw/withdraw'
    })
  },
  /**
   * 收益详情
   */
  incomeDetail: function() {
    wx.navigateTo({
      url: '../income/index/index'
    })
  },
  /**
   * 申请注销
   */
  logout: function() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '你确定要注销吗？',
      success: function(res) {
        if (res.confirm) {
          check.checkToken({
            success: function () {
              that.setData({
                login: true
              })
              wx.request({
                url: util.urls.logout,
                header: {
                  'content-type': 'application/json',
                  'Authorization':'Bearer ' + wx.getStorageSync('token')
                },
                method: 'POST',
                success: function(info) {
                  check.checkHead(info.header);
                  // console.log(info);
                  if (info.data.code == 0) {
                    that.setData({
                      login: false,
                      isDriver: 0
                    })
                    wx.clearStorage()
                  }
                }
              })
            },
            fail: function(){
              that.setData({
                login: false
              })
            }
          })
        }
      }

    })

  },
  /**
   * 未登录
   */
  no_login: function() {
    wx.showModal({
      title: '提示',
      content: '请先登录',
      showCancel: false
    })
  },
  /**
   * 客服
   */
  contact: function() {
    wx.showModal({
      title: '提示',
      content: '确定要拨打客服热线吗？',
      success: function(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '18686659797'
          })
        }
      }
    })

  },
  bindDevice: function () { //检查设备绑定情况
    let that = this;
    let scene = ''
    wx.scanCode({
      success: (res) => {
        // console.log(res)
        scene = res.path.split("=")[1]
        check.checkToken({
          success: function () {
            that.setData({
              login: true
            })
            wx.request({
              url: util.urls.deviceBindInfo,
              header: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + wx.getStorageSync('token')
              },
              method: 'POST',
              data: {
                deviceNo: scene // '898607B8121700080132'
              },
              success: function (info) {
                check.checkHead(info.header);
                // console.log(info);
                if (info.data.code == 0) {
                  if (info.data.bindingName){
                    wx.showModal({
                      title: '提示',
                      content: '设备已经被 ' + info.data.bindingName +' 绑定，是否继续绑定',
                      success: function (res){
                        if (res.confirm) {
                          check.checkToken({
                            success: function () {  //绑定设备
                              wx.request({
                                url: util.urls.bindDevice,
                                header: {
                                  'content-type': 'application/json',
                                  'Authorization': 'Bearer ' + wx.getStorageSync('token')
                                },
                                method: 'POST',
                                data: {
                                  deviceNo: scene
                                },
                                success: function (info) {
                                  console.log(info)
                                  check.checkHead(info.header);
                                  if (info.data.code == 0) {
                                    wx.showModal({
                                      title: '提示',
                                      content: '绑定成功'
                                    })
                                  }
                                }
                              })
                            }
                          })
                        }
                      }
                    })
                  }else{
                    wx.request({
                      url: util.urls.bindDevice,
                      header: {
                        'content-type': 'application/json',
                        'Authorization': 'Bearer ' + wx.getStorageSync('token')
                      },
                      method: 'POST',
                      data: {
                        deviceNo: scene
                      },
                      success: function (info) {
                        // console.log(info)
                        check.checkHead(info.header);
                        if (info.data.code == 0) {
                          wx.showModal({
                            title: '提示',
                            content: '绑定成功'
                          })
                        }
                      }
                    })
                  }
                } else {
                  wx.showModal({
                    title: '提示',
                    content: info.data.msg
                  })
                }
              }
            })
          },
          fail: function(){
            that.setData({
              login: false
            })
          }
        })
      }
    })
  },
  amount: function(token){  //获取收益
    let that = this;
    check.checkToken({
      success: function(){
        that.setData({
          login: true
        })
        wx.request({
          url: util.urls.amount,
          header: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + wx.getStorageSync('token')
          },
          method: 'POST',
          success: function (info) {
            check.checkHead(info.header, info.statusCode, function () {
              that.setData({
                login: false
              })
            });
            // console.log(info);
            if (info.data.code == 0) {
              that.setData({
                amount: info.data.body.amount,
                income: info.data.body.income
              })
            } else {
              wx.showModal({
                title: '提示',
                content: info.data.msg,
                showCancel: false
              })
            }
          }
        })
      },
      fail: function(){
        that.setData({
          login: false
        })
      }
    })
  }
})