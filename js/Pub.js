'use strict';
class Pub {
    //获取属性 getStyle(目标，属性)
    static getStyle(obj, attr = '') {
        //判断IE8浏览器
        return getComputedStyle(obj) ? getComputedStyle(obj)[attr] : obj.currentStyle[attr];
    }

    //添加类名 addClassName(目标，类名)
    static addClassName(obj, str = '') {
        const arr = obj.className.split(' ').concat(str.split(' '));
        for (let i = 0; i < arr.length; i++) {
            for (let j = arr.length; j > i; j--) {
                if (arr[i] == arr[j]) arr.splice(j, 1);
            }
            //第一个空格杀掉后面的空格，然后自杀
            if (arr[i] == '') arr.splice(i--, 1);
        }
        obj.className = arr.join(' ');
    }

    //移除类名 addClassName(目标，类名)
    static removeClassName(obj, str = '') {
        const current = obj.className.split(' ');
        const remove = str.split(' ');
        remove.push(''); //清除current中的所有空格
        for (let i = 0; i < remove.length; i++) {
            for (let j = 0; j < current.length; j++) {
                if (current[j] == remove[i]) current.splice(j--, 1);
            }
        }
        obj.className = current.join(' ');
    }

    //添加事件 addEvent(目标，事件类型，处理函数，是否捕捉)
    static addEvent(obj, eventType, fn, boolean = false) {
        //兼容firefox 鼠标滚动事件
        if (window.navigator.userAgent.indexOf('Firefox') != -1 && eventType == 'mousewheel') eventType = 'DOMMouseScroll';
        //把处理函数赋值给obj，便于后面的清除
        if (obj[`${eventType}sign`] == undefined || obj[`${eventType}sign`] == []) obj[`${eventType}sign`] = [];
        obj[`${eventType}sign`].push(handle);
        obj.addEventListener
            ? obj.addEventListener(eventType, obj[`${eventType}sign`][obj[`${eventType}sign`].length - 1], boolean)
            : obj.attachEvent(`on${eventType}`, obj[`${eventType}sign`][obj[`${eventType}sign`].length - 1]);
        //滚动函数event对象处理
        function handle(event) {
            event = event || window.event;
            event.wheel = event.wheelDelta ? -event.wheelDelta / 120 : event.detail / 3;
            fn(event);
        }
        // console.log(obj,`添加了eventType事件：${obj[`${eventType}sign`].length}个`);
    }
    //移除事件 removeEvent(目标，事件类型，是否捕捉)
    static removeEvent(obj, eventType, boolean = false) {
        if (window.navigator.userAgent.indexOf('Firefox') != -1 && eventType == 'mousewheel') eventType = 'DOMMouseScroll';
        for (let i = obj[`${eventType}sign`].length - 1; i >= 0; i--) {
            obj.removeEventListener
                ? obj.removeEventListener(eventType, obj[`${eventType}sign`][i], boolean)
                : obj.detachEvent(`on${eventType}`, obj[`${eventType}sign`][i]);
            obj[`${eventType}sign`].splice(i, 1);
            // obj[`${eventType}sign`].pop();
        }
        // console.log(obj,`移除了eventType事件：${obj[eventType].length}个`);
    }

    //随机产生rgba形式的颜色 randomColor()
    static randomColor() {
        const [r, g, b, a] = [
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.random().toFixed(2)
        ];
        return `rgba(${r},${g},${b},${a})`;
    }

    //worldTime(时区数字) 东八区+8,西八区-8
    static worldTime(timeZone = 8) {
        const now = new Date();
        const targetTime = new Date(now.getTime() + now.getTimezoneOffset() * 60 * 1000 + timeZone * 60 * 60 * 1000);
        const { year, month, dat, week, hours, minutes, seconds, arr } = {
            year: targetTime.getFullYear().toString(),
            month: (targetTime.getMonth() + 1).toString().padStart(2, 0),
            dat: targetTime
                .getDate()
                .toString()
                .padStart(2, 0),
            week: targetTime.getDay().toString(),
            hours: targetTime
                .getHours()
                .toString()
                .padStart(2, 0),
            minutes: targetTime
                .getMinutes()
                .toString()
                .padStart(2, 0),
            seconds: targetTime
                .getSeconds()
                .toString()
                .padStart(2, 0),
            arr: ['日', '一', '二', '三', '四', '五', '六']
        };
        return `${year}年${month}月${dat}日 星期${arr[week]} ${hours}时${minutes}分${seconds}秒`;
    }

    //倒计时countTime（目标时间）字符串格式："2018/06/01 00:00:00"
    static countTime(targetTime) {
        const offsetTime = new Date(targetTime).getTime() - new Date().getTime();
        const { day, hours, minutes, seconds } = {
            day: Math.floor(offsetTime / 1000 / 60 / 60 / 24),
            hours: Math.floor((offsetTime / 1000 / 60 / 60) % 24),
            minutes: Math.floor((offsetTime / 1000 / 60) % 60),
            seconds: Math.ceil((offsetTime / 1000) % 60)
        };
        return `${day}天${hours}小时${minutes}分${seconds}秒`;
    }

    //阻止默认事件  preventDefault({事件类型：被阻止对象})
    static preventDefault(obj) {
        // console.log(this);
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                this.addEvent(
                    obj[key],
                    key,
                    event => {
                        event.preventDefault();
                    },
                    false
                );
            }
        }
        return this;
    }

    //获取cookie getCookie(key)
    static getCookie(key) {
        const val = document.cookie.match(new RegExp(`\\b${key}=([^;]*)(;|$)`));
        return val ? val[1] : '';
    }

    //设置cookie setCookie(data, time)
    static setCookie(data, time) {
        const date = new Date(new Date().getTime() + time * 24 * 60 * 60 * 1000).toUTCString();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                document.cookie = `${key}=${data[key]}; expires=${date}`;
            }
        }
    }

    //删除cookie removeCookie(key)
    static removeCookie(key) {
        const json = {};
        json[key] = '';
        this.setCookie(json, -1);
    }

    //删除所有cookie removeAllCookie();
    static removeAllCookie() {
        const arr = document.cookie.match(new RegExp('(\\w+)=[^;]*', 'g'));
        // console.log(arr);
        if (arr) {
            for (const iterator of arr) {
                this.removeCookie(iterator.match(new RegExp('\\w+'))[0]);
            }
        }
    }

    //{ timeCurrent, count, timeLast }
    static visitData() {
        // 数据获取处理存储
        let { timeCurrent, count, timeLast } = {
            timeCurrent: this.worldTime(),
            count: this.getCookie('count'),
            timeLast: this.getCookie('time')
        };
        count ? count++ : (count = 1);
        this.setCookie({ time: timeCurrent }, 7);
        this.setCookie({ count: count }, 7);
        return { timeCurrent, count, timeLast };
    }
}
