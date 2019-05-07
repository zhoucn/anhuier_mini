//const BASEURL = 'http://api.anhuier.local';
const BASEURL = 'https://api.anhuier.net';
const DOMAIN = BASEURL + '/mini/v1/';
const BANNER = BASEURL + '/storage/banner';
const MINIBANNER = BASEURL + '/storage/jump';
const IMGURL = BASEURL + '/storage/shop/img';
const INFOURL = BASEURL + '/storage/shop/info';
const HELPURL = BASEURL + '/storage/help/';
const urls = {
  onlogin: DOMAIN + 'auth/login', //登录
  isToken: DOMAIN + 'auth/refresh', //Tsoken是否过期
  orderList: DOMAIN + 'orderList', //查询订单列表 
  expireTime: DOMAIN + 'expireTime', //查询订单列表 
  sendsmscode: DOMAIN + 'sendCode' ,//获取验证码
  registerDriver: DOMAIN + 'registerDriver',//注册车主
  pay: DOMAIN + 'createOrder',//微信支付
  paymentFail: DOMAIN + 'paymentFail', //支付失败
  deviceBindInfo: DOMAIN + 'deviceBindInfo', //扫码绑定设备检测状态
  bindDevice: DOMAIN + 'bindDevice', //扫码绑定按摩垫
  startMachine: DOMAIN +'startMachine',//启动,停止机器
  timeList: DOMAIN +'timeList', //时间列表
  driverIncome: DOMAIN +'driverIncome',//司机收益
  amount: DOMAIN + 'amount', //余额收益
  banner: DOMAIN + 'banner', // 首页广告
  miniList: DOMAIN + 'jump', // 首页广告
  deviceStatus: DOMAIN + 'deviceStatus',//垫子状态
  addDriver: DOMAIN + 'addDriver' ,//添加司机
  driverInfo: DOMAIN + 'driverInfo', //司机信息
  withdraw: DOMAIN +'withdraw',//提现
  logout: DOMAIN +'auth/logout',//注销
  withdrawRecord: DOMAIN +'withdrawRecord',//提现记录
  userInfo: DOMAIN + 'userInfo', //用户信息,
  mallIndex: DOMAIN + 'shop/goods/list', //商城首页
  goodsInfo: function(id) { return DOMAIN + 'shop/goods/'+ id + '/info'}, //商品详情
  updataCar: function(id) { return DOMAIN + 'shop/cart/' + id + '/update'}, //更新购物车
  delCar: function(id) { return DOMAIN + 'shop/cart/' + id + '/del' }, //删除购物车
  buyCarList: DOMAIN + 'shop/cart/list', //购物车列表
  address: DOMAIN + 'addr/save', //新增编辑地址
  addressList: DOMAIN + 'addr/list', //地址列表
  addressDel: function(id) { return DOMAIN + 'addr/' + id + '/del' }, //删除地址
  addressDefault: function(id) { return DOMAIN + 'addr/' + id + '/default' }, //设为默认地址
  goodsOrder: DOMAIN + 'shop/order/createOrder', //商城下单
  goodsOrderList: DOMAIN + 'shop/order/list', //订单列表
  orderPay: function (id) { return DOMAIN + 'shop/order/' + id + '/pay' }, //重新付款
  orderCancel: function (id) { return DOMAIN + 'shop/order/' + id + '/cancel' }, //取消订单
  orderDel: function (id) { return DOMAIN + 'shop/order/' + id + '/del' }, //删除订单
  orderConfirm: function (id) { return DOMAIN + 'shop/order/' + id + '/confirm' }, //确认收货
  orderInfo: function (id) { return DOMAIN + 'shop/order/' + id + '/info'}, //订单详情
  help: DOMAIN + 'help', //帮助教程
}
module.exports = {
  urls,
  DOMAIN,
  BANNER,
  IMGURL,
  INFOURL,
  HELPURL,
  MINIBANNER
}
