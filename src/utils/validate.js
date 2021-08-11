/**
 * @param {string} phone 手机号
 * @returns {Boolean}
 */
export function validPhone(phone) {
    phone = phone ? phone : ''
  //return /^(13|15|17|18|19)\d{9}$/.test(phone)
    // return /^(1)\d{10}$/.test(phone)
    return /^1[3456789]\d{9}$/.test(phone)
}

/**
 * @param {string} content 文本域textarea输入的内容（包含字母数字汉字）
 * @param {Nmuber} number 最大可以多少个字符
 * @returns {object} {flag:boolen, len:number}
 */
export function validStrCheckLengthTextarea(content, Maxnumber) {
    var i, sum, index;
    sum = content.length;
    // for (i = 0; i < content.length; i++) {
    //     if (Number(sum) > Maxnumber) {
    //         index = i
    //         break
    //     }
    // }
    if (Number(sum) > Maxnumber) {
        index = Maxnumber
    }
    return { flag: Number(sum) <= Maxnumber ? true : false, len: index ? index : '' };
    //var i, sum, index;
    //sum = 0;
    //content = content.replace(/(^\s*)|(\s*$)/g, "");
    //for (i = 0; i < content.length; i++) {
    //    if ((content.charCodeAt(i) >= 0) && (content.charCodeAt(i) <= 255)) {
    //        sum = sum + 1;
    //    } else {
    //        sum = sum + 2;
    //    }
    //
    //    if (Number(sum) > Maxnumber) {
    //        index = i
    //        break
    //    }
    //}
    //return { flag: Number(sum) <= Maxnumber ? true : false, len: index ? index : '' };
}

/**
 * @param {string} content 输入的内容（包含字母数字汉字）
 * @param {Nmuber} number 最大可以多少个字符
 * @returns {Boolean}
 */
export function validStrCheckLength(content, Maxnumber) {
    var i, sum;
    console.log(content)
    sum = content !== null ? content.length : 0;
    return Number(sum) < Maxnumber;



    //var i, sum;
    //sum = 0;
    //content = content.replace(/(^\s*)|(\s*$)/g, "");
    //for (i = 0; i < content.length; i++) {
    //    if ((content.charCodeAt(i) >= 0) && (content.charCodeAt(i) <= 255))
    //        sum = sum + 1;
    //    else
    //        sum = sum + 2;
    //}
    //return Number(sum) < Maxnumber;
}

/**
 * @param {string} content 输入的内容（包含字母数字汉字）
 * @param {Nmuber} number 最大可以多少个字符
 * @returns {Boolean}
 */
export function validStrCheckLength1(content, Maxnumber) {
    var i, sum;
    console.log(content)
    sum = content == undefined ? 0 : content.length;
    return Number(sum) < Maxnumber;


    //var i, sum;
    //sum = 0;
    //content = content.replace(/(^\s*)|(\s*$)/g, "");
    //for (i = 0; i < content.length; i++) {
    //    if ((content.charCodeAt(i) >= 0) && (content.charCodeAt(i) <= 100))
    //        sum = sum + 1;
    //    else
    //        sum = sum + 2;
    //}
    //return Number(sum) < Maxnumber;
}

/**
 * @param {string} content 输入的内容（包含字母数字汉字）
 * @param {Nmuber} minnumber 最小可以多少个字符
 * @param {Nmuber} maxnumber 最大可以多少个字符
 * @returns {Boolean}
 */
export function validStrCheckLengthtoLength(content, minnumber, maxnumber) {
    var i, sum;
    sum = content.length;
    return Number(sum) < maxnumber && Number(sum) > minnumber;


    //var i, sum;
    //sum = 0;
    //for (i = 0; i < content.length; i++) {
    //    if ((content.charCodeAt(i) >= 0) && (content.charCodeAt(i) <= 255))
    //        sum = sum + 1;
    //    else
    //        sum = sum + 2;
    //}
    //return Number(sum) < maxnumber && Number(sum) > minnumber;
}

/**
 * @param {string} str 验证正整数[1,9]
 * @returns {Boolean}
 */
export function validPositiveNumber(str) {
    return /^[1-9]\d*$/.test(str)

}

/**
 * @param {string} str 必须正数，可以为小数，最多保留6位
 * @returns {Boolean}
 */
export function validZXNumber6(str) {
    return /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,6})?$/.test(str)

}

// export function validZXNumber7(str) {

//     const p = String(str).split('.')[1]
//     if ((p && p.length >= 9) || str.length > 20 || Number(str) < 0) return false
//     return true

// }

/**
 * @param {string} str 验证邮箱 以数字字母开头中间可以多个数字字母下划线或_ 带有@符号 后面是数字字母 和 .后加2-4个字母结尾
 * @returns {Boolean}
 */
export function validEamil(str) {
    //return  /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(str)
    return /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/.test(str)
}

/**
 * @param {string} str 折扣率 0＜折扣率≤100，只能输入（不包含0）0-100（包含100）的数字，最多匹配四位小数
 * @returns {Boolean}
 */
export function validDiscount4(str) {
    return /^(100|100\.0{1,4}|[1-9]\d{0,1}|[1-9]\d{0,1}\.\d{1,4}|[0-9]\.\d{1,4})$/.test(str)
}

/**
 * @param {string} str 折扣金额  只能输入数字，最多匹配两位小数
 * @returns {Boolean}
 */
export function validDisAmount2(str) {
    return /^([1-9]\d*?|[1-9]\d*?\.\d{1,2}|0\.\d{1,2})$/.test(str)
}


/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
    const valid_map = ['admin', 'editor']
    return valid_map.indexOf(str.trim()) >= 0
}

//商品管理新增商品校验。


/**
 * @param {string} content 输入的内容（包含字母数字汉字）
 * @param {Nmuber} number 最大可以多少个字符
 * @returns {Boolean}
 */
export function validStrCheckLengthGoods(content, Maxnumber) {

    return Number(content.length) < Maxnumber

    //
    //var i, sum;
    //  sum = 0;
    //  content = content.replace(/(^\s*)|(\s*$)/g, "");
    //  for (i = 0; i < content.length; i++) {
    //      if ((content.charCodeAt(i) >= 0) && (content.charCodeAt(i) <= 50))
    //          sum = sum + 1;
    //      else
    //          sum = sum + 2;
    //  }
    //  return Number(sum) < Maxnumber;
}
