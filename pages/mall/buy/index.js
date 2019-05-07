// pages/mall/buy/index.js
import util from '../../../utils/util'
import check from '../../../utils/check'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressId: null,
    addressList: [],
    goodsList: [],
    remark: '',
    count: 0,
    price: '',
    type: null,
    goodsId: [],
    imgUrl: util.IMGURL + '/'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = JSON.parse(options.info)
    this.setData({
      goodsList: info.info,
      count: info.count,
      price: info.price,
      type: info.type,
      goodsId: info.goodsId
    })
    
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
    this.getList()
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
  setRemark: function(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  getList() {
    let that = this
    wx.request({
      url: util.urls.addressList,
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      success: function (res) {
        check.checkHead(res.header);
        console.log(res)
        if (res.data.code == 0) {
          res.data.body.forEach(e => {
            if (wx.getStorageSync('addrId') && e.addrId == wx.getStorageSync('addrId')) {
              that.setData({
                addressList: [e],
                addrId: e.addrId
              })
              wx.removeStorageSync('addrId')
            }else if(e.isDefault) {
              that.setData({
                addressList: [e],
                addrId: e.addrId
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  account() {
    let that = this
    wx.request({
      url: util.urls.goodsOrder,
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      data: {
        goodsIds: that.data.goodsId,
        type: that.data.type,
        addrId: that.data.addrId,
        remark: that.data.remark
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
            },
            fail: function() {
              wx.showToast({
                title: '支付失败',
                icon: 'none'
              })
              wx.navigateTo({
                url: '../order/index'
              })
            }
          })
        }
      }
    })
  }
})