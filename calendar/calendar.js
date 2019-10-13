Component({
    options: {
        styleIsolation: 'isolated'
    },

    properties: {
        // 当前日期
        date: {
            type: Number,
            value: null,
        },

        // 是否显示本月以外的日期
        onlyShowCurrentMonthDays: {
            type: Boolean,
            value: true,
            observer: function(newVal, oldVal) {
                console.log("onlyShowCurrentMonthDays-->" + newVal)

            }
        }


    },

    observers: {
        'date' (date) {
            this.initCalendar()
        }
    },


    data: {
        //当前日历页显示的日期
        daysOfThisPage: {},

        calendars: {},

        currentYear: {},
        currentMonth: {},
        currentDay: {},
    },

    lifetimes: {
        attached: function() {
            this.initCalendar()
        },
    },


    methods: {
        /**
         * 初始化日历
         */
        initCalendar() {
            let mc = this.data.date;
            let date = null
            if (mc == 0) {
                date = new Date()
            } else {
                date = new Date(mc)
            }
            this.setData({
                currentYear: date.getFullYear(),
                currentMonth: date.getMonth(),
                currentDay: date.getDate(),
                // daysOfThisPage: this.getDaysOfThisPage(date)
                calendars: this.getCalendars(new Date(2019, 9, 13), new Date(2021, 11, 13))
            })
        },

        getCalendars(startDate, endDate) {
            let startYear = startDate.getFullYear()
            let startMonth = startDate.getMonth()
            let endYear = endDate.getFullYear()
            let endMonth = endDate.getMonth()

            let calendars = []
            if (startYear > endYear) {
                return
            } else if (startYear === endYear) {
                if (startMonth > endMonth) {
                    return
                }
                // 月份数量
                let monthCount = this._getMonthSize(startDate, endDate)

                let year = startYear
                let month = startMonth
                // 生成月份日历
                for (let i = 0; i < monthCount; i++) {

                    let calendar = new CalendarEntity()
                    calendar.year = year
                    calendar.month = month
                    calendar.dayItems = this.getDaysOfThisPage(new Date(year, month, 1))
                    calendars.push(calendar)

                    month++

                }
            } else {
                let year = startYear

                let month = startMonth
                let monthCount = this._getMonthSize(startDate, endDate)
                // 生成月份日历
                for (let n = 0; n <= monthCount; n++) {
                    let date = new Date(year, month, 1)
                    var calendar = new CalendarEntity(date.getFullYear(), date.getMonth(), this.getDaysOfThisPage(date))
                    calendars.push(calendar)
                    month++
                }

            }
            return calendars

        },

        /**
         * 获取两个两个日期之间相隔的月份数量
         */
        _getMonthSize: function(startDate, endDate) {
            let startYear = startDate.getFullYear()
            let endYear = endDate.getFullYear()
            let startMonth = startDate.getMonth()
            let endMonth = endDate.getMonth()
            if (startYear > endYear) {
                return 0
            } else if (startYear === endYear) {
                return endMonth - startMonth + 1
            } else {
                if (endYear - startYear > 1) {
                    return (12 - startMonth) + ((endYear - startYear - 1) * 12) + (endMonth + 1)
                } else {
                    return (12 - startMonth) + (endMonth + 1)
                }
            }
        },

        /**
         * 获取在本页显示的日期
         */
        getDaysOfThisPage: function(date) {
            return this.getDaysOfLastMonthInThisPage(date).concat(this.getDaysOfMonth(date)).concat(this.getDaysOfNextMonthInThisPage(date))
        },

        /**
         * 获取当前月的天
         */
        getDaysOfMonth: function(date) {
            //本月最大天数
            let maxDay = this.getMaxDay(date.getFullYear(), date.getMonth());
            let days = [];
            for (let i = 0; i < maxDay; i++) {
                days[i] = new DayEntity(i + 1)
                days[i].isCurrentMonth = true
                // 当天
                if ((i + 1) === date.getDate()) {
                    days[i].isCurrentDay = true
                }
            }
            return days
        },

        /**
         * 获取在本月含有的上一个月的天，即1号之前的天
         */
        getDaysOfLastMonthInThisPage: function(date) {
            let year = date.getFullYear()
            let month = date.getMonth()
            //本月1号的日期
            let firstDay = new Date(year, month, 1)
            //获取该天是星期几
            let dayOfWeek = firstDay.getDay()
            //上个月的最后一天
            let theLastDayOfLastMonth = this.getMaxDay(year, month - 1)
            //拿到最后的几天
            let days = [];
            for (let i = 0; i < dayOfWeek; i++) {
                days[i] = new DayEntity(theLastDayOfLastMonth - dayOfWeek + i + 1)
            }
            return days
        },

        /**
         * 获取在本月含有的上一个月的天，即本月最后一天之后的天
         */
        getDaysOfNextMonthInThisPage: function(date) {
            let year = date.getFullYear()
            let month = date.getMonth()
            //本月的最后一天
            let theLastDayOfMonth = this.getMaxDay(year, month)
            //本月最后一天的日期
            let theLastDay = new Date(year, month, theLastDayOfMonth)
            //获取该天是星期几
            let dayOfWeek = theLastDay.getDay()

            //拿到最前面的几天
            let days = [];
            //本周剩余天数
            let count = 7 - dayOfWeek - 1
            for (let i = 0; i < count; i++) {
                days[i] = new DayEntity(i + 1)
            }
            return days
        },

        /**
         * 获取某年某月的最大天数
         * @month 从0计数
         */
        getMaxDay(year, month) {
            month += 1
            if (month == 4 || month == 6 || month == 9 || month == 11)
                return 30;
            if (month == 2)
                if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0)
                    return 29;
                else
                    return 28;
            return 31;
        },
    }
})

/**
 * 日期实体类
 */
class DayEntity {
    /**
     * 日期
     */
    day = 1

    /**
     * 是否为当天
     */
    isCurrentDay = false

    /**
     * 是否为当月
     */
    isCurrentMonth = false

    constructor(day) {
        this.day = day
    }
}

class CalendarEntity {
    year = 1970
    month = 0
    dayItems = []
    constructor(year, month, dayItems) {
        this.year = year
        this.month = month
        this.dayItems = dayItems
    }
}