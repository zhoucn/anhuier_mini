// pages/mine/order/order.js
import util from '../../../utils/util'
import check from '../../../utils/check'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    orderList: [], //订单列表
    currentPage: 1,
    imgUrl: util.IMGURL + '/',
    Load: true,
    payList: [],
    sendList: [],
    receiveList: [],
    successList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.index){
      this.setData({
        index: options.index
      })
    }
    this.getList()
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
    this.refreshList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let page = this.data.currentPage + 1
    this.setData({
      currentPage: page
    });
    this.orderList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  setIndex(e) {
    let index = e.currentTarget.dataset['index']
    this.setData({
      index: index
    })
  },
  getList: function () {
    let that = this
    let orderList = this.data.orderList
    let payList = this.data.payList
    let sendList = this.data.sendList
    let receiveList = this.data.receiveList
    let successList = this.data.successList
    if (this.data.Load) {
      wx.showLoading({
        title: '加载中',
      })
      check.checkToken({
        success: function () {
          wx.request({
            url: util.urls.goodsOrderList,
            header: {
              'content-type': 'application/json',
              'Authorization': 'Bearer ' + wx.getStorageSync('token')
            },
            data: {
              page: that.data.currentPage
            },
            method: 'POST',
            success: function (res) {
              console.log(res)
              check.checkHead(res.header);
              if (res.data.code == 0) {
                for (var value of res.data.body.rows) {
                  orderList.push(value)
                  if (value.priceStatus == 0 && value.isCancel == 0){
                    payList.push(value)
                  }else{
                    if (value.sendStatus == 0 && value.isCancel == 0){
                      sendList.push(value)
                    } else if (value.sendStatus == 1 && value.isCancel == 0){
                      receiveList.push(value)
                    } else if (value.sendStatus == 2 && value.isCancel == 0){
                      successList.push(value)
                    }
                  }
                }
                that.setData({
                  orderList: orderList,
                  payList: payList,
                  sendList: sendList,
                  receiveList: receiveList,
                  successList: successList
                })
                wx.stopPullDownRefresh()
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
  orderPay(e) {
    let id = e.currentTarget.dataset['id']
    let that = this
    wx.request({
      url: util.urls.orderPay(id),
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
                that.refreshList()
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
  orderCancel(e) {
    let id = e.currentTarget.dataset['id']
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否要取消订单',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: util.urls.orderCancel(id),
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
                  that.refreshList()
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
  orderDel(e) {
    let id = e.currentTarget.dataset['id']
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否要删除订单',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: util.urls.orderDel(id),
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
                  that.refreshList()
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
  orderConfirm(e) {
    let id = e.currentTarget.dataset['id']
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否要确认收货',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: util.urls.orderConfirm(id),
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
                setTimeout(function(){
                  that.refreshList()
                },1500)
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
  refreshList() {
    let that = this;
    that.setData({
      orderList: [],
      payList: [],
      sendList: [],
      receiveList: [],
      successList: [],
      currentPage: 1
    })
    that.getList()
  }
})