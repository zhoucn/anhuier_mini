import util from '../../../utils/util'
import check from '../../../utils/check'
Page({
  data: {
    count: 0,
    price: 0,
    selectId: [],
    seAll: false,
    imgUrl: util.IMGURL + '/',
    goodsList: []
  },
  onLoad() {
    
  },
  onReady() {

  },
  onShow() {
    this.getList()
    this.setData({
      count: 0,
      price: 0,
      selectId: [],
      seAll: false
    })
  },
  onHide() {

  },
  getList() {
    let that = this
    wx.request({
      url: util.urls.buyCarList,
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      success: function (res) {
        check.checkHead(res.header);
        console.log(res)
        if (res.data.code == 0) {
          let arr = []
          res.data.body.forEach(e => {
            e.checkbox = false
            arr.push(e)
          })
          that.setData({
            goodsList: arr
          })
          console.log(that.data.goodsList)
        }
      }
    })
  },
  reduce(e) {
    let that = this;
    let index = e.currentTarget.dataset['index'] * 1;
    let id = e.currentTarget.dataset['id']
    let goodsNum = 'goodsList[' + index + '].goodsNum';
    this.setData({
      [goodsNum]: that.data.goodsList[index].goodsNum - 1
    })
    that.updataBuyCar(id, 'dec')
    this.handleCount();
  },
  add(e) {
    let that = this;
    let index = e.currentTarget.dataset['index'] * 1;
    let id = e.currentTarget.dataset['id']
    let goodsNum = 'goodsList[' + index + '].goodsNum';
    this.setData({
      [goodsNum]: that.data.goodsList[index].goodsNum + 1
    })
    that.updataBuyCar(id,'inc')
    this.handleCount();
  },
  updataBuyCar(id,type) {
    wx.request({
      url: util.urls.updataCar(id),
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      data: {
        type: type
      },
      method: 'POST',
      success: function (res) {
        check.checkHead(res.header);
        console.log(res)
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  checkboxChange(j) {
    let that = this;
    this.setData({
      selectId: j.detail.value
    })
    this.data.goodsList.forEach(function (e,i) {
      let index = that.data.selectId.indexOf(e.goodsId + '');
      let checkbox = 'goodsList[' + i + '].checkbox';
      if(index > -1){
        that.setData({
          [checkbox]: true
        })
      }else{
        that.setData({
          [checkbox]: false
        })
      }
    })
    let len = this.data.goodsList.length;
    if (len == this.data.selectId.length){
      this.setData({
        seAll: true
      })
    }else{
      this.setData({
        seAll: false
      })
    }
    this.handleCount();
  },
  handleCount() {
    let that = this;
    this.setData({
      count: 0,
      price: 0
    })
    this.data.goodsList.forEach(function (e) {
      if (e.checkbox) {
        that.setData({
          count: that.data.count + e.goodsNum
        })
        that.setData({
          price: that.data.price + e.goodsNum * (e.goodsPrice * 1)
        })
      }
    })
    this.setData({
      price: this.data.price.toFixed(2)
    })
  },
  selectAll(e) {
    let that = this;
    this.setData({
      seAll: !that.data.seAll
    })
    // console.log(that.data.seAll)
    this.setData({
      count: 0,
      price: 0
    })
    if (that.data.seAll){
      let sid = []
      that.data.goodsList.forEach(function(e,i){
        let checkbox = 'goodsList[' + i + '].checkbox';
        if(e.isOnline == 1){
          that.setData({
            [checkbox]: true
          })
          sid.push(e.goodsId)
        }
      })
      that.setData({
        selectId: sid
      })
      this.data.goodsList.forEach(function (e) {
        if (e.checkbox) {
          that.setData({
            count: that.data.count + e.goodsNum
          })
          that.setData({
            price: that.data.price + e.goodsNum * (e.goodsPrice * 1)
          })
        }
      })
      this.setData({
        price: this.data.price.toFixed(2)
      })
    }else{
      that.data.goodsList.forEach(function (e,i) {
        let checkbox = 'goodsList[' + i + '].checkbox';
        that.setData({
          [checkbox]: false,
          price: 0,
          selectId: []
        })
      })
    }
  },
  longpress(e) {
    let that = this
    let id = e.currentTarget.dataset['id']
    let index = e.currentTarget.dataset['index']
    wx.showActionSheet({
      itemList: ['删除'],
      success: function(res) {
        wx.request({
          url: util.urls.delCar(id),
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
                title: '删除成功'
              })
              that.data.goodsList.splice(index, 1)
              if (that.data.selectId.indexOf(id) > -1){
                that.data.selectId.splice(that.data.selectId.indexOf(id), 1)
              }
              that.setData({
                goodsList: that.data.goodsList,
                selectId: that.data.selectId
              })
              that.handleCount()
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
    })
  },
  account() {
    let obj = {}
    obj.goodsId = this.data.selectId
    obj.type = 1
    obj.price = this.data.price
    obj.count = this.data.count
    let arr = []
    this.data.goodsList.forEach(e => {
      if(e.checkbox){
        arr.push(e)
      }
    })
    obj.info = arr
    obj = JSON.stringify(obj)
    wx.navigateTo({
      url: '../buy/index?info=' + obj,
    })
  }
})