// pages/mine/driver/driver.js
import util from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneValue: '', //手机号码
    time: '获取验证码',
    disabled: false,
    code: '', //验证码
    codeValue: '', //输入验证码
    role: '' //角色
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options.role)
    this.setData({
      role: options.role
    })
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
   * 获取手机号码
   */
  phoneValue: function(e) {
    this.setData({
      phoneValue: e.detail.value
    })
  },
  /**
   * 获取验证码
   */
  getCode: function() {
    let that = this
    if (!that.data.phoneValue || that.data.phoneValue.length < 11) {
      wx.showModal({
        title: '手机号码错误',
        content: '请输入正确的手机号码',
      })
    } else {
      wx.request({
        url: util.urls.sendsmscode,
        header: {
          'content-type': 'application/json',
          'Authorization':'Bearer ' + wx.getStorageSync('token')
        },
        data: {
          'phone': that.data.phoneValue,
        },
        method: 'POST',
        success: function(info) {

          that.setData({
            code: info.data.body.code
          })
        }
      })
      let currentTime = 61;
      let interval = setInterval(function() {
        currentTime--;
        that.setData({
          time: currentTime + '秒',
          disabled: true
        })
        if (currentTime <= 0) {
          clearInterval(interval)
          that.setData({
            time: '重新发送',
            disabled: false
          })
        }
      }, 1000)
    }
  },
  /**
   * 获取输入验证码
   */
  codeValue: function(e) {
    this.setData({
      codeValue: e.detail.value
    })
  },
  /**
   * 提交
   */
  submit: function() {
    let that = this
    if (!this.data.phoneValue) {
      wx.showModal({
        title: '手机号码错误提示',
        content: '请输入手机号码',
      })
    } else if (!this.data.codeValue) {
      wx.showModal({
        title: '验证码错误提示',
        content: '请输入验证码',
      })
    } else if (this.data.codeValue != this.data.code) {
      wx.showModal({
        title: '验证码错误提示',
        content: '验证码输入不正确，请重新输入',
      })
    } else {
      wx.request({
        url: util.urls.registerDriver,
        header: {
          'content-type': 'application/json',
          'Authorization':'Bearer ' + wx.getStorageSync('token')
        },
        data: {
          'phone': that.data.phoneValue,
          'role': that.data.role
        },
        method: 'POST',
        success: function(info) {
          if (info.data.code == 0) {
            wx.showModal({
              title: '绑定提示',
              content: '绑定成功',
              success: function() {
                if (that.data.role == 'proxy'){
                  // console.log(that.data.role)
                  wx.setStorageSync('role', 2)
                }else{
                  wx.setStorageSync('role', 1)
                }
                wx.switchTab({
                  url: '../index/index'
                });

              }
            })
          } else if (info.data.state == 2) {
            if (that.data.role == 'proxy') {
              wx.showModal({
                title: '绑定提示',
                content: '你不是代理',
              })
            } else {
              wx.showModal({
                title: '绑定提示',
                content: '你不是司机',
              })
            }
          } else if (info.data.state == 4) {
            wx.showModal({
              title: '绑定提示',
              content: '此号码已经被绑定，请勿重复绑定',
            })
          } else {
            wx.showModal({
              title: '绑定提示',
              content: '绑定失败',
            })
          }
        }
      })
    }
  },
  register: function() {
    if (this.data.role == 'proxy') {
      wx.navigateTo({
        url: '../addProxy/addProxy',
      })
    } else {
      wx.navigateTo({
        url: '../addDriver/addDriver',
      })
    }

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

  }
})