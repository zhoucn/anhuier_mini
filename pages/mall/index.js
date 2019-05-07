// pages/mall/index.js
import util from '../../utils/util'
import check from '../../utils/check'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    bannerSrc: util.BANNER + '/',
    imgUrl: util.IMGURL + '/',
    goodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.banner()
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

  getList: function(){
    let that = this
    wx.request({
      url: util.urls.mallIndex,
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      success: function(res){
        // console.log(res)
        check.checkHead(res.header);
        if (res.data.code == 0){
          that.setData({
            goodsList: res.data.body.rows
          })
        }
      }
    })
  },

  goods_item:function(){
    wx.navigateTo({
      url: 'goodsItem/item',
    })
  },
  /**
   * 轮播图
   */
  banner: function () {
    let that = this
    wx.request({
      url: util.urls.banner,
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
      success: function (info) {
        that.setData({
          banner: info.data.body
        })
      }
    })
  },
  /**
   * 客服
   */
  contact: function () {
    wx.showModal({
      title: '提示',
      content: '确定要拨打客服热线吗？',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '18686659797'
          })
        }
      }
    })
  },
  goToMini: function () {
    wx.navigateToMiniProgram({
      appId: "wxab3cfc4cada8b5c6"
    })
  }
})