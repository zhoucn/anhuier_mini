// pages/mine/addDevice/addProxy/addProxy.js
import util from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    device: [],
    device1: [],
    munber: '',
    money: '',
    name: '',
    IDCard: '',
    phone: '',
    check: [],
    city: '',
    protocol: true,
    page: true,
    region: {},
    // customItem: '全部'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.selectDevice()
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
   * 获取垫子信息
   */
  selectDevice: function() {
    let device = []
    let that = this
    wx.request({
      url: util.urls.selectDevice,
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
      success: function(info) {
        for (var value of info.data) {
          device.push(value)
        }
        that.setData({
          device: device,
          device1: device
        })
      }
    })
  },
  /**
   * 选择的垫子
   */
  checkboxChange: function(e) {
    console.log(e.detail.value)
    let check = e.detail.value
    let num = 0;
    let money = 0;
    for (var value of check) {
      for (var value1 of this.data.device) {
        if (value == value1['device_no']) {
          num++
          money = money + Number(value1['money'])
        }
      }
    }
    this.setData({
      'number': num,
      'money': money,
      'check': check
    })
  },
  /**
   * 按收益排序
   */
  byIncome: function() {
    let device = []
    let that = this
    wx.request({
      url: util.urls.byIncome,
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
      success: function(info) {
        var data = info.data
        for (var value of data) {
          device.push(value)
        }
        that.setData({
          device: device,
          device1: device
        })
      }
    })
  },
  deviceNoValue: function(e) {
    console.log(e.detail.value)
    let searchValue = []
    let device = this.data.device1
    if (e.detail.value != '') {
      for (var value of device) {
        if (value['device_no'].search(e.detail.value) != -1) {
          searchValue.push(value)
        }
      }
      this.setData({
        device: searchValue,
      })
    } else {
      this.setData({
        device: this.data.device1,
      })
    }

  },
  /**
   * 获取输入框的值
   */
  nameValue: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  IDCardValue: function(e) {
    this.setData({
      IDCard: e.detail.value
    })
  },
  phoneValue: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  cityValue: function(e) {
    this.setData({
      city: e.detail.value
    })
  },
  checkbox: function(e) {
    if (e.detail.value.length > 0) {
      this.setData({
        protocol: false,
      })
    } else {
      this.setData({
        protocol: true,
      })
    }
  },

  /**
   * 个人信息检查
   */
  userInfo: function() {
    let that = this
    if (this.data.name && this.data.IDCard && this.data.phone && this.data.city) {
      if (this.data.phone.length < 11) {
        wx.showModal({
          title: '提示',
          content: '手机号码格式不正确',
        })
      } else {
        wx.request({
          url: util.urls.addProxy,
          header: {
            'content-type': 'application/json',
          },
          data: {
            name: that.data.name,
            IDCard: that.data.IDCard,
            tel: that.data.phone,
          },
          method: 'POST',
          success: function(info) {
            if (info.data.state == 1) {
              that.setData({
                'page': false
              })
            } else {
              wx.showModal({
                title: '提示',
                content: info.data.massage,
              })
            }
          }
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请完成必填项',
      })
    }
  },
  /**
   * 生成合同
   */
  addContract: function() {
    let that = this
    if (this.data.phone.length < 11) {
      wx.showModal({
        title: '提示',
        content: '手机号码格式不正确',
      })
    } else if (this.data.money) {
      wx.request({
        url: util.urls.addProxy,
        header: {
          'content-type': 'application/json',
          'Authorization':'Bearer ' + wx.getStorageSync('token')
        },
        data: {
          device_no: that.data.check, //垫子的编号
          name: that.data.name,
          IDCard: that.data.IDCard,
          tel: that.data.phone,
          city: that.data.city,
          num: that.data.num,
          money: that.data.money,
        },
        method: 'POST',
        success: function(info) {
          if (info.data.state == 1) {
            that.addProxy()
          } else if (info.data.state == 2) {
            wx.showModal({
              title: '提示',
              content: '请先挑选垫子',
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '垫子被别人抢先一步代理了，请重新选择吧',
            })
          }
        }

      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先挑选垫子',
      })
    }
  },
  /**
   * 
   */
  addProxy: function() {
    let that = this
    wx.request({
      url: util.urls.pay,
      header: {
        'content-type': 'application/json',
        'Authorization':'Bearer ' + wx.getStorageSync('token')
      },
      data: {
        money: that.data.money,
      },
      method: 'POST',
      success: function(info) {
        if (info.data.state == 1) {
          wx.requestPayment({
            'timeStamp': info.data.parameters['timeStamp'].toString(),
            'nonceStr': info.data.parameters['nonceStr'],
            'package': info.data.parameters['package'],
            'signType': 'MD5',
            'paySign': info.data.parameters['paySign'],
            'success': function(res) {
              if (info.data.state == 1) {
                wx.showModal({
                  title: '提示',
                  content: '注册成功',
                  showCancel: false,
                  success: function(res) {
                    if (res.confirm) {
                      wx.switchTab({
                        url: '../index/index',
                      })
                    }
                  }
                })
              }
            },
            'fail': function(res) {
              wx.request({
                url: util.urls.addProxy,
                header: {
                  'content-type': 'application/json',
                  'Authorization':'Bearer ' + wx.getStorageSync('token')
                },
                method: 'POST',
              })
            }
          })
        }
      }
    })
  },
  /**
   * 垫子收益详情
   */
  incomeDetail: function(e) {
    wx.navigateTo({
      url: '../income/income?device_no=' + e.currentTarget.dataset.device_no
    })
  },
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      city: e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
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