<template>
  <div class="wp-upload">
    <!--总进度条-->
    <div class="wp-upload-sum-progress" :class="{fail: isUploadFail}" v-show="sumProgressStatus.show">
      <div class="wp-upload-sum-progress-inner" :class="{fail: isUploadFail}"
           :style="{width: sumProgressStatus.width + '%'}"></div>
    </div>
    <!--选择文件-->
    <input class="wp-upload-input-select-file" :id="fileInputId" type="file" :multiple='type == "multiple"'
           style="display: none" @change="fileSelectChange"/>
    <!--文件本体-->
    <div class="wp-upload-container" v-if="showModel == 'grid'">
      <div class="wp-upload-list-container">
        <div class="wp-upload-list-item" v-for="showItem in fileShowArray">
          <div class="icon-img" :show="showItem.show" :name="showItem.name">
            <template v-if="showItem.show == 1">
              <img class="show-img" :src="showItem.showIcon" :alt="showItem.name"/>
            </template>
            <template v-else>
              <svg class="show-icon icon" aria-hidden="true">
                <use :xlink:href="showItem.showIcon"></use>
              </svg>
            </template>
          </div>
          <div class="process" v-show="showItem.processStatus.show">
            <div class="process-inner" :class="{fail : showItem.processStatus.isFail}"
                 :style="{width : showItem.processStatus.width + '%'}"></div>
          </div>
          <div class="menus">
            <div class="file-name">{{ showItem.name }}</div>
            <div class="menu-list">
              <div class="menu-item" v-if="showItem.show==1 || showItem.show==2 || showItem.show==3"
                   @click="showSource(showItem)">
                <span class="iconfont icon-fangdajing"></span>
              </div>
              <div class="menu-item" @click="deleteFile(showItem.id)" v-show="showItem.fileSource == 0 || enableDelete">
                <span class="iconfont icon-shanchu1"></span>
              </div>
            </div>
            <div class="status" :class="{success: showItem.status==2,isupload: showItem.status==1}"></div>
          </div>
        </div>
        <div class="wp-upload-button-select-file" @click="selectFile" v-show="selectFileShow && enableSelect">
          <span class="iconfont icon-icon--tianjia"></span>
        </div>
      </div>
    </div>
    <div class="wp-upload-container-list" v-if="showModel == 'list'">
      <div class="wp-upload-button-select-file-list" @click="selectFile" v-show="selectFileShow && enableSelect">
        <span class="iconfont icon-icon--tianjia"></span><span>添加文件</span>
      </div>
      <div class="wp-upload-files-contain-list">
        <div class="wp-upload-files-contain-list-item" v-for="showItem in fileShowArray">
          <div class="file-item-base">
            <div class="icon-img" :show="showItem.show" :name="showItem.name">
              <template v-if="showItem.show == 1">
                <img class="show-img" :src="showItem.showIcon" :alt="showItem.name"/>
              </template>
              <template v-else>
                <svg class="show-icon icon" aria-hidden="true">
                  <use :xlink:href="showItem.showIcon"></use>
                </svg>
              </template>
            </div>
            <div class="file-info">
              <div class="file-name">{{ showItem.name }}</div>
              <div class="file-size">{{ computerSize(showItem.size) }}</div>
              <div class="process" v-show="showItem.processStatus.show">
                <div class="process-inner" :class="{fail : showItem.processStatus.isFail}"
                     :style="{width : showItem.processStatus.width + '%'}"></div>
              </div>
            </div>

          </div>
          <div class="file-item-menu">
            <div class="menu-list">
              <div class="menu-item" v-if="showItem.show==1 || showItem.show==2 || showItem.show==3"
                   @click="showSource(showItem)">
                <span class="iconfont icon-fangdajing"></span>
              </div>
              <div class="menu-item" @click="deleteFile(showItem.id)" v-show="showItem.fileSource == 0 || enableDelete">
                <span class="iconfont icon-shanchu1"></span>
              </div>
            </div>
            <div class="status" :class="{success: showItem.status==2,isupload: showItem.status==1}"></div>
          </div>

        </div>
      </div>
    </div>
    <!--浏览窗口-->
    <div class="wp-upload-master" v-show="masterShow">
      <div class="close" @click="closeMaster">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon--shanchu"></use>
        </svg>
      </div>
      <div class="title">{{ masterSource.title }}</div>
      <div class="show-content">
        <template v-if="masterSource.show == 1">
          <img :src="masterSource.showIcon" :alt="masterSource.title">
        </template>
        <template v-else-if="masterSource.show == 2">
          <video controls>
            <source :src="masterSource.showIcon" type="video/mov"/>
            <source :src="masterSource.showIcon" type="video/mp4"/>
            您的浏览器不支持预览
          </video>
        </template>
        <template v-else>
          <audio :src="masterSource.showIcon" controls></audio>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import './font/iconfont.js'
import './font/iconfont.css'
import {
  wpUploadFileTools,
  wpUploadDataValid,
  wpUploadFileAlert,
  wpUploadDataTools,
  wpUploadFileMessage,
  wpUploadFileTypeResolving,
  wpUploadFileShowResolving
} from './js/wptools'

export default {
  name: "wp-upload",
  props: {
    /**
     * single 单文件
     * multiple 多文件
     */
    "type": {
      type: String,
      default: "multiple",
      validator: function (value) {
        return ['single', 'multiple'].indexOf(value) !== -1
      }
    },
    /**
     * 显示模式
     */
    "showModel": {
      type: String,
      default: "grid",
      validator: function (value) {
        return ['grid', 'list'].indexOf(value) !== -1
      }
    },
    /**
     * 文件最大数量
     */
    "maxFileNumber": {
      type: Number,
      default: 0
    },
    /**
     * 文件上传时的参数
     */
    "uploadFileParam": {
      type: String,
      default: 'files'
    },
    /**
     * 单个文件大小限制
     * 单位kb
     */
    "size": {
      type: Number,
      default: 0
    },
    /**
     * 上传的地址
     */
    "url": {
      type: String,
      default: ""
    },
    /**
     * 是否显示总进度条
     */
    "sumProgress": {
      type: Boolean,
      default: true
    },
    /**
     * 允许的文件后缀，小写
     */
    "allowFiles": {
      type: Array,
      default: function () {
        return null;
      }
    },
    /**
     * 是否可以拖动
     */
    "canDrop": {
      type: Boolean,
      default: true
    },
    /**
     * 自动上传，一旦设置成了true,那么总进度条将会成为false
     */
    "uploadAuto": {
      type: Boolean,
      default: false
    },
    /**
     * 自动上传的参数
     */
    "uploadAutoParams": {
      type: Object,
      default: function () {
        return {};
      }
    },
    /**
     * 文件列表
     */
    "fileList": {
      type: Array,
      default: function () {
        return null;
      }
    },
    // 是否允许上传
    "enableSelect": {
      type: Boolean,
      default: true
    },
    // 是否允许删除
    "enableDelete": {
      type: Boolean,
      default: true
    }
  },
  data: function () {
    return {
      fileInputId: wpUploadFileTools.uuid(),
      // 上传文件的概况
      survey: {
        // 文件数量
        fileNum: 0,
        // 文件总大小
        fileTotalSize: 0,
        // 需要上传的数量
        uploadNumber: 0
      },
      // 显示列表数组
      fileShowArray: [],
      // 是否显示选择文件按钮
      selectFileShow: true,
      // 显示遮罩层
      masterShow: false,
      // 遮罩层显示资源
      masterSource: {
        title: '',
        show: '',
        showIcon: '',
        file: null
      },
      // 请求结果
      uploadResult: {
        // 上传状态,
        // 500请求失败，注意这里的失败不是真正的上传失败，是否成功，根据返回的数据data进行判断
        // 200请求成功
        status: null,
        // 请求数据
        data: null
      },
      // 总进度条是否显示
      sumProgressStatus: {
        show: false,
        width: 0
      },
      // 应用状态，0 可上传，1 正在上传
      wpStatus: 0,
      // 空后缀设置
      emptyAllowFileTag: "#",
      // 上传失败
      isUploadFail: false,
      // 需要总进度
      needSummerProcess: true,
      // 在自动上传的数量
      inAutoUploadCount: 0,
      // 隐藏进度条的时间
      hideProcessTime: 5000
    }
  },
  watch: {
    'survey.fileNum'() {
      this.computerSelectFileIsShow();
    }
  },
  computed: {
    computerSize() {
      return function (fileByte) {
        if (null == fileByte) {
          return;
        }
        let fileSizeByte = fileByte;
        let fileSizeMsg = "";
        if (fileSizeByte < 1048576) fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "KB";
        else if (fileSizeByte == 1048576) fileSizeMsg = "1MB";
        else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + "MB";
        else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824) fileSizeMsg = "1GB";
        else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + "GB";
        else fileSizeMsg = "文件超过1TB";
        return fileSizeMsg;
      }
    }
  },
  mounted() {
    this.initWp();
  },
  methods: {
    /**
     *  初始化文件
     */
    initWp() {
      // 清除所有的状态和信息
      this.clean();
      // 初始化拖拽文件
      this.initDropFile();
      // 初始化进度条
      this.initSummerProcessShow();
      // 初始化文件列表
      this.initFileList();
    },
    /**
     *  初始化进度条显示
     */
    initSummerProcessShow() {
      this.needSummerProcess = this.needSummerProcess;
      if (this.uploadAuto) {
        // 如果自动上传，总进度条进行隐藏
        this.needSummerProcess = false;
      }
    },
    /**
     * 初始化拖拽文件
     */
    initDropFile() {
      wpUploadFileTools.disableObjEvent(document, "dragleave");
      wpUploadFileTools.disableObjEvent(document, "drop");
      wpUploadFileTools.disableObjEvent(document, "dragenter");
      wpUploadFileTools.disableObjEvent(document, "dragover");
      let me = this;
      let selectBtnObj = document.getElementsByClassName("wp-upload-button-select-file")[0];
      if (selectBtnObj) {
        selectBtnObj.addEventListener("drop", function (e) {
          if (!me.canDrop) {
            e.preventDefault();
            return;
          }
          // 获取文件对象
          let fileList = e.dataTransfer.files;
          me.addFileUploadToList(fileList);
        });
      }
    },
    /**
     * 初始化文件显示
     */
    initFileList() {
      if (!wpUploadDataValid.isValidArray(this.fileList)) {
        return;
      }
      let fileShowTempArray = [];
      for (let i = 0; i < this.fileList.length; i++) {
        let fileItem = this.fileList[i];
        // 包装文件
        let wapFileItem = wpUploadFileTools.wapFileItemShowWithUpload(fileItem);
        fileShowTempArray.push(wapFileItem);
      }
      this.addFileShowArrayOfArray(fileShowTempArray);
    },
    /**
     * 获取文件输入对象
     * @returns {Element}
     */
    getInputObj() {
      return document.getElementById(this.fileInputId);
    },
    /**
     * 选择文件
     */
    selectFile() {
      if (!this.enableSelect) {
        return;
      }
      this.getInputObj().click();
    },
    /**
     * 选择文件改变
     */
    fileSelectChange() {
      if (!this.enableSelect) {
        return;
      }
      let files = this.getInputObj().files;
      this.addFileUploadToList(files);
    },
    /**
     * 添加文件到上传列表中
     * @param files 文件数组
     */
    addFileUploadToList(files) {
      if (!this.enableSelect) {
        return;
      }
      // 文件临时目录
      let fileShowTempArray = [];
      // 准备上传的文件数组
      let preFileItemArray = [];
      // 文件大小超出的，不允许上传，过滤列表
      let error_sizeFileArray = [];
      // 文件数量超出的，不允许上传，过滤列表
      let error_numberFileArray = [];
      // 不允许的文件，不允许上传，过滤列表
      let error_allowFileArray = [];
      // 遍历文件并且包装文件
      for (let i = 0; i < files.length; i++) {
        let fileItem = files[i];
        let isContinue = false;
        // 校验文件数量
        if (!this.checkUploadOfFileNumber(fileShowTempArray)) {
          error_numberFileArray.push(fileItem);
          isContinue = true;
        }
        // 校验文件大小
        if (!this.checkUploadOfFileSize(fileItem)) {
          error_sizeFileArray.push(fileItem);
          isContinue = true;
        }
        if (!this.checkAllowFile(fileItem)) {
          error_allowFileArray.push(fileItem);
          isContinue = true;
        }
        if (isContinue) {
          continue;
        }
        // 包装文件
        let wapFileItem = wpUploadFileTools.wapFileItemShow(fileItem);
        preFileItemArray.push(fileItem);
        fileShowTempArray.push(wapFileItem);
      }
      // 设置文件显示
      this.addFileShowArrayOfArray(fileShowTempArray);
      // 回调函数
      this.$emit('on-select', preFileItemArray, error_numberFileArray, error_sizeFileArray, error_allowFileArray);
    },
    /**
     * 添加一组显示文件
     * @param fileShowTempArray
     */
    addFileShowArrayOfArray(fileShowTempArray = []) {
      fileShowTempArray.forEach(fileShowItem => {
        this.fileShowArray.push(fileShowItem);
      });
      this.computerSurvey();
      if (this.uploadAuto) {
        fileShowTempArray.forEach(fileShowItem => {
          this.uploadFileItem(fileShowItem);
        });
      }
    },
    /**
     * 检验文件数量
     * @param cacheFileArray，即将要上传的文件缓存
     */
    checkUploadOfFileNumber(cacheFileArray = []) {
      if (this.maxFileNumber > 0) {
        // 有最大限制，进行验证
        let nowNumber = cacheFileArray.length + this.survey.fileNum;
        if (nowNumber >= this.maxFileNumber) {
          return false;
        }
      }
      return true;
    },
    /**
     * 检测文件大小
     */
    checkUploadOfFileSize(fileItem) {
      if (this.size > 0 && fileItem.size > (this.size * 1000)) {
        return false;
      }
      return true;
    },
    /**
     * 检验是否在允许的范围中
     * @param fileItem
     * @returns {boolean}
     */
    checkAllowFile(fileItem) {
      let suffixName = wpUploadFileTools.getSuffixNameByFileName(fileItem.name);
      if (this.allowFiles && this.allowFiles.length > 0) {
        // 如果后缀有效
        if (wpUploadDataValid.isValidStr(suffixName)) {
          // 返回是否在允许返回中
          return this.allowFiles.indexOf(suffixName) != -1
        } else if (this.allowFiles.indexOf(this.emptyAllowFileTag) != -1) {
          // 如果后缀无效，是否允许空后缀进入
          return true;
        }
        return false;
      }
      return true;
    },
    /**
     * 删除文件
     */
    deleteFile(id) {
      if (this.wpStatus == 1 && !this.uploadAuto) {
        wpUploadFileAlert.error(wpUploadFileMessage.isUpload("删除"));
        return;
      }
      let tempArray = [];
      let deleteFile = null;
      let deleteResult = false;
      for (let i = 0; i < this.fileShowArray.length; i++) {
        let fileShowItem = this.fileShowArray[i];
        if (id != fileShowItem.id) {
          tempArray.push(fileShowItem);
        } else {
          if (fileShowItem.status == 1) {
            // 正在上传不能进行删除
            deleteResult = false;
            break;
          } else {
            deleteFile = fileShowItem;
            deleteResult = true;
          }
        }
      }
      if (!deleteResult) {
        wpUploadFileAlert.error(wpUploadFileMessage.isUpload("删除"));
        return;
      }
      this.fileShowArray = tempArray;
      this.computerSurvey();
      this.$emit('on-delete', deleteFile);
    },
    /**
     * 查看资源
     */
    showSource(showItem) {
      this.masterShow = true;
      this.masterSource.title = showItem.name;
      this.masterSource.show = showItem.show;
      if (showItem.show == 1 || showItem.show == 2 || showItem.show == 3) {
        if (showItem.fileSource == 0) {
          // 如果是选择上传文件
          this.masterSource.showIcon = wpUploadFileShowResolving.getImgUrlOfLocal(showItem.file);
        } else if (showItem.fileSource == 1) {
          // 如果是回显，已上传文件
          this.masterSource.showIcon = showItem.url;
        }
      }
      this.masterSource.file = showItem.file;
    },
    /**
     * 关闭遮罩层
     */
    closeMaster() {
      this.masterShow = false;
      wpUploadDataTools.initDataInfo(this.masterSource);
    },
    /**
     * 设置总进度条
     */
    setSumProcess(isShow, width) {
      width = width < 0 ? 0 : width;
      width = width > 100 ? 100 : width;
      this.sumProgressStatus.show = isShow;
      this.sumProgressStatus.width = width;
    },
    /**
     * 设置总进度条长度
     */
    setSumProcessWith(width) {
      if (this.sumProgressStatus.show) {
        width = width < 0 ? 0 : width;
        width = width > 100 ? 100 : width;
        this.sumProgressStatus.width = width;
      }
    },
    /**
     * 清理
     */
    clean() {
      if (this.wpStatus > 0) {
        wpUploadFileAlert.warn(wpUploadFileMessage.isUpload("清除"));
        return false;
      }
      this.inAutoUploadCount = 0;
      // 设置上传状态
      this.setWpStatus(0);
      // 初始化大概信息
      this.fileShowArray = [];
      this.computerSurvey();
      // 初始化上传信息
      this.setUploadResult(null, null);
      // 初始化进度条
      this.setSumProcess(false, 0);
      // 初始化上传失败
      this.isUploadFail = false;
      return true;
    },
    /**
     * 刷新文件列表
     */
    refreshFileList() {
      this.clean();
      // 初始化文件列表
      this.initFileList();
    },
    /**
     * 上传文件
     */
    upload(params = {}, url = "") {
      if (this.uploadAuto) {
        wpUploadFileAlert.warn(wpUploadFileMessage.isUploadAuto("上传"));
        return;
      }
      if (this.wpStatus > 0) {
        wpUploadFileAlert.warn(wpUploadFileMessage.isUpload("上传"));
        return;
      }
      if (this.survey.uploadNumber <= 0) {
        // 没有文件可以上擦魂
        wpUploadFileAlert.error(wpUploadFileMessage.noFileNeedUpload);
        return;
      }
      // 如果地址为空，或者不存在
      if (!wpUploadDataValid.isValidStr(url)) {
        // 设置默认地址
        url = this.url;
      }
      // 获取参数
      let formData = this.getUploadFileFormData(params);
      // 上传文件之前的回调
      this.$emit('on-upload-before', formData);
      // 设置上传失败false
      this.isUploadFail = false;
      // 如果需要总进度条
      if (this.needSummerProcess) {
        this.setSumProcess(true, 0);
      }
      // 上传文件
      this.uploadFile(formData, url);
    },
    /**
     * 上传文件真正操作
     * @param formData
     * @param url
     */
    uploadFile(formData, url) {
      if (this.wpStatus > 0) {
        wpUploadFileAlert.warn(wpUploadFileMessage.isUpload("上传"));
        return;
      }
      let me = this;
      if (!wpUploadDataValid.isValidStr(url)) {
        wpUploadFileAlert.error(wpUploadFileMessage.uploadUrlError);
        return;
      }
      // 设置整体真正上传状态
      this.setWpStatus(1);
      // 设置文件的状态
      this.setUploadFileStatus(1);
      // 配置
      let config = {
        headers: {"Content-Type": "multipart/form-data"},
        onUploadProgress: function (e) {
          let loaded = e.loaded;
          let total = e.total;
          let pwidth = loaded / total * 100;
          me.setSumProcessWith(pwidth);
        }
      }
      axios.post(url, formData, config).then(res => {
        this.setUploadResult(200, res.data);
        this.uploadSuccess();
        this.$emit('on-upload-after', this.uploadResult);
      }).catch(e => {
        this.setUploadResult(500, e);
        this.uploadFail();
        this.$emit('on-upload-after', this.uploadResult);
      })
    },
    /**
     * 设置应用状态
     */
    setWpStatus(status) {
      this.wpStatus = status;
      this.computerSelectFileIsShow();
    },
    /**
     * 计算是否应该显示
     */
    computerSelectFileIsShow() {
      if (this.wpStatus == 1 && !this.uploadAuto) {
        // 如果正在上传，而且不是自动上传
        this.selectFileShow = false;
      } else if (this.wpStatus == 0) {
        // 如果上传结束，可上传状态，显示上传按钮
        this.selectFileShow = !(this.maxFileNumber > 0 && this.survey.fileNum >= this.maxFileNumber);
      }
    },
    /**
     * 上传单个文件
     */
    uploadFileItem(fileShowItem) {
      // 是否允许自动上传，不允许的情况下，不能进行单个文件上传
      if (!this.uploadAuto) {
        return;
      }
      // 如果并不存在文件
      if (null == fileShowItem.file) {
        return;
      }
      // 地址是否有效可用，如果不是有效可靠，那么不能进行上传
      if (!wpUploadDataValid.isValidStr(this.url)) {
        wpUploadFileAlert.error(wpUploadFileMessage.uploadUrlError);
        return;
      }
      // 进行文件上传
      let formData = new FormData();
      // 设置上传参数
      let keys = Object.keys(this.uploadAutoParams);
      keys.forEach(key => {
        formData.append(key, this.uploadAutoParams[key]);
      });
      // 设置文件
      let uploadFileParamName = this.uploadFileParam;
      formData.append(uploadFileParamName, fileShowItem.file);
      // 准备上传
      // 上传文件之前的回调
      this.$emit('on-upload-before', formData);
      this.inCreInAutoUploadCount();
      fileShowItem.processStatus.show = true;
      fileShowItem.processStatus.isFail = false;
      // 设置上传状态
      fileShowItem.status = 1;
      let config = {
        headers: {"Content-Type": "multipart/form-data"},
        onUploadProgress: function (e) {
          let loaded = e.loaded;
          let total = e.total;
          let pwidth = loaded / total * 100;
          fileShowItem.processStatus.width = pwidth;
        }
      }
      axios.post(this.url, formData, config).then(res => {
        this.deCreInAutoUploadCount();

        let uploadResult = {
          status: 500,
          data: res.data,
          file: fileShowItem.file,
          fileId: fileShowItem.id
        }
        this.uploadSuccessItemWp(fileShowItem);
        this.$emit('on-upload-after', uploadResult);
      }).catch(e => {
        this.deCreInAutoUploadCount();
        let uploadResult = {
          status: 500,
          data: e,
          file: fileShowItem.file,
          fileId: fileShowItem.id
        }
        this.uploadFailItemWp(fileShowItem);
        this.$emit('on-upload-after', uploadResult);
      })
    },
    /**
     * 自动化上传增加一个
     */
    inCreInAutoUploadCount() {
      this.inAutoUploadCount++;
      this.setWpStatus(1);
    },
    /**
     * 自动上传减一个
     */
    deCreInAutoUploadCount() {
      if (this.inAutoUploadCount > 0) {
        this.inAutoUploadCount--;
      }
      if (this.inAutoUploadCount == 0) {
        this.setWpStatus(0);
      }
    },
    /**
     * 上传失败
     */
    uploadFail() {
      let me = this;
      this.isUploadFail = true;
      this.setSumProcess(true, 100);
      this.setUploadFileStatus(0);
      setTimeout(function () {
        me.setSumProcess(false, 0);
        me.setWpStatus(0);
        me.isUploadFail = false;
      }, 5000);
    },
    /**
     * 上传成功
     */
    uploadSuccess() {
      let me = this;
      this.isUploadFail = false;
      this.setSumProcess(true, 100);
      this.setUploadFileStatus(2);
      setTimeout(function () {
        me.setSumProcess(false, 0);
        me.setWpStatus(0);
      }, 5000);
    },
    uploadFailItem(fileId) {
      let fileShowItem = this.findFileShowItemById(fileId);
      this.uploadFailItemWp(fileShowItem);
    },

    uploadSuccessItem(fileId) {
      let fileShowItem = this.findFileShowItemById(fileId);
      this.uploadSuccessItemWp(fileShowItem);
    },
    uploadFailItemWp(fileShowItem) {
      fileShowItem.status = 0;
      fileShowItem.processStatus.isFail = true;
      fileShowItem.processStatus.show = true;
      fileShowItem.processStatus.width = 100;
      setTimeout(function () {
        fileShowItem.processStatus.show = false;
        fileShowItem.processStatus.isFail = false;
        fileShowItem.processStatus.width = 0;
      }, 5000);
    },
    uploadSuccessItemWp(fileShowItem) {
      fileShowItem.status = 2;
      fileShowItem.processStatus.isFail = false;
      fileShowItem.processStatus.show = true;
      fileShowItem.processStatus.width = 100;
      setTimeout(function () {
        fileShowItem.processStatus.show = false;
        fileShowItem.processStatus.isFail = false;
        fileShowItem.processStatus.width = 0;
      }, 5000);
    },
    /**
     * 根据文件的ID查找文件对象
     * @param fileId 文件的ID
     * @returns {null}
     */
    findFileShowItemById(fileId) {
      let fileShowItemFound = null;
      this.fileShowArray.forEach(fileShowItem => {
        if (fileShowItem.id == fileId) {
          fileShowItemFound = fileShowItem;
        }
      });
      return fileShowItemFound;
    },
    /**
     * 设置上传文件的状态
     * @param status
     */
    setUploadFileStatus(status, id = null) {
      this.fileShowArray.forEach(showItem => {
        if (null != id) {
          if (showItem.id == id) {
            showItem.status = status;
          }
        } else {
          showItem.status = status;
        }
      });
    },
    /**
     * 设置上传结果
     * @param status 结果状态，500失败，200成功
     * @param data 上传数据
     */
    setUploadResult(status, data) {
      this.uploadResult.status = status;
      this.uploadResult.data = data;
    },
    /**
     * 获取文件上传的表单数据
     */
    getUploadFileFormData(params) {
      // 设置上传文件
      let formData = new FormData();
      // 设置参数
      let funKeys = Object.keys(params);
      funKeys.forEach(key => {
        formData.append(key, params[key]);
      });
      // 设置上传文件
      let uploadFileParamName = this.uploadFileParam;
      this.fileShowArray.forEach(showItem => {
        if (showItem.status == 0) {
          if (null != showItem.file) {
            formData.append(uploadFileParamName, showItem.file);
          }
        }
      });
      return formData;
    },
    /**
     * 计算概要文件
     */
    computerSurvey() {
      // 计算文件数量
      this.survey.fileNum = this.fileShowArray.length;
      let fileTotalSizeTemp = 0;
      let uploadNumber = 0;
      // 计算文件综合大小
      this.fileShowArray.forEach(fileShowItem => {
        if (null != fileShowItem.size) {
          fileTotalSizeTemp += parseInt(fileShowItem.size);
          uploadNumber++;
        }
      })
      this.survey.fileTotalSize = fileTotalSizeTemp;
      this.survey.uploadNumber = uploadNumber;
    },
    /**
     * 获取总览信息
     */
    getAllSurvey() {
      let result = wpUploadDataTools.copyValidValue(this.survey);
      result.maxFileNumber = this.maxFileNumber;
      result.allowFiles = this.allowFiles;
      result.size = this.size;
      result.uploadFileParam = this.uploadFileParam;
      result.type = this.type;
      return result;
    }
  }
}
</script>

<style scoped>
.wp-upload {

}

.wp-upload .icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

/*文件容器*/
.wp-upload .wp-upload-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -ms-flex-line-pack: start;
  align-content: flex-start;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
}

/*文件列表容器*/
.wp-upload .wp-upload-list-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}

/*文件显示区域*/
.wp-upload .wp-upload-list-container .wp-upload-list-item {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  justify-items: center;
  -ms-flex-line-pack: center;
  align-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border: solid thin #DDDDDD;
  margin: 5px;
  overflow: hidden;
  text-align: center;
}

/*文件显示图片*/
.wp-upload .wp-upload-list-container .wp-upload-list-item .show-img {
  height: 105px
}

/*文件显示图标*/
.wp-upload .wp-upload-list-container .wp-upload-list-item .show-icon {
  text-align: center;
  margin: 0 auto;
  font-size: 6em;
}

.wp-upload .wp-upload-list-container .wp-upload-list-item .process {
  position: absolute;
  height: 5px;
  width: 100px;
  border-radius: 5px;
  border: solid thin #DDDDDD;
  top: 107px;
}

.wp-upload .wp-upload-list-container .wp-upload-list-item .process-inner {
  height: 5px;
  background-color: #438cff;
  width: 20%;
  border-radius: 5px;
  -webkit-transition: width 300ms;
  -o-transition: width 300ms;
  transition: width 300ms;
}

.wp-upload .wp-upload-list-container .wp-upload-list-item .process-inner.fail {
  background-color: #FF6633;
}

/*文件名字*/
.wp-upload .wp-upload-list-container .wp-upload-list-item .menus .file-name {
  font-size: 10px;
  text-align: center;
  color: #FFFFFF;
  overflow: hidden;
  margin: 5px;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/*文件菜单*/
.wp-upload .wp-upload-list-container .wp-upload-list-item .menus {
  position: absolute;
  height: 100px;
  width: 100px;
  background-color: RGBA(0, 0, 0, 0.6);
  border-radius: 5px;
  display: none;
}

.wp-upload .wp-upload-list-container .wp-upload-list-item .menus .status {
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: #FF6633;
  position: absolute;
  top: 85px;
  left: 85px;
}

.wp-upload .wp-upload-list-container .wp-upload-list-item .menus .status.success {
  background-color: #00CC66;
}

.wp-upload .wp-upload-list-container .wp-upload-list-item .menus .status.isupload {
  background-color: #FFCC33;
}

.wp-upload .wp-upload-list-container .wp-upload-list-item:hover .menus {
  display: block;
}

.wp-upload .wp-upload-list-container .wp-upload-list-item .menus .menu-list {
  margin-top: 20px;
}

.wp-upload .wp-upload-list-container .wp-upload-list-item .menus .menu-list .menu-item {
  display: inline-block;
}

.wp-upload .wp-upload-list-container .wp-upload-list-item .menus .menu-list .menu-item .iconfont {
  color: #FFFFFF;
  font-size: 1.4em;
  cursor: pointer;
}

.wp-upload .wp-upload-list-container .wp-upload-list-item .menus .menu-list .menu-item .iconfont:hover {
  color: #FF6633;
}

/*文件选择菜单*/
.wp-upload .wp-upload-button-select-file {
  width: 100px;
  height: 100px;
  border: solid thin #DDDDDD;
  text-align: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
  margin: 5px;
}

/*文件选择菜单图标显示*/
.wp-upload .wp-upload-button-select-file .iconfont {
  font-size: 40px;
  color: #DDDDDD;
}

.wp-upload .wp-upload-button-select-file:hover {
  border-color: #438cff;
}

.wp-upload .wp-upload-button-select-file:hover .iconfont {
  color: #438cff;
}

/*遮罩层*/
.wp-upload .wp-upload-master {
  width: 100%;
  height: calc(100vh);
  position: fixed;
  top: 0;
  left: 0;
  background-color: RGBA(0, 0, 0, 0.8);
  z-index: 2;
}

.wp-upload .wp-upload-master .close {
  font-size: 2em;
  position: absolute;
  left: 100%;
  margin-left: -1.5em;
  margin-top: 0.3em;
  cursor: pointer;
  z-index: 3;
}

.wp-upload .wp-upload-master .title {
  color: #FFFFFF;
  text-align: center;
  position: absolute;
  width: 100%;
  top: 20px;
}

.wp-upload .wp-upload-master .show-content {
  height: calc(100vh);
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: #FFFFFF;
}

.wp-upload .wp-upload-master .show-content img {
  height: auto;
  max-height: 80%;
  width: auto;
  max-width: 100%;
  color: #FFFFFF;
}

.wp-upload .wp-upload-master .show-content video {
  height: auto;
  max-height: 80%;
  width: auto;
  max-width: 100%;
  color: #FFFFFF;
}

/*进度条*/
.wp-upload .wp-upload-sum-progress {
  border: solid 1px #DDDDDD;
  width: 100%;
  height: 5px;
  border-radius: 5px;
}

.wp-upload .wp-upload-sum-progress.fail {
  border-color: #FF6633;
}

.wp-upload .wp-upload-sum-progress .wp-upload-sum-progress-inner {
  height: 5px;
  background-color: #438cff;
  border-radius: 5px;
  -webkit-transition: width 300ms;
  -o-transition: width 300ms;
  transition: width 300ms;
}

.wp-upload .wp-upload-sum-progress .wp-upload-sum-progress-inner.fail {
  background-color: #FF6633;
}


/*列表模式*/
/*选择文件按钮*/
.wp-upload .wp-upload-container-list .wp-upload-button-select-file-list {
  width: 110px;
  height: 40px;
  text-align: center;
  cursor: pointer;
  border-radius: 5px;
  margin: 5px;
  background-color: #438cff;
  color: #FFFFFF;
  line-height: 40px;
  font-size: 15px;
}

.wp-upload .wp-upload-container-list .wp-upload-button-select-file-list:hover {
  background-color: #204C7A;
}

/*选择文件按钮 图标*/
.wp-upload .wp-upload-container-list .wp-upload-button-select-file-list .iconfont {
  margin-right: 5px;
}

/*文件显示对象*/
.wp-upload .wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item {
  height: 60px;
  overflow: hidden;
  border-radius: 5px;
  margin: 5px 0px;
  border: solid thin #DDDDDD;
}

/*文件显示对象-基本信息*/
.wp-upload .wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-item-base {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
}

/*文件显示对象-菜单*/
.wp-upload .wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-item-menu {
  position: relative;
  height: 60px;
  background-color: RGBA(0, 0, 0, 0.6);
  border-radius: 5px;
  top: -60px;
  display: none;
}

.wp-upload .wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item:hover .file-item-menu {
  display: block;
}

/*文件显示对象-菜单列表*/
.wp-upload .wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-item-menu .menu-list {
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  height: 60px;
}

/*文件显示对象-菜单按钮*/
.wp-upload .wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-item-menu .menu-list .menu-item {
  margin: 0 5px;
}

/*文件显示对象-菜单图标*/
.wp-upload .wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-item-menu .menu-list .menu-item .iconfont {
  color: #FFFFFF;
  font-size: 1.4em;
  cursor: pointer;
}

.wp-upload .wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-item-menu .menu-list .menu-item .iconfont:hover {
  color: #FF6633;
}

/*文件显示对象-菜单状态*/
.wp-upload .wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-item-menu .status {
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: #FF6633;
  position: relative;
  top: -15px;
  left: 100%;
  margin-left: -15px;
}

.wp-upload .wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-item-menu .status.success {
  background-color: #00CC66;
}

.wp-upload .wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-item-menu .status.isupload {
  background-color: #FFCC33;
}

.wp-upload .wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .icon-img {
  height: 60px;
  width: 60px;
  overflow: hidden;
  text-align: center;
}

/*文件显示对象-图标显示*/
.wp-upload .wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .icon-img .show-img {
  height: 60px;
}

.wp-upload .wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .icon-img .show-icon {
  text-align: center;
  margin: 0 auto;
  font-size: 3.7em;
}

/*文件显示对象-文件基本信息*/
.wp-upload .wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-info {
  padding: 5px;
  width: calc(100% - 70px);
}

.wp-upload .wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-info .file-name {
  font-size: 14px;
  color: #444444;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.wp-upload .wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-info .file-size {
  font-size: 12px;
  color: #666666;
  margin-top: 10px;
}


/*文件显示对象-进度条*/
.wp-upload .wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .process {
  height: 5px;
  width: 100%;
  border-radius: 5px;
  border: solid thin #DDDDDD;
}

.wp-upload .wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .process-inner {
  height: 5px;
  background-color: #438cff;
  width: 20%;
  border-radius: 5px;
  -webkit-transition: width 300ms;
  -o-transition: width 300ms;
  transition: width 300ms;
}

.wp-upload .wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .process-inner.fail {
  background-color: #FF6633;
}
</style>