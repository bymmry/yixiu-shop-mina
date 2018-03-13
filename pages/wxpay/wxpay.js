// pages/wxpay/wxpay.js
const app = getApp();
import config from '../../utils/config'


Page({
  data: {
    payInfo: "",
    orderId: ""
  },
  onLoad: function (options) {
    let that = this;
    let jumpUrl = options.jumpUrl;
    let payInfo = JSON.parse(options.payInfo);
    this.data.orderId = options.orderId;
    console.log(options);
    console.log(payInfo);
    this.data.payInfo = payInfo;

    wx.request({
      url: `${config.url}/wx/order/sign`,
      data: {
        total_fee: payInfo.payment,
        // total_fee: 1,
        openid: app.globalData.openid
      },
      method: "POST",
      success: function (res) {
        if (res.data.code == 200) {
          let pay = res.data.data;
          console.log(pay);
          that.pay(pay, jumpUrl);
        }

      },
      fail: function (err) {
        console.log(err);
      }
    })
  },
  pay: function (pay, jumpUrl) {
    let that = this;
    let currentTime = new Date().getTime().toString();
    let nonce_str = that.getRandom();

    //success
        // wx.navigateBack();

    wx.requestPayment({
      timeStamp: pay.timeStamp,
      nonceStr: pay.nonceStr,
      package: pay.package,
      signType: 'MD5',
      paySign: pay.paySign,
      success: function (data) {
        console.log(data);
        if (data.errMsg == "requestPayment:ok"){
          console.log(that.data.orderId);
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
          })
          wx.request({
            url: `${config.url}/order/paySuccess/${that.data.orderId}`,
            method: "GET",
            success: function (res) {
              console.log("支付成功");
              that.paySuccess(jumpUrl);
            },
            fail: function (err) {
              console.log(err);
            }
          })
          that.paySuccess(jumpUrl);
        }

        //success
        // wx.navigateBack();
      },
      fail: function (res) {
        wx.showToast({
          title: '支付失败',
          duration: 2000
        })
        that.paySuccess(jumpUrl);

      }
    })
  },
  paySuccess: function (jumpUrl) {
    let currentTime = new Date().getTime();
    let url = jumpUrl + encodeURIComponent(`?payResult=1&time=${currentTime}`);
    app.globalData.paySuccessUrl = url;
    app.globalData.payState = 1;
    console.log(url);
    wx.navigateBack();
  },
  getRandom: function(){
    return Math.random().toString(36).substr(2, 15)
  }
})