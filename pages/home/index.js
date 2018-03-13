Page({
  data: {
    baseUrl: "https://m.yixiutech.com/#/sellerHome",
    url: "",
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中...',
    })
    wx.login({
      success: loginRes => {
        let that = this
        wx.request({
          url: 'https://m.yixiutech.com/wx/shop/getOpenid?js_code=' + loginRes.code,
          success: function (openidRes) {
            if (openidRes.data.code === 200){
              let openid = openidRes.data.data.openid
              wx.getUserInfo({
                success: function(userinfoRes){
                  getApp().globalData.userInfo = userinfoRes.userInfo
                  getApp().globalData.openid = openid
                  that.setData({
                      url: `${that.data.baseUrl}?openid=${openid}&avatarUrl=${userinfoRes.userInfo.avatarUrl}`
                  })
                  wx.hideLoading()
                }
              })
            }
          }
        })
      }
    })
  }
})
