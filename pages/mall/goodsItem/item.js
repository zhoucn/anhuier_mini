// pages/mall/goodsItem/item.js
import util from '../../../utils/util'
import check from '../../../utils/check'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsImgs: [],
    goodsTitle: '',
    goodsPrice: '',
    goodsServices: [],
    goodsInfo: null,
    cartNum: 0,
    stockNum: 0,
    id: null,
    imgUrl: util.IMGURL + '/',
    infoUrl: util.INFOURL + '/',
    info: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      id: options.id
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
    this.getInfo()
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
      url: util.urls.goodsInfo(that.data.id),
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      success: function (res) {
        check.checkHead(res.header);
        console.log(res)
        if (res.data.code == 0) {
          res.data.body.goodsNum = 1
          let infoSrc = null
          if (res.data.body.goodsInfo){
            infoSrc = res.data.body.goodsInfo.src
          }
          that.setData({
            goodsImgs: res.data.body.goodsImgs,
            goodsTitle: res.data.body.goodsTitle,
            goodsPrice: res.data.body.goodsPrice,
            goodsServices: res.data.body.goodsServices,
            goodsInfo: infoSrc,
            cartNum: res.data.body.cartNum,
            stockNum: res.data.body.stockNum,
            info : res.data.body
          })
        }
      }
    })
  },
  addCar() {
    let that = this
    if (this.data.cartNum < this.data.stockNum){
      wx.request({
        url: util.urls.updataCar(that.data.id),
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        data: {
          type: 'inc'
        },
        method: 'POST',
        success: function(res) {
          check.checkHead(res.header);
          console.log(res)
          if (res.data.code == 0) {
            wx.showToast({
              title: '已加入购物车'
            })
            that.setData({
              cartNum: that.data.cartNum + 1
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '库存不足',
        icon: 'none'
      })
    }
  },
  toBuycar() {
    wx.switchTab({
      url: '../buyCar/index'
    })
  },
  toBuy() {
    let obj = {}
    obj.goodsId = [this.data.id]
    obj.type = 0
    obj.price = this.data.goodsPrice
    obj.count = 1
    obj.info = [this.data.info]
    obj = JSON.stringify(obj)
    wx.navigateTo({
      url: '../buy/index?info=' + obj,
    })
  }
})