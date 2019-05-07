// pages/mine/device/deviceMap/deviceMap.js
var bmap = require('../../../../utils/bmap-wx.js');
var QQMapWX = require('../../../../utils/qqmap-wx-jssdk.js');
import util from '../../../../utils/util'
var wxMarkerData = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    rgcData: {},
    role: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.role) {
      this.setData({
        role: 'proxy'
      })
    } else {
      this.setData({
        role: 'drive'
      })
    }
    let that = this
    wx.request({
      url: util.urls.getDeviceInfo,
      header: {
        'content-type': 'application/json',
      },
      data: {
        'device_no': options.device_no
      },
      method: 'POST',
      success: function(info) {
        if (info.data.state == 1) {
          if (info.data.device['dlat'] && info.data.device['dlng']) {
            // console.log(info.data.device['dlng'])
            var dlng = parseInt(info.data.device['dlng'] / 100) + (info.data.device['dlng'] % 100) / 60
            var dlat = parseInt(info.data.device['dlat'] / 100) + (info.data.device['dlat'] % 100) / 60
            // console.log(dlng)
            // console.log(dlat)
            var locations = dlat + ',' + dlng
            // 实例化API核心类
            var demo = new QQMapWX({
              key: 'EIMBZ-JSQL3-UHH3X-YYJPJ-UFQ3E-HMFDY' // 必填
            });
            //GPS装腾讯地图 39.9077196018,116.3912980130
            wx.request({
              url: 'https://apis.map.qq.com/ws/coord/v1/translate',
              data: {
                'locations': locations,
                'type': 1,
                'key': 'EIMBZ-JSQL3-UHH3X-YYJPJ-UFQ3E-HMFDY'
              },
              method: 'GET',
              dataType: 'json',
              responseType: 'text',
              success: function(res) {
                // console.log(res)
                var wxMarkerData = [{
                  id: 1,
                  latitude: res.data.locations[0]['lat'],
                  longitude: res.data.locations[0]['lng'],
                }]
                that.setData({
                  latitude: res.data.locations[0]['lat'],
                  longitude: res.data.locations[0]['lng'],
                  markers: wxMarkerData
                });
              },
              fail: function(res) {},
              complete: function(res) {},
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '信号不好，无法获取按摩垫地理位置，请稍后再试',
              showCancel: false,
              success: function(res) {
                wx.navigateTo({
                  url: '../device?role=' + that.data.role,
                })
              },
            })
          }
        } else if (info.data.state == 0) {
          wx.showModal({
            title: '提示',
            content: '信号不好，无法获取按摩垫地理位置，请稍后再试',
            showCancel: false,
            success: function(res) {},
          })
        }
      }
    })

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
  makertap: function(e) {
    var that = this;
    var id = e.markerId;
  },
  /**
   * 获取设备信息
   */
  getdeviceInfo: function(device_no) {

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