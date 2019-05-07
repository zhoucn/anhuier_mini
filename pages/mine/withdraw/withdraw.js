// pages/mine/withdraw/withdraw.js
import util from '../../../utils/util'
import check from '../../../utils/check'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: '', //账户余额
    rmbNumber: '', //提现金额
    button: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAmount()
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
   * 账户余额
   */
  getAmount: function() {
    let that = this
    check.checkToken({
      success: function () {
        that.setData({
          login: true
        })
        wx.request({
          url: util.urls.amount,
          header: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + wx.getStorageSync('token')
          },
          method: 'POST',
          success: function (info) {
            check.checkHead(info.header);
            // console.log(info);
            if (info.data.code == 0) {
              that.setData({
                amount: info.data.body.amount * 1
              })
            } else {

            }
          }
        })
      },
      fail: function () {
        that.setData({
          login: false
        })
      }
    })
  },

  /**
   * 全部提现
   */
  extracting_all: function() {
    this.setData({
      rmbNumber: this.data.amount,
      button: true
    })
  },
  /**
   * 输入金额
   */
  inputRmb: function(e) {
    let num = e.detail.value
    var price = /^[0-9]{1,9}([.]{1}[0-9]{1,2})?$/
    if (price.test(num)) {
      this.setData({
        rmbNumber: num * 1,
      })
      if (Number(num) > 0 && Number(num) <= this.data.amount) {
        this.setData({
          button: true
        })
      } else {
        this.setData({
          button: false
        })
      }
    } else {
      this.setData({
        button: false
      })
    }
  },
  /**
   * 点击提现
   */
  withdraw: function() {
    let that = this
    // console.log(that.data.rmbNumber)
    if (that.data.rmbNumber < 1) {
      wx.showModal({
        title: '提现提示',
        content: '提现金额不得少于1元',
        showCancel: false,
        confirmText: '知道了',
        success: function(res) {
          that.setData({
            button: true
          })
        }

      })
    } else if (that.data.rmbNumber >= 1 && that.data.rmbNumber <= that.data.amount) {
      check.checkToken({
        success: function () {
          wx.request({
            url: util.urls.withdraw,
            header: {
              'content-type': 'application/json',
              'Authorization':'Bearer ' + wx.getStorageSync('token')
            },
            data: {
              'amount': that.data.rmbNumber,
            },
            method: 'POST',
            success: function(info) {
              // console.log(info);
              check.checkHead(info.header);
              if (info.data.code == 0) {
                wx.showModal({
                  title: '提示',
                  content: '提现成功',
                  showCancel: false,
                  confirmText: '确认',
                  success: function(res) {
                    that.setData({
                      button: false,
                      rmbNumber: ''
                    })
                    that.getAmount()
                  }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: info.data.msg,
                  showCancel: false,
                  confirmText: '确认',
                  success: function(res) {
                    that.setData({
                      button: true
                    })
                    that.getAmount()
                  }
                })
              }
            }
          })
        }
      })
    } else if (that.data.rmbNumber > that.data.amount) {
      wx.showModal({
        title: '提现提示',
        content: '提现金额不得大于账户余额',
        showCancel: false,
        confirmText: '确认',
        success: function(res) {
          that.setData({
            button: true,
            is_button: true,
          })
        }
      })
    }
  },
  /**
   * 提现记录
   */
  withdrawDetail: function() {
    wx.navigateTo({
      url: 'withDetail/withDetail',
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