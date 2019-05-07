// pages/mine/device/device.js
import util from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    device: [],
    searchValue: [],
    is_search: false,
    is_proxy: false, //是否是代理
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.role == 'proxy') {
      this.setData({
        is_proxy: true
      })
    } else {
      this.setData({
        is_proxy: false
      })
    }

    // this.getdeviceInfo()
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
   * 司机垫子信息
   */
  getdeviceInfo: function() {
    let that = this
    let device = []
    wx.request({
      url: util.urls.getDeviceInfo,
      header: {
        'content-type': 'application/json',
        'Authorization':'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      success: function(info) {
        // console.log(info)
        if (info.data.state == 1) {
          for (var value of info.data.device) {
            if (value['use_state'] == 0) {
              value['use_state'] = '停止'
            } else if (value['use_state'] == 2) {
              value['use_state'] = '暂停'
            } else {
              value['use_state'] = '开启'
            }
            device.push(value)
          }
          that.setData({
            device: device
          })
        } else if (info.data.state == 0) {

        }
      }
    })
  },


  /**
   * 搜索
   */
  search: function(e) {
    let searchValue = []
    for (var value of this.data.device) {
      if (value['device_no'].search(e.detail.value) != -1) {
        searchValue.push(value)
      }
    }
    this.setData({
      searchValue: searchValue,
    })
    if (e.detail.value) {
      this.setData({
        is_search: true
      })
    }
  },

  /**
   * 详情
   */
  incomeDetail: function(e) {
    wx.navigateTo({
      url: '../income/income?device_no=' + e.currentTarget.dataset.device_no
    })
  },
  /**
   * 垫子的位置信息
   */
  deviceMap: function(e) {
    wx.navigateTo({
      url: 'deviceMap/deviceMap?device_no=' + e.currentTarget.dataset.device_no + '&role=' + this.data.is_proxy
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

  },
  bindDevice: function(){
    let scene = ''
    wx.scanCode({
      success: (res) => {
        // console.log(res.path)
        scene = res.path.split("=")[1]
        wx.request({
          url: util.usls.deviceBindInfo,
          header: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + wx.getStorageSync('token')
          },
          method: 'POST',
          data: {
            deviceNo: scene
          },
          success: function (info) {
            // console.log(info);
            if (info.data.code == 0){
              wx.request({
                url: util.urls.bindDevice,
                header: {
                  'content-type': 'application/json',
                  'Authorization': 'Bearer ' + wx.getStorageSync('token')
                },
                method: 'POST',
                data: {
                  deviceNo: scene
                },
                success: function (info) {
                  // console.log(info);
                }
              })
            }else{
              
            }
          }
        })
      }
    })
  }
})