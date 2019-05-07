// pages/mine/driverInfo/driverInfo.js
import util from '../../../utils/util'
import check from '../../../utils/check'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    driver: [],
    IDCardPhoto: '',
    contract: ''
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
    this.driverInfo()
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
   * 司机个人信息
   */
  driverInfo: function() {
    let that = this
    let device = []
    check.checkToken({
      success: function () {
        wx.request({
          url: util.urls.driverInfo,
          header: {
            'content-type': 'application/json',
            'Authorization':'Bearer ' + wx.getStorageSync('token')
          },
          method: 'POST',
          success: function(info) {
            // console.log(info)
            check.checkHead(info.header);
            if (info.data.code == 0) {
              that.setData({
                driver: info.data.body
              })
            }

          }
        })
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