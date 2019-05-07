// pages/index/index.js
import util from '../../utils/util'
import wxTimer from '../../utils/wxTimer'
import check from '../../utils/check'

var app = getApp();
var timer //计时器
var timer1 //计时器
var timer2 //计时器
var temp_temp = 1
var num = 0
var wxTimers = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '../../static/img/carousel4.jpg',
      '../../static/img/carousel3.jpg',
    ],
    choiceModel: false, //扫码支付modal
    indexModel: true, //首页model
    money: '', //所需费用
    time: null, //按摩时长
    device_no: '', //设备编号
    selectList: [
      {
        'runTime': 300,
        'money': 3
      },
      {
        'runTime': 600,
        'money': 5
      },
      {
        'runTime': 1200,
        'money': 8
      }
    ], //按摩时长选择列表
    login: false, //是否登录
    is_start: false, //是否启动
    countdown: false, //倒计时model
    countDownMinute: '', //倒计时分
    countDownSecond: '', //倒计时秒
    is_stop: false, //是否暂停
    banner: [], //轮播图
    mini: [],
    deviceState: false, //设备状态
    order_no: '', //订单编号
    bannerSrc: util.BANNER + '/',
    miniSrc: util.MINIBANNER + '/',
    wxTimerList: {},
    isDriver: 0,
    freeNum: 0,
    freeList: [],
    endTime: null,
    isAbled: true,
    tId: null,
    backwards: false,
    backwardsNum: 3,
    gift: false,
    active: '',
    dialog: false,
    dialogText: '',
    center: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //扫码按摩
    if (options.scene) {
      this.deviceSatet(options.scene)
      that.setData({
        choiceModel: true,
        device_no: options.scene
      })
    }

    //友情提示
    setTimeout(function () {
      that.carousel_num();
    }, 100);

    //轮播图

    this.banner()
    var that = this;
    temp_temp = 1
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.userInfos()
    if (wxTimers) {
      wxTimers.calibration()
    }

    if (!wx.getStorageSync('token')) {
      this.setData({
        login: false
      })
    } else {
      this.setData({
        login: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      deviceState: false,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(timer)
  },

  /**
   * 时间列表
   */
  getTimeList: function () {
    let that = this
    wx.request({
      url: util.urls.timeList,
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
      success: function (info) {
        that.setData({
          selectList: info.data.body
        })
        if (wx.getStorageSync('isTester') == 1) {
          that.data.selectList.forEach(function (e, i) {
            let moneys = "selectList[" + i + "].money"
            that.setData({
              [moneys]: '0.01'
            })
          })
        } else if (that.data.freeNum > 0) {
          that.setData({
            selectList: that.data.freeList
          })
        }
        that.setData({
          indexModel: false,
          choiceModel: true,
          countdown: false,
        })
      }
    })
  },
  /**
   * 扫码
   */
  scanCode: function () {
    let that = this;
    let scene = ''
    wx.scanCode({
      success: (res) => {
        // console.log(res.path)
        //pages/index/index?scene=898607B8121700080142
        scene = res.path
        scene = scene.split("=")
        if (!that.data.login) {
          that.setData({
            choiceModel: true
          })
        }
        that.setData({
          device_no: scene[1]
        })
        that.deviceSatet(scene[1])
        that.setData({
          time: ''
        })
      }
    })
  },
  /**
   * 单选框
   */
  radioChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  /**
   * 取消
   */
  close: function () {
    this.setData({
      indexModel: true,
      choiceModel: false
    })
  },
  getTime(id) {
    let that = this
    wx.request({
      url: util.urls.expireTime,
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      data: {
        orderNo: id
      },
      method: 'POST',
      success: function (res) {
        console.log('res', res)
        check.checkHead(res.header);
        if (res.data.code == 0) {
          wx.request({
            url: util.urls.miniList,
            header: {
              'content-type': 'application/json',
              'Authorization': 'Bearer ' + wx.getStorageSync('token')
            },
            method: 'POST',
            success: function (r) {
              console.log(r)
              if (r.data.code == 0) {
                that.setData({
                  mini: r.data.body
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: r.data.msg
                })
              }
            }
          })
          that.setData({
            endTime: res.data.body.expireAt,
            backwards: true,
            gift: false,
            active: ''
          })
          let siv = null
          siv = setInterval(function () {
            if (that.data.backwardsNum > 1) {
              that.setData({
                backwardsNum: that.data.backwardsNum - 1
              })
            } else {
              that.setData({
                backwardsNum: 3,
                gift: true
              })
              setTimeout(function () {
                that.setData({
                  active: 'active'
                })
              }, 300)
              clearInterval(siv)
            }
          }, 1000)
          let sid = null
          if (that.data.endTime == null || that.data.endTime == '') {
            sid = setTimeout(function () {
              that.getTime(id)
            }, 2000)
          } else {
            setTimeout(function () {
              wx.hideLoading()
              that.setData({
                countdown: true,
                choiceModel: false,
                indexModel: false
              })
              that.countdown()
            }, 500)
            if (sid) {
              clearTimeout(sid)
            }
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg
          })
        }
      }
    })
  },
  /**
   * 支付
   */
  pay: function () {
    let that = this
    that.setData({
      isAbled: false
    })
    if (that.data.tId) {
      clearInterval(that.data.tId)
    }
    that.setData({
      tId: setTimeout(function () {
        that.setData({
          isAbled: true
        })
      }, 3000)
    })
    that.getMoney()
    // that.setData({
    //   countdown: true,
    //   choiceModel: false,
    //   indexModel: false,
    //   countDownMinute: (that.data.time / 60) - 1,
    //   countDownSecond: 59
    // })
    // setTimeout(function () {
    //   wx.hideLoading()
    //   that.countdown()
    // }, 1000)
    check.checkToken({
      success: function () {
        that.setData({
          login: true
        })
        wx.request({
          url: util.urls.pay,
          header: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + wx.getStorageSync('token')
          },
          data: {
            money: that.data.money,
            deviceNo: that.data.device_no,
            time: that.data.time,
          },
          method: 'POST',
          success: function (info) {
            // console.log(info)
            check.checkHead(info.header);
            if (info.data.code == 0) {
              wx.requestPayment({
                'timeStamp': info.data.body['timeStamp'].toString(),
                'nonceStr': info.data.body['nonceStr'],
                'package': info.data.body['package'],
                'signType': info.data.body['signType'],
                'paySign': info.data.body['paySign'],
                'success': function (res) {
                  wx.setStorageSync('massage', that.data.device_no)
                  temp_temp = 0
                  wx.showLoading({
                    title: '启动中,请稍后',
                  })
                  that.setData({
                    choiceModel: false,
                    order_no: info.data.body['orderNo'],
                    endTime: null
                  })
                  that.getTime(info.data.body['orderNo'])
                  // wx.request({
                  //   url: util.urls.startMachine,
                  //   header: {
                  //     'content-type': 'application/json',
                  //     'Authorization': 'Bearer ' + wx.getStorageSync('token')
                  //   },
                  //   data: {
                  //     orderNo: info.data.body['orderNo'],
                  //     deviceNo: that.data.device_no,
                  //     time: that.data.time,
                  //     money: that.data.money,
                  //     operate: 1
                  //   },
                  //   method: 'POST',
                  //   success: function (re) {
                  //     check.checkHead(re.header);
                  //     if (re.data.code == 0) {
                  //       that.setData({
                  //         countdown: true,
                  //         choiceModel: false,
                  //         indexModel: false,
                  //         countDownMinute: (that.data.time / 60) - 1,
                  //         countDownSecond: 59
                  //       })
                  //       // that.getDeviceInfo()
                  //       setTimeout(function () {
                  //         wx.hideLoading()
                  //         that.countdown()
                  //       }, 1000)
                  //     } else {
                  //       wx.setStorageSync('massage', 0)
                  //       wx.showModal({
                  //         title: '开启提示',
                  //         content: '开启失败',
                  //       })
                  //       wx.hideLoading()
                  //       that.setData({
                  //         indexModel: true,
                  //       })
                  //     }
                  //   }
                  // })
                },
                'fail': function (res) {
                  wx.showModal({
                    title: '支付提示',
                    content: '支付失败，请重新支付',
                  })
                },
                'complete': function (res) {

                }
              })
            } else {
              wx.showModal({
                title: '提示',
                content: info.data.msg
              })
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
   * 获取支付金额
   */
  getMoney: function () {
    for (var value of this.data.selectList) {
      if (value.runTime == this.data.time) {
        this.setData({
          money: value.money
        })
      }
    }
  },

  /**
   * 友情提示
   */
  carousel_num: function () {
    var self = this;
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 8000,
      timingFunction: "linear",
      delay: 0
    })
    self.animation = animation
    animation.translateX(-730).step()
    self.setData({
      animationData_notice: animation.export(),
    })
    setTimeout(function () {
      var animation = wx.createAnimation({
        transformOrigin: "50% 50%",
        duration: 0,
        timingFunction: "linear",
        delay: 0
      })
      self.animation = animation
      animation.translateX(0).step()
      self.setData({
        animationData_notice: animation.export(),
      })
      setTimeout(function () {
        self.carousel_num();
      }, 10)
    }, 8000)
  },
  /**
   * 登录
   */
  onGotUserInfo: function (e) {
    var that = this
    wx.login({
      success: res => {
        var code = res.code;
        // console.log(res.code)
        wx.request({
          url: util.urls.onlogin,
          method: 'POST',
          data: {
            "code": code,
            "rawData": e.detail.rawData,
            "signature": e.detail.signature,
            'iv': e.detail.iv,
            'encryptedData': e.detail.encryptedData,
            "name": e.detail.userInfo.nickName,
            "avatar": e.detail.userInfo.avatarUrl,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (info) {
            // console.log(info);
            if (!info.data.code) {
              wx.setStorageSync('token', info.data.body.token)
              wx.setStorageSync('expiredAt', info.data.body.expiredAt)
              that.setData({
                login: true
              })
              if (wx.getStorageSync('isTester') == 1) {
                that.data.selectList.forEach(function (e, i) {
                  let moneys = "selectList[" + i + "].money"
                  that.setData({
                    moneys: '0.01'
                  })
                })
              }
              that.userInfos()
              app.globalData.is_login = true
              if (that.data.time) {
                that.pay()
              }
            }
          }
        })
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })

  },

  /**
   * 按摩倒计时
   */
  countdown: function () {
    let that = this
    // let Minute = this.data.countDownMinute;
    // let Second = this.data.countDownSecond;
    // Minute > 9 ? Minute = Minute : Minute = '0' + Minute;
    // Second > 9 ? Second = Second : Second = '0' + Second;
    // console.log(Minute)
    // wxTimers = new wxTimer({
    //   beginTime: "00:" + Minute + ':' + Second,
    //   complete: function () {
    //     that.setData({
    //       countdown: false,
    //       indexModel: true
    //     })
    //   }
    // })
    // wxTimers.start(this);
    let t1 = new Date(that.data.endTime).getTime() - new Date().getTime()
    if (t1 > 0) {
      let times = that.timeTranform(parseInt(t1 / 1000))
      if (wxTimers) {
        wxTimers.stop();
      }
      wxTimers = new wxTimer({
        beginTime: times,
        complete: function () {
          that.setData({
            countdown: false,
            choiceModel: false,
            indexModel: true
          })
        }
      })
      wxTimers.start(this)
    } else {
      that.setData({
        countdown: false,
        choiceModel: false,
        indexModel: true
      })
    }
  },
  timeTranform: function (value) {
    let secondTime = parseInt(value);// 秒
    let minuteTime = 0;// 分
    let hourTime = 0;// 小时
    if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
      //获取分钟，除以60取整数，得到整数分钟
      minuteTime = parseInt(secondTime / 60);
      //获取秒数，秒数取佘，得到整数秒数
      secondTime = parseInt(secondTime % 60);
      //如果分钟大于60，将分钟转换成小时
      if (minuteTime > 60) {
        //获取小时，获取分钟除以60，得到整数小时
        hourTime = parseInt(minuteTime / 60);
        //获取小时后取佘的分，获取分钟除以60取佘的分
        minuteTime = parseInt(minuteTime % 60);
      }
    }
    hourTime > 9 ? hourTime = hourTime : hourTime = '0' + hourTime;
    minuteTime > 9 ? minuteTime = minuteTime : minuteTime = '0' + minuteTime;
    secondTime > 9 ? secondTime = secondTime : secondTime = '0' + secondTime;
    return hourTime + ':' + minuteTime + ':' + secondTime;
  },
  /**
   * 停止
   */
  stop: function () {
    let that = this
    wx.showModal({
      title: '停止提示',
      content: '确定要停止按摩吗？',
      success: function (res) {
        if (res.confirm) {
          check.checkToken({
            success: function () {
              that.setData({
                login: true
              })
              wx.request({
                url: util.urls.startMachine,
                data: {
                  orderNo: that.data.order_no,
                  operate: 0
                },
                method: 'POST',
                header: {
                  'content-type': 'application/json',
                  'Authorization': 'Bearer ' + wx.getStorageSync('token')
                },
                success: function (info) {
                  // console.log(info);
                  check.checkHead(info.header);
                  if (info.data.code == 0) {
                    clearTimeout(timer);
                    that.setData({
                      countdown: false,
                      indexModel: true
                    })
                    wx.setStorageSync('massage', 0)
                  } else {
                    wx.showModal({
                      title: '停止提示',
                      content: '停止失败，请重新点击',
                    })
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
        }
      },
    })
  },
  userInfos: function () {
    let that = this;
    try {
      wx.removeStorageSync('isDriver')
      wx.removeStorageSync('isTester')
    } catch (e) {
      console.log(e)
    }
    wx.request({
      url: util.urls.userInfo,
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      success: function (info) {
        check.checkHead(info.header);
        if (info.data.code == 0) {
          that.setData({
            isDriver: info.data.body.isDriver,
            isTester: info.data.body.isTester,
            freeNum: info.data.body.freeNum,
            freeList: info.data.body.list || []
          })
          wx.setStorageSync('isDriver', info.data.body.isDriver)
          wx.setStorageSync('isTester', info.data.body.isTester)
          that.getTimeList()
        } else {
          wx.showModal({
            title: '提示',
            content: info.data.msg
          })
        }
      }
    })
  },
  /**
   * 轮播图
   */
  banner: function () {
    let that = this
    wx.request({
      url: util.urls.banner,
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
      success: function (info) {
        that.setData({
          banner: info.data.body
        })
      }
    })
  },

  /**
   * 垫子状态
   */
  deviceSatet: function (device_no) {
    let that = this
    check.checkToken({
      success: function () {
        that.setData({
          choiceModel: false
        })
        wx.request({
          url: util.urls.deviceStatus,
          method: 'POST',
          header: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + wx.getStorageSync('token')
          },
          data: {
            deviceNo: device_no
          },
          success: function (info) {
            check.checkHead(info.header, info.statusCode, function () {
              that.setData({
                login: false
              })
            });
            // console.log(info);
            if (info.data.code != 0) {
              // wx.showModal({
              //   title: '提示',
              //   content: info.data.msg
              // })
              that.showDialog(info.data.msg);
              that.setData({
                choiceModel: false,
                indexModel: true
              })
            } else {
              that.userInfos()
            }
          }
        })
      },
      fail: function () {
        that.setData({
          deviceState: false,
          choiceModel: true,
          indexModel: true,
          login: false
        })
      },
      complete: function () {

      }
    })
  },

  /**
   * 按摩垫信息
   */
  getDeviceInfo: function () {
    let that = this
    //一分钟还未启动 默认为机器故障
    if (num == 30) {
      wx.hideLoading()
      wx.showModal({
        title: '设备提示',
        content: '很抱歉设备可能出现故障了,本次支付的钱我们将会在1-5个工作日内原路返回给你,祝你有一个愉快的旅程',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            that.setData({
              countdown: false,
              indexModel: true
            })
          }
          //发送停止命令
          wx.request({
            url: util.urls.startMachine,
            data: {
              'device_no': that.data.device_no,
              operate: 0
            },
            method: 'POST',
            header: {
              'content-type': 'application/json',
            },
            success: function (info) {
              if (info.data.state == 0) {
                clearTimeout(timer);
                wx.setStorageSync('massage', 0)
              }
            }
          })
        },
      })
    }
    num++
    wx.request({
      url: util.urls.getDeviceInfo,
      data: {
        device_no: that.data.device_no
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
      success: function (info) {
        if (info.data.device['device_state'] == 1) {
          clearTimeout(timer1);
          that.countdown();
          wx.hideLoading()
          that.setData({
            is_stop: false
          })
          num = 0;
        } else {
          timer1 = setTimeout(function () {
            that.getDeviceInfo()
          }, 2000)
        }
      }
    })
  },

  is_stop: function () {
    let that = this
    wx.request({
      url: util.urls.getDeviceInfo,
      data: {
        device_no: that.data.device_no
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
      success: function (info) {
        if (info.data.device['device_state'] == 2) {
          wx.hideLoading()
          that.setData({
            is_stop: true
          })
          clearTimeout(timer);
          clearTimeout(timer2);
        } else {
          timer2 = setTimeout(function () {
            that.is_stop()
          }, 2000)
        }
      }
    })
  },
  /**
   * 校正按摩时长
   */
  orrection: function () {
    let that = this
    wx.request({
      url: util.urls.getDeviceInfo,
      data: {
        'device_no': wx.getStorageSync('massage')
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
      success: function (info) {
        if (info.data.state == 1) {
          if (info.data.device['time'] - 3 <= 0) {
            clearTimeout(timer);
            that.setData({
              countdown: false,
              indexModel: true
            })
          } else {
            var nowTime = Date.parse(new Date())
            var time = info.data.device['time'] - (nowTime / 1000 - info.data.device['update_at'])
            var minute = parseInt(time / 60);
            var second = time % 60;
            if (time % 60 == 0) {
              second = 59
              --minute;
            }
            if (second < 10) {
              second = '0' + second
            }

            that.setData({
              countDownMinute: minute,
              countDownSecond: second,
            })
          }
        }
      }
    })
  },
  /**
   * 客服
   */
  contact: function () {
    wx.showModal({
      title: '提示',
      content: '确定要拨打客服热线吗？',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '18686659797'
          })
        }
      }
    })
  },
  bannerUrl: function () {
    wx.navigateTo({
      url: '../out/out',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goToMini: function (e) {
    console.log(e)
    let appId = e.target.dataset.appid
    let path = e.target.dataset.path
    wx.navigateToMiniProgram({
      appId: appId,
      path: path,
      extraData: 'anhuier'
    })
  },
  closeGift: function () {
    this.setData({
      backwards: false
    })

  },
  showDialog: function (e) {
    if (e.indexOf("设备正在通信,请稍候再试") > -1) {
      e = "设备可能未通电、信号不好或者刚连电需等三分钟左右才能成功启动"
      this.setData({
        center: null
      })
    } else {
      this.setData({
        center: 'center'
      })
    }
    this.setData({
      dialog: true,
      dialogText: e
    })
  },
  dialogClose: function () {
    this.setData({
      dialog: false
    })
  }
})