/**
 * 文件工具
 * @type {{}}
 */
let wpUploadFileTools = {
    /**
     * 获取文件显示模版
     * @param fileItem
     */
    wapFileItemShow:function(fileItem) {
        let suffix = wpUploadFileTools.getSuffixNameByFileName(fileItem.name);
        let show = wpUploadFileTools.resolvingShow(fileItem);
        let showIcon = wpUploadFileShowResolving.getFileItemShowIcon(show,fileItem);
        let fileItemShow = {
            // 文件的id
            id: wpUploadFileTools.uuid(),
            // 文件对象
            file:fileItem,
            // 文件的类型
            type:fileItem.type,
            // 文件的大小
            size:fileItem.size,
            // 文件的名字
            name:fileItem.name,
            // 后缀
            suffix:suffix,
            // 显示的类型
            show:show,
            // 显示的图标或者图片地址
            showIcon:showIcon,
            // 显示进度条
            processStatus:{
                show: false,
                width: 0,
                isFail: false
            },
            // 状态0未上传,失败也会转到0，1正在上传，2已经上传
            status:0

        }
        return fileItemShow;
    },
    /**
     * 获取文件名后缀
     * @param fileName 文件名全名
     * */
    getSuffixNameByFileName:function(fileName){
        let str = fileName;
        let index = str.lastIndexOf(".");
        if (index < 0) {
            return "";
        }
        let pos = index+1;
        return str.substring(pos,str.length);
    },
    /**
     * 解析显示类型
     * @param fileItem 文件
     * @returns {number}
     */
    resolvingShow:function (fileItem) {
        // 默认0普通文件
        let showResult = 0;
        if(wpUploadFileTypeResolving.isImg(fileItem)) {
            showResult = 1;
        } else if(wpUploadFileTypeResolving.isVideo(fileItem)) {
            showResult = 2;
        } else if(wpUploadFileTypeResolving.isAudio(fileItem)) {
            showResult = 3;
        } else if(wpUploadFileTypeResolving.isDoc(fileItem)) {
            showResult = 4;
        } else if(wpUploadFileTypeResolving.isExcel(fileItem)) {
            showResult = 5;
        } else if(wpUploadFileTypeResolving.isPPT(fileItem)) {
            showResult = 6;
        } else if(wpUploadFileTypeResolving.isPdf(fileItem)) {
            showResult = 7;
        } else if(wpUploadFileTypeResolving.isZip(fileItem)) {
            showResult = 8;
        } else if(wpUploadFileTypeResolving.isWeb(fileItem)) {
            showResult = 9;
        } else if(wpUploadFileTypeResolving.isTxt(fileItem)) {
            showResult = 10;
        } else if(wpUploadFileTypeResolving.isPsd(fileItem)) {
            showResult = 11;
        } else if(wpUploadFileTypeResolving.isCad(fileItem)) {
            showResult = 12;
        } else if(wpUploadFileTypeResolving.isIso(fileItem)) {
            showResult = 13;
        } else if(wpUploadFileTypeResolving.isExe(fileItem)) {
            showResult = 14;
        }
        return showResult
    },
    /**
     * 生成UUID
     * @returns {string}
     */
    uuid:function () {
        var s = []
        var hexDigits = "0123456789abcdef"
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
        }
        s[14] = "4"
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
        s[8] = s[13] = s[18] = s[23] = "-"
        var uuid = s.join("")
        return uuid
    },
    /**
     * 禁止某个dom的某个事件
     */
    disableObjEvent(domObj,eventName) {
        domObj.addEventListener(eventName,function (e) {
            e.preventDefault();
        })
    }
}
/**
 * 数据操作工具
 * @type {{}}
 */
let wpUploadDataTools = {
    /**
     * 初始化对象数据，设置默认值
     * @param dataObj
     * @param value
     */
    initDataInfoWithDefaultValue(dataObj, value) {
        var keys = Object.keys(dataObj);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            dataObj[key] = value;
        }
    },
    /**
     * 初始化对象数据,全部设置为空
     * @param dataObj
     */
    initDataInfo(dataObj) {
        wpUploadDataTools.initDataInfoWithDefaultValue(dataObj, "");
    },
    /**
     * 初始化对象进行赋值，全部设置为空
     * @param dataObj
     * @param valueObj
     */
    initDataInfoWithValue(dataObj, valueObj) {
        var keys = Object.keys(dataObj);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            dataObj[key] = valueObj[key];
        }
    },
    /**
     * 拷贝有效的数据
     * @param valueObj
     * @returns {{}}
     */
    copyValidValue(valueObj) {
        var dataObj = {};
        var keys = Object.keys(valueObj);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (wpUploadDataValid.isValid(valueObj[key])) {
                dataObj[key] = valueObj[key];
            }
        }
        return dataObj;
    },
    dateFormat (fmt, date) {
        if (!fmt || !date) {
            return date;
        }
        const opt = {
            "y+": date.getFullYear().toString(),        // 年
            "M+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "m+": date.getMinutes().toString(),         // 分
            "s+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            let ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    }
}
/**
 * 数据验证工具
 * @type {{isValid: wpUploadDataValid.isValid}}
 */
let wpUploadDataValid = {
    isValid:function (obj) {
        if(undefined === obj || null === obj) {
            return false;
        }
        return true;
    },
    isValidStr:function(str) {
        let isValidObj = wpUploadDataValid.isValid(str);
        if(!isValidObj) {
            return isValidObj;
        }
        str = str.trim();
        if("" == str || '' == str) {
            return false;
        }
        return true;
    }
}
/**
 * 文件类型解析
 * @type {{isImg: wpUploadFileTypeResolve.isImg}}
 */
let wpUploadFileTypeResolving = {
    /**
     * 是否是一张图片
     */
    isImg:function (fileItem) {
        return wpUploadFileTypeResolving.resolvingByType(fileItem.type,/image\/(\w)*/)
    },
    /**
     * 是否是视频
     */
    isVideo:function (fileItem) {
        return wpUploadFileTypeResolving.resolvingByType(fileItem.type,/video\/(\w)*/)
    },
    /**
     * 是否是音频
     */
    isAudio:function (fileItem) {
        return wpUploadFileTypeResolving.resolvingByType(fileItem.type,/audio\/(\w)*/)
    },
    /**
     * 是否是doc文件
     */
    isDoc:function (fileItem) {
        let checkSuffixArray = ['doc','docx','dot','dotx'];
        return wpUploadFileTypeResolving.resolvingByName(fileItem.name,checkSuffixArray);
    },
    /**
     * 是否是excel文件
     */
    isExcel:function (fileItem) {
        let checkSuffixArray = ['xls','xlsx','csv','xlt','xltx'];
        return wpUploadFileTypeResolving.resolvingByName(fileItem.name,checkSuffixArray);
    },
    /**
     * 是否是PPT文件
     */
    isPPT:function (fileItem) {
        let checkSuffixArray = ['ppt','pptx','pot','potx','odp'];
        return wpUploadFileTypeResolving.resolvingByName(fileItem.name,checkSuffixArray);
    },
    /**
     * 是否是Pdf文件
     */
    isPdf:function (fileItem) {
        let checkSuffixArray = ['pdf'];
        return wpUploadFileTypeResolving.resolvingByName(fileItem.name,checkSuffixArray);
    },
    /**
     * 是否是压缩文件
     * @param fileItem
     * @returns {boolean}
     */
    isZip:function (fileItem) {
        let checkSuffixArray = ['zip','7z','war','tar','rar','jar','zipx','zix','zoo'];
        return wpUploadFileTypeResolving.resolvingByName(fileItem.name,checkSuffixArray);
    },
    isWeb:function (fileItem) {
        let checkSuffixArray = ['html','htm'];
        return wpUploadFileTypeResolving.resolvingByName(fileItem.name,checkSuffixArray);
    },
    isTxt:function (fileItem) {
        let checkSuffixArray = ['txt'];
        return wpUploadFileTypeResolving.resolvingByName(fileItem.name,checkSuffixArray);
    },
    isPsd:function (fileItem) {
        let checkSuffixArray = ['psd'];
        return wpUploadFileTypeResolving.resolvingByName(fileItem.name,checkSuffixArray);
    },
    isCad:function (fileItem) {
        let checkSuffixArray = ['cad'];
        return wpUploadFileTypeResolving.resolvingByName(fileItem.name,checkSuffixArray);
    },
    isIso:function (fileItem) {
        let checkSuffixArray = ['iso'];
        return wpUploadFileTypeResolving.resolvingByName(fileItem.name,checkSuffixArray);
    },
    isExe:function (fileItem) {
        let checkSuffixArray = ['exe'];
        return wpUploadFileTypeResolving.resolvingByName(fileItem.name,checkSuffixArray);
    },
    /**
     * 根据文件类型来解析
     * @param fileType 文件类型
     * @param checkTypeModel 文件类型模型，如：image\/(\w)*
     * @returns {boolean}
     */
    resolvingByType:function(fileType,checkTypeModel) {
        if (checkTypeModel.test(fileType)) {
            return true;
        }
        return false;
    },
    /**
     * 根据名字和名字后缀名来验证文件
     * @param fileName 文件名
     * @param checkSuffixArray 文件类型包含的后缀
     */
    resolvingByName:function (fileName,checkSuffixArray) {
        let suffixName = wpUploadFileTools.getSuffixNameByFileName(fileName);
        // 名字是否有效
        if(!wpUploadDataValid.isValidStr(suffixName)) {
            // 无效直接返回false
            return false;
        }
        suffixName = suffixName.trim();
        suffixName = suffixName.toLowerCase();
        if(checkSuffixArray.indexOf(suffixName) != -1) {
            return true;
        }
        return false;
    }

}
/**
 * 文件显示解析
 * @type {{getFileItemShowIcon: (function(*, *=): string), getImgUrlOfLocal: (function(*=): string)}}
 */
let wpUploadFileShowResolving = {
    /**
     * 获取文件显示图标
     * @param show
     * @param fileItem
     * @returns {string}
     */
    getFileItemShowIcon:function(show,fileItem) {
        let showIcon = '';
        switch (show) {
            case 0: showIcon = "#icon-yunpanlogo-3";break;
            // 图片
            case 1: showIcon = wpUploadFileShowResolving.getImgUrlOfLocal(fileItem); break;
            // 视频
            case 2: showIcon = "#icon-yunpanlogo-6"; break;
            // 音乐
            case 3: showIcon = "#icon-yunpanlogo-4"; break;
            // doc
            case 4: showIcon = "#icon-yunpanlogo-2"; break;
            // excel
            case 5: showIcon = "#icon-yunpanlogo-"; break;
            // ppt
            case 6: showIcon = "#icon-yunpanlogo-1"; break;
            // pdf
            case 7: showIcon = "#icon-yunpanlogo-12"; break;
            // zip
            case 8: showIcon = "#icon-yasuobao"; break;
            // web文件
            case 9: showIcon = "#icon-yunpanlogo-5"; break;
            // txt文件
            case 10: showIcon = "#icon-yunpanlogo-7"; break;
            // PSD
            case 11: showIcon = "#icon-yunpanlogo-10"; break;
            // cad
            case 12: showIcon = "#icon-yunpanlogo-11"; break;
            // ISO
            case 13: showIcon = "#icon-yunpanlogo-8"; break;
            // 可执行
            case 14: showIcon = "#icon-yunpanlogo-9"; break;
            // 普通文件
            default: showIcon = "#icon-yunpanlogo-3";
        }
        return showIcon;
    },
    /**
     * 获取图片文件的本地路径
     * @param fileItem 文件对象
     */
    getImgUrlOfLocal:function(fileItem){
        // 获取文件路径
        let imgUrlStr = "";
        if (window.createObjectURL !== undefined) { //  basic
            imgUrlStr = window.createObjectURL(fileItem);
        } else if (window.URL !== undefined) { // mozilla(firefox)
            imgUrlStr = window.URL.createObjectURL(fileItem);
        } else if (window.webkitURL !== undefined) { // webkit or chrome
            imgUrlStr = window.webkitURL.createObjectURL(fileItem);
        }
        return imgUrlStr;
    }
}
/**
 * 信息提示工具
 * @type {{}}
 */
let wpUploadFileAlert = {
    /**
     * 错误提示
     * @param message 提示信息
     */
    "error" : function (message) {
        console.error(message)
    },
    /**
     * 普通信息提示
     * @param message 提示信息
     */
    "info" : function(message) {
        console.info(message);
    },
    /**
     * 警告提醒
     * @param message 提示信息
     */
    "warn" : function (message) {
        console.warn(message);
    }
}
/**
 * 提示信息
 * @type {{outMaxFileNumber: (function(*): string)}}
 */
let wpUploadFileMessage = {
    /**
     * 超出最大文件限制
     * @param maxFileNumber 最大文件数量
     * @return {string} 返回信息内容
     */
    outMaxFileNumber(maxFileNumber) {
        return "文件数量错误：最多只能上传"+maxFileNumber+"个文件"
    },
    /**
     * 没有文件可以上传
     */
    noFileNeedUpload:"没有文件可以上传",
    /**
     * 上传地址无效
     */
    uploadUrlError:"上传地址无效",
    /**
     * 上传失败
     */
    uploadFail:"上传失败",
    /**
     * 正在上传无法执行的操作
     * @param takename 操作名称
     */
    isUpload(takeName){
        return "正在上传，无法执行【"+takeName+"】操作";
    },
    /**
     * 采用了自动上传
     * @param takeName
     * @returns {string}
     */
    isUploadAuto(takeName) {
        return "采用了自动上传，不能进行【"+takeName+"】操作"
    }
}

export {
    wpUploadFileTools,
    wpUploadDataTools,
    wpUploadDataValid,
    wpUploadFileTypeResolving,
    wpUploadFileShowResolving,
    wpUploadFileAlert,
    wpUploadFileMessage
}