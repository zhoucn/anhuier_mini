// pages/mall/orderInfo/index.js
import util from '../../../utils/util'
import check from '../../../utils/check'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    name: null,
    phone: null,
    region: [],
    addrInfo: null,
    createdAt: null,
    orderInfo: [],
    orderNo: null,
    isCancel: null,
    priceStatus: null,
    sendStatus: null,
    priceTotal: null,
    userRemark: null,
    orderInfo: [],
    imgUrl: util.IMGURL + '/',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getInfo() {
    let that = this
    wx.request({
      url: util.urls.orderInfo(this.data.id),
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      success: function (res) {
        check.checkHead(res.header);
        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            id: res.data.body.orderId,
            name: res.data.body.address.name,
            phone: res.data.body.address.phone,
            region: res.data.body.address.region,
            addrInfo: res.data.body.address.addrInfo,
            createdAt: res.data.body.createdAt,
            orderInfo: res.data.body.orderInfo,
            orderNo: res.data.body.orderNo,
            isCancel: res.data.body.isCancel,
            priceStatus: res.data.body.priceStatus,
            sendStatus: res.data.body.sendStatus,
            priceTotal: res.data.body.priceTotal,
            userRemark: res.data.body.userRemark
          })
        } else {
          
        }
      }
    })
  }, 
  orderPay() {
    let that = this
    wx.request({
      url: util.urls.orderPay(that.data.id),
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        check.checkHead(res.header);
        if (res.data.code == 0) {
          wx.requestPayment({
            timeStamp: res.data.body['timeStamp'].toString(),
            nonceStr: res.data.body['nonceStr'],
            package: res.data.body['package'],
            signType: res.data.body['signType'],
            paySign: res.data.body['paySign'],
            success: function (res) {
              wx.showToast({
                title: '支付成功'
              })
              setTimeout(function () {
                that.getInfo()
              }, 1500)
            },
            fail: function () {
              wx.showToast({
                title: '支付失败',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },
  orderCancel() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否要取消订单',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: util.urls.orderCancel(that.data.id),
            header: {
              'content-type': 'application/json',
              'Authorization': 'Bearer ' + wx.getStorageSync('token')
            },
            method: 'POST',
            success: function (res) {
              check.checkHead(res.header);
              console.log(res)
              if (res.data.code == 0) {
                wx.showToast({
                  title: '取消成功'
                })
                setTimeout(function () {
                  that.getInfo()
                }, 1500)
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
  },
  orderDel() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否要删除订单',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: util.urls.orderDel(that.data.id),
            header: {
              'content-type': 'application/json',
              'Authorization': 'Bearer ' + wx.getStorageSync('token')
            },
            method: 'POST',
            success: function (res) {
              check.checkHead(res.header);
              console.log(res)
              if (res.data.code == 0) {
                wx.showToast({
                  title: '删除成功'
                })
                setTimeout(function () {
                  wx.navigateTo({
                    url: '../order/index'
                  })
                }, 1500)
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
  },
  orderConfirm() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否要确认收货',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: util.urls.orderConfirm(that.data.id),
            header: {
              'content-type': 'application/json',
              'Authorization': 'Bearer ' + wx.getStorageSync('token')
            },
            method: 'POST',
            success: function (res) {
              check.checkHead(res.header);
              console.log(res)
              if (res.data.code == 0) {
                wx.showToast({
                  title: '收货成功'
                })
                setTimeout(function () {
                  that.getInfo()
                }, 1500)
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
  }
})