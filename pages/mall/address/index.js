import util from '../../../utils/util'
import check from '../../../utils/check'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    buy: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.buy){
      this.setData({
        buy: options.buy
      })
    }
    this.getList()
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
  setDefault(e) {
    let that = this
    let id = e.currentTarget.dataset['id']
    wx.request({
      url: util.urls.addressDefault(id),
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      success: function (res) {
        check.checkHead(res.header);
        console.log(res)
        if (res.data.code == 0) {
          wx.showToast({
            title: '设置成功',
            duration: 2000
          })
          that.getList()
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  del(e) {
    let that = this
    let id = e.currentTarget.dataset['id']
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: util.urls.addressDel(id),
            header: {
              'content-type': 'application/json',
              'Authorization': 'Bearer ' + wx.getStorageSync('token')
            },
            method: 'POST',
            success: function (res) {
              check.checkHead(res.header);
              console.log(res)
              if (res.data.code == 0) {
                wx.showToast({
                  title: '删除成功',
                  duration: 2000
                })
                that.getList()
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        }
      }
    })
  },
  getList() {
    let that = this
    wx.request({
      url: util.urls.addressList,
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      success: function(res) {
        check.checkHead(res.header);
        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            addressList: res.data.body
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  edit(e) {
    let that = this;
    let obj = e.currentTarget.dataset.obj;
    let arg = JSON.stringify(obj);
    wx.navigateTo({
      url: '../addAddress/index?arg=' + arg
    })
  },
  setAddress(e) {
    let id = e.currentTarget.dataset['id']
    if(this.data.buy){
      wx.setStorageSync('addrId', id)
      wx.navigateBack({
        delta: 1,
      })
    }else{
      console.log('uuuuu')
    }
  }
})