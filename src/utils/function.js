import { MessageBox, Message, Loading } from 'element-ui'

//金额 大小写转换 ------ 传入小写金额, 返回大写金额
export function convertCurrency(money) {
    let cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
    let cnIntRadice = new Array('', '拾', '佰', '仟');
    let cnIntUnits = new Array('', '万', '亿', '兆');
    let cnDecUnits = new Array('角', '分', '毫', '厘');
    let cnInteger = '整';
    let cnIntLast = '圆'; //元
    let maxNum = 999999999999999.9999;
    let integerNum;
    let decimalNum;
    let chineseStr = '';
    let parts;
    if (money == '') { return ''; }
    money = parseFloat(money);
    if (money >= maxNum) {
        return '';
    }
    if (money == 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
    }
    money = money.toString();
    if (money.indexOf('.') == -1) {
        integerNum = money;
        decimalNum = '';
    } else {
        parts = money.split('.');
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
    }
    if (parseInt(integerNum, 10) > 0) {
        let zeroCount = 0;
        let IntLen = integerNum.length;
        for (let i = 0; i < IntLen; i++) {
            let n = integerNum.substr(i, 1);
            let p = IntLen - i - 1;
            let q = p / 4;
            let m = p % 4;
            if (n == '0') {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    chineseStr += cnNums[0];
                }
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
            }
        }
        chineseStr += cnIntLast;
    }
    if (decimalNum != '') {
        let decLen = decimalNum.length;
        for (let i = 0; i < decLen; i++) {
            let n = decimalNum.substr(i, 1);
            if (n != '0') {
                chineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
        }
    }
    if (chineseStr == '') {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (decimalNum == '') {
        chineseStr += cnInteger;
    }
    return chineseStr;
}

//根据税盘信息获取 /companyDiskTicketType/getDiskTicketType根据税盘信息获取票种类型
/**
 * @param {string} str  ‘004,005’类似这种
 * @returns {Array} 数组  数组对象
 */
export function UtilsGetTicketType(str) {
    let typObj = {
        '004': '增值税专用发票',
        '007': '增值税普通发票',
        '025': '卷式发票',
        '026': '电子普通发票',
        '028': '电子专用发票',
        '005': '机动车销售统一发票',
    }
    str = str.split(',')
    let result = []
    for (let i = 0; i < str.length; i++) {
        result.push({ value: str[i], label: typObj[str[i]] })
    }
    return result
}

//下载excel pdf文件
/**
 * @param result后端返回的数据
 * @returns
 */
export function downloadFile(result) {

    const data = result.data
    if (!data) {
        Message({
            message: '数据打包异常请稍后再试',
            type: 'error',
        })
        return
    }
    const r = new FileReader()
    r.onload = function() {
        try {
            const resData = JSON.parse(data) // 为FileReader获取blob数据转换为json后的数据，即后台返回的原始数据
                // 如果执行到这里，说明下载报错了，进行后续处理
            Message({
                message: '数据打包异常请稍后再试',
                type: 'error',
            })
        } catch (err) {
            // 下载正常处理
            // 获取文件名
            let fileName = result.headers['content-disposition']
            if (fileName && fileName.length >= 2) {
                fileName = fileName.split('=')[1]
            }
            fileName = decodeURIComponent(fileName)
                // 兼容ie11
            if (window.navigator.msSaveOrOpenBlob) {
                try {
                    const blobObject = new Blob([data])
                    window.navigator.msSaveOrOpenBlob(blobObject, fileName)
                } catch (e) {
                    console.log(e)
                }
                return
            }
            // a标签实现下载
            let url = window.URL.createObjectURL(new Blob([data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
                //resolve(fileName)
        }
    }
    r.readAsText(data)
}

export function downloadFile1(result) {

  const data = result.data
  if(!data){
    var enc = new TextDecoder('utf-8') 
var res = JSON.parse(enc.decode(new Uint8Array(result))) //转化成json对象
 Message({
  message: res.msg,
  type: 'error',
})

return;

  }

          // 下载正常处理
          // 获取文件名
          let fileName = result.headers['content-disposition']
          if (fileName && fileName.length >= 2) {
              fileName = fileName.split('=')[1]
          }
          fileName = decodeURIComponent(fileName)
              // 兼容ie11
          if (window.navigator.msSaveOrOpenBlob) {
              try {
                  const blobObject = new Blob([data],{type:'application/zip'})
                  window.navigator.msSaveOrOpenBlob(blobObject, fileName)
              } catch (e) {
                  console.log(e)
              }
              return
          }
          // a标签实现下载
          let url = window.URL.createObjectURL(new Blob([data],{type:'application/zip'}))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
              //resolve(fileName)

  r.readAsText(data)
}

/**
 * @param 传入待转地址
 * @returns base64地址
 */
export function getBase64(url, callback) {
    var Img = new Image(),
        URL = '';
    Img.src = url + "?v=" + Math.random(); // 处理缓存,fix缓存bug,有缓存，浏览器会报错;
    Img.setAttribute("crossOrigin", 'Anonymous') // 解决控制台跨域报错的问题
    Img.onload = function() { //要先确保图片完整获取到，这是个异步事件
        var canvas = document.createElement("canvas"),
            width = Img.width,
            height = Img.height;
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(Img, 0, 0, width, height);
        URL = canvas.toDataURL('image/jpeg'); //转换图片为URL
        callback ? callback(URL) : null; //调用回调函数
    };
    // 使用方式： getBase64( 'url', (URL) => { console.log(URL) } )
}

//bolob文件转base64
/**
 * @param j接口返回的流
 * @returns base64地址
 */
export function blobToBase64(result) {

    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            resolve(e.target.result);
        };
        // readAsDataURL
        fileReader.readAsDataURL(result.data);
        fileReader.onerror = () => {
            reject(new Error('blobToBase64 error'));
        };
    });
    //调用
    //blobToBase64(blob).then(res => {
    //  // 转化后的base64
    //  console.log('base64', res)
    //})
}

// return new Promise((resolve, reject) => {
//     const fileReader = new FileReader();
//     fileReader.onload = (e) => {
//         resolve(e.target.result);
//     };
//     // readAsDataURL
//     fileReader.readAsDataURL(result.data);
//     fileReader.onerror = () => {
//         reject(new Error('blobToBase64 error'));
//     };
// });
//调用
//blobToBase64(blob).then(res => {
//  // 转化后的base64
//  console.log('base64', res)
//})

// 数字位数限制
// 校验数字长度-- data待校验数据 / len1整数最大长度 / len2小数长度 --返回符合长度要求的字符串
export function checkNum(data, len1, len2) {
    let str = data + ''
    if (str) {
        let num = validDotNum(str)
        if (num > 1) {
            return ''
        }
        if (num == 1) {
            if (str.indexOf('.') != 0 && str.indexOf('.') != str.length - 1) {
                let res = validFloatDate(str, len1, len2)
                console.log('res', res);
                return res
            } else if (str.indexOf('.') == str.length - 1) {
                return str
            } else {
                return ''
            }
        }
        if (num == 0) {
            //整数首位为0
            if (str.length > 1 && str.charAt(0) == 0) {
                return ''
            }
            //整数
            if (str.length > len1) {
                return str.substring(0, len1)
            } else {
                return str
            }
        }
    } else {
        return ''
    }
}
// 校验小数点出现次数
function validDotNum(str) {
    let index = str.indexOf('.'); // 字符出现的位置
    let num = 0; // 这个字符出现的次数
    while (index !== -1) {
        num++;
        index = str.indexOf('.', index + 1); // 从字符串出现的位置的下一位置开始继续查找
    }
    return num
}
// 校验小数并限制长度
function validFloatDate(str, len1, len2) {
    if (str.indexOf('.') > -1) {
        let arr = str.split('.')
        let beg = arr[0]
        let end = arr[1]
        if (beg && end) {
            if (beg.length > 1) {
                if (beg.charAt(0) == 0) {
                    return ''
                } else {
                    if (beg.length > len1) {
                        beg = beg.substring(0, len1)
                    }
                }
            }
            if (end.length > len2) {
                end = end.substring(0, len2)
            }
            return beg + '.' + end
        } else {
            return ''
        }
    }
}


// 过滤数组对象中重复的对象
export function deteleObject(obj) {
    var uniques = [];
    var stringify = {};
    for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i]);
        keys.sort(function(a, b) {
            return (Number(a) - Number(b));
        });
        var str = '';
        for (var j = 0; j < keys.length; j++) {
            str += JSON.stringify(keys[j]);
            str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
            uniques.push(obj[i]);
            stringify[str] = true;
        }
    }
    uniques = uniques;
    return uniques;
}


// 对数组 对象进行排序  eg: arr.sort(createComprisonFunction("key"));
export function createComprisonFunction(propertyName){
    return function(object1,object2){
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if(value1 < value2){
            return -1;
        }else if(value1 > value2){
            return 1;
        }else{
            return 0;
        }
    }
}

export function GetDateTime(){
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
    month =month<10?"0" + month : month
var days = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
var day = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")[date.getDay()];
var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
var currentTime = year + "-" + month + "-" +days + " " + hour + ":" + minute + ":" +second 
return currentTime
}

//防抖函数

export function debounce(fn,delay){
    let timer = null //借助闭包
    return function() {
        if(timer){
            clearTimeout(timer) 
        }
        timer = setTimeout(fn,delay) // 简化写法
    }
}