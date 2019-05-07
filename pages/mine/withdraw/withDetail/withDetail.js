// pages/mine/order/order.js
import util from '../../../../utils/util'
import check from '../../../../utils/check'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [], //订单列表
    currentPage: 1,
    Load: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.orderList()
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
    let page = this.data.currentPage + 1
    this.setData({
      currentPage: page
    });
    this.orderList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  orderList: function() {
    let that = this
    let orderList = that.data.orderList
    if (this.data.Load) {
      wx.showLoading({
        title: '加载中',
      })
      check.checkToken({
        success: function () {
          wx.request({
            url: util.urls.withdrawRecord,
            header: {
              'content-type': 'application/json',
              'Authorization':'Bearer ' + wx.getStorageSync('token')
            },
            data: {
              page: that.data.currentPage
            },
            method: 'POST',
            success: function(info) {
              // console.log(info)
              check.checkHead(info.header);
              if (info.data.code == 0) {
                for (var value of info.data.body) {
                  orderList.push(value)
                }
                that.setData({
                  orderList: orderList
                })
              } else {
                that.setData({
                  Load: false
                })
              }
              wx.hideLoading()
            }
          })
        }
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