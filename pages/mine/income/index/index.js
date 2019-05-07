// pages/mine/income/index/index.js
import util from '../../../../utils/util'
import check from '../../../../utils/check'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yesterday: 'none',
    today: 'bolck',
    catalogSelect: 1,
    todayCount: 0, //今日订单数
    yesCount: 0, //昨日订单数
    weekCount: 0, //本周订单数
    monthCount: 0, //本月订单数
    todayMoney: 0, //今日收益
    yesMoney: 0, //昨日收益
    weekMoney: 0, //本周收益
    monthMoney: 0, //本月收益
    allCount: 0,
    allCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.DrIncomeDetail()
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
   * 今天
   */
  today: function() {
    this.setData({
      yesterday: 'none',
      today: 'bolck',
      catalogSelect: 1
    })
  },
  yesterday: function() {
    this.setData({
      yesterday: 'bolck',
      today: 'none',
      catalogSelect: 2
    })
  },
  /**
   * 收益概况
   */
  DrIncomeDetail: function() {
    let that = this
    check.checkToken({
      success: function () {
        wx.request({
          url: util.urls.driverIncome,
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
                todayCount: info.data.body.countToday['count'],
                todayMoney: info.data.body.countToday['total'],
                yesCount: info.data.body.countYesterday['count'],
                yesMoney: info.data.body.countYesterday['total'],
                weekCount: info.data.body.countWeek['count'],
                weekMoney: info.data.body.countWeek['total'],
                monthCount: info.data.body.countMonth['count'],
                monthMoney: info.data.body.countMonth['total'],
                allMoney: info.data.body.all['total'],
                allCount: info.data.body.all['count']
              })
            }
          }
        })
      }
    })
  },
  /**
   * 收益详情
   */
  incomeDetail: function(e) {
    wx.navigateTo({
      url: '../income?time=' + e.currentTarget.dataset.time
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