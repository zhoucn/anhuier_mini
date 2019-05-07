// pages/mine/addDevice/addDevice.js
import util from '../../../utils/util'
import check from '../../../utils/check'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceNo: '', //垫子的编号
    name: '', //姓名
    IDCard: '', //姓名
    phone: '', //姓名
    captcha: '',
    carNo: '', //姓名
    company: '', //姓名
    year: '', //姓名
    startTime: '00:00', //开始时间
    endTime: '00:00', //结束时间
    address: '', //姓名
    is_device: true, //该按摩垫是否还可以绑定
    is_driver: false,
    infoBox: false,
    protocol: true,
    // cName: '',
    // cPhone: '',
    contract: '', //合同
    IDCardPhoto: '', //身份证照片
    model1: false,
    model2: false,
    IDCardImg: [],
    codeTime: 0
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
  scanCode: function() {
    let scene = ''
    wx.scanCode({
      success: (res) => {
        scene = res.path
        scene = scene.split("=")
        // console.log(scene['1'])
        this.setData({
          deviceNo: scene['1']
        })
        this.canBDriver()
      }
    })
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
  captchaValue: function (e) {
    this.setData({
      captcha: e.detail.value
    })
  },
  companyValue: function(e) {
    this.setData({
      company: e.detail.value
    })
  },
  sendCode: function(){ //发送验证码
    let that = this;
    if (that.data.phone.length < 11) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '手机号码格式不正确',
      })
    }else{
      let t = null;
      that.setData({
        codeTime: 60
      })
      t = setInterval(function(){
        if(that.data.codeTime > 0) {
          that.setData({
            codeTime: that.data.codeTime - 1
          })
        }else{
          clearInterval(t)
        }
      },1000)
      wx.request({
        url: util.urls.sendsmscode,
        data: {
          phone: that.data.phone
        },
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        method: 'POST',
        success: function(info){
          // console.log(info);
          check.checkHead(info.header);
          if(info.data.code != 0){
            that.setData({
              codeTime: 0
            })
            wx.showModal({
              title: '提示',
              content: info.data.msg,
              showCancel: false
            })
          }
        }
      })
    }
  },
  /**
   * 按摩垫是否还可以绑定司机
   */
  canBDriver: function() {
    let that = this
    wx.request({
      url: util.urls.canBDriver,
      header: {
        'content-type': 'application/json',
      },
      data: {
        deviceNo: that.data.deviceNo, //垫子的编号
      },
      method: 'POST',
      success: function(info) {
        if (info.data.state == 1) {
          that.setData({
            is_device: true
          })
        } else if (info.data.state == 2) {
          that.setData({
            is_driver: true,
            is_device: true
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '该垫子已被别人注册',
          })
        }
      }
    })

  },
  registerDriver: function() {  //注册司机
    let that = this
    check.checkToken({
      success: function () {
        wx.request({
          url: util.urls.registerDriver,
          header: {
            'content-type': 'application/json',
            'Authorization':'Bearer ' + wx.getStorageSync('token')
          },
          data: {
            driverName: that.data.name,
            IDCard: that.data.IDCard,
            driverPhone: that.data.phone,
            captcha: that.data.captcha,
            company: that.data.company
          },
          method: 'POST',
          success: function(info) {
            // console.log(info);
            check.checkHead(info.header);
            if (info.data.code == 0) {
              wx.setStorageSync('isDriver', 1)
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
            } else {
              wx.showModal({
                title: '提示',
                content: info.data.msg,
                showCancel: false,
              })
            }
          }
        })
      }
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