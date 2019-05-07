// pages/mall/addAdderss/index.js
import util from '../../../utils/util'
import check from '../../../utils/check'
Page({
  data: {
    name: null,
    phone: null,
    region: [],
    address: null,
    isDefault: false,
    addrId: null
  },
  onLoad(options) {
    if (JSON.stringify(options) != "{}"){
      let obj = JSON.parse(options.arg);
      this.setData({
        name: obj.name,
        phone: obj.phone,
        region: obj.region,
        address: obj.address,
        isDefault: obj.isDefault,
        addrId: obj.addrId
      })
    }
  },
  onReady() {

  },
  onShow() {

  },
  onHide() {

  },
  onUnload() {

  },
  setName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  setPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  setRegion(e) {
    this.setData({
      region: e.detail.value
    })
  },
  setAddress(e) {
    this.setData({
      address: e.detail.value
    })
  },
  switchChange(e) {
    this.setData({
      isDefault: e.detail.value
    })
  },
  save() {
    let that = this;
    if (!this.data.name) {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none',
        duration: 2500
      })
      return false
    } else if (!this.data.phone) {
      wx.showToast({
        title: '请输入收货人手机号',
        icon: 'none',
        duration: 2500
      })
      return false
    } else if (this.data.region == []) {
      wx.showToast({
        title: '请选择省市区',
        icon: 'none',
        duration: 2500
      })
      return false
    } else if (!this.data.address) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 2500
      })
      return false
    } else {
      wx.request({
        url: util.urls.address,
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        method: 'POST',
        data: {
          name: that.data.name,
          phone:that.data.phone,
          region: that.data.region,
          address: that.data.address,
          isDefault: that.data.isDefault,
          addrId: that.data.addrId
        },
        success: function(res) {
          check.checkHead(res.header);
          console.log(res)
          if(res.data.code == 0){
            wx.showToast({
              title: '新增成功',
              success: function() {
                setTimeout(function(){
                  wx.navigateTo({
                    url: '../address/index'
                  })
                },2000)
              }
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
    }

  }
})