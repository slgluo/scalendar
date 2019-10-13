const app = getApp()

Page({
    onLoad: function() {
        this.initCalendar()
    },

    initCalendar: function() {
        let date = new Date(2019, 9, 13).getTime()
        this.setData({
            date: date
        })
    }
})