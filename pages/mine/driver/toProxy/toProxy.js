// pages/mine/driver/toProxy/toProxy.js
import util from '../../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    driver: [],
    protocol: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.driverInfo()
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
   * 司机按摩垫信息
   */
  driverInfo: function() {
    let that = this
    let device = []
    wx.request({
      url: util.urls.driverInfo,
      header: {
        'content-type': 'application/json',
        'Authorization':'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      success: function(info) {
        console.log(info)
        if (info.data.state == 1) {
          that.setData({
            driver: info.data.driverInfo
          })
        } else if (info.data.state == 0) {

        }
      }
    })
  },
  /**
   * 勾选合作协议
   */
  checkbox: function(e) {
    if (e.detail.value.length > 0) {
      this.setData({
        protocol: false,
      })
    } else {
      this.setData({
        protocol: true,
      })
    }
  },
  /**
   * 
   */
  addProxy: function() {
    let that = this
    wx.request({
      url: util.urls.addProxy,
      header: {
        'content-type': 'application/json',
        'Authorization':'Bearer ' + wx.getStorageSync('token')
      },
      data: {
        driver: that.data.driver['name'],
        money: that.data.driver['money'],
      },
      method: 'POST',
      success: function(res) {
        if (res.data.state == 1) {
          wx.request({
            url: util.urls.pay,
            header: {
              'content-type': 'application/json',
              'Authorization':'Bearer ' + wx.getStorageSync('token')
            },
            data: {
              money: that.data.driver['money'],
            },
            method: 'POST',
            success: function(info) {
              if (info.data.state == 1) {
                wx.requestPayment({
                  'timeStamp': info.data.parameters['timeStamp'].toString(),
                  'nonceStr': info.data.parameters['nonceStr'],
                  'package': info.data.parameters['package'],
                  'signType': 'MD5',
                  'paySign': info.data.parameters['paySign'],
                  'success': function(res) {
                    wx.showModal({
                      title: '提示',
                      content: '绑定成功',
                      showCancel: false,
                      success: function(res) {
                        wx.setStorageSync('role', 2)
                        if (res.confirm) {
                          wx.switchTab({
                            url: '../../index/index',
                          })
                        }
                      }
                    })
                  },
                  'fail': function (res) {
                    wx.request({
                      url: util.urls.addProxy,
                      header: {
                        'content-type': 'application/json',
                        'Authorization':'Bearer ' + wx.getStorageSync('token')
                      },
                      method: 'POST',
                    })
                  }
                })
              }
            },
            
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '抱歉，垫子被别人抢先一步代理啦。',
            showCancel: false,
          })
        }
      }

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

  }
})