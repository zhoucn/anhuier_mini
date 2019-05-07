// pages/mine/income/income.js
import util from '../../../utils/util'
import check from '../../../utils/check'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    incomeList: [],
    currentPage: 1,
    Load: true,
    time: '',
    device_no: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    if (options.time) {
      if (options.time == 'all') {
        options.time = null
      }
      this.incomeList(options.time)
      this.setData({
        time: options.time
      })
    } else {
      this.incomeDetail(options.device_no)
      this.setData({
        device_no: options.device_no
      })
    }

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
    if (this.data.type) {
      this.incomeList(this.data.time)
    } else {
      this.incomeDetail(this.data.device_no)

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 收益 按时间
   */
  incomeList: function(time) {
    let that = this
    let incomeList = that.data.incomeList
    if (this.data.Load) {
      wx.showLoading({
        title: '加载中',
      })
      check.checkToken({
        success: function () {
          wx.request({
            url: util.urls.driverIncome,
            header: {
              'content-type': 'application/json',
              'Authorization':'Bearer ' + wx.getStorageSync('token')
            },
            data: {
              page: that.data.currentPage,
              time: time
            },
            method: 'POST',
            success: function(info) {
              // console.log(info)
              check.checkHead(info.header);
              if (info.data.code == 0) {
                for (var value of info.data.DriverIncome) {
                  incomeList.push(value)
                }
                that.setData({
                  incomeList: incomeList
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
   * 收益 按机器编号
   */
  incomeDetail: function(device_no) {
    let that = this
    let incomeList = that.data.incomeList
    if (this.data.Load) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: util.urls.DriverIncome,
        header: {
          'content-type': 'application/json',
          'Authorization':'Bearer ' + wx.getStorageSync('token')
        },
        data: {
          page: that.data.currentPage,
          device_no: device_no
        },
        method: 'POST',
        success: function(info) {
          if (info.data.state == 1) {
            for (var value of info.data.DriverIncome) {
              incomeList.push(value)
            }
            that.setData({
              incomeList: incomeList
            })
          } else if (info.data.state == 0) {
            that.setData({
              Load: false
            })
          }
          wx.hideLoading()
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