<template>
  <div class="wp-upload-container-list">
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
                   :style="{width : showItem.processStatus.percent + '%'}"></div>
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
          <div class="status" :class="{success: showItem.status==2, isupload: showItem.status==1}"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WpUploadList",
  props: {
    /**
     * 显示文件的数组
     */
    fileShowArray: {
      type: Array,
      default: []
    },
    /**
     * 是否显示选择文件
     */
    selectFileShow: {
      type: Boolean,
      default: true
    },
    /**
     * 是否允许选择文件
     */
    enableSelect: {
      type: Boolean,
      default: true
    },
    /**
     * 是否允许进行删除
     */
    enableDelete: {
      type: Boolean,
      default: true
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
  methods: {
    /**
     * 预览
     * @param showItem
     */
    showSource(showItem) {
      this.$emit("on-show-source", showItem)
    },
    /**
     * 删除
     * @param showItemId
     */
    deleteFile(showItemId) {
      this.$emit("on-delete-file", showItemId)
    },
    /**
     * 选择文件
     */
    selectFile() {
      this.$emit("on-select-file")
    }
  }
}
</script>

<style scoped>
/*列表模式*/
/*选择文件按钮*/
.wp-upload-container-list .wp-upload-button-select-file-list {
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

.wp-upload-container-list .wp-upload-button-select-file-list:hover {
  background-color: #204C7A;
}

/*选择文件按钮 图标*/
.wp-upload-container-list .wp-upload-button-select-file-list .iconfont {
  margin-right: 5px;
}

/*文件显示对象*/
.wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item {
  height: 60px;
  overflow: hidden;
  border-radius: 5px;
  margin: 5px 0px;
  border: solid thin #DDDDDD;
  line-height: normal;
}

/*文件显示对象-基本信息*/
.wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-item-base {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
}

/*文件显示对象-菜单*/
.wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-item-menu {
  position: relative;
  height: 60px;
  background-color: RGBA(0, 0, 0, 0.6);
  border-radius: 5px;
  top: -60px;
  display: none;
}

.wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item:hover .file-item-menu {
  display: block;
}

/*文件显示对象-菜单列表*/
.wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-item-menu .menu-list {
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
.wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-item-menu .menu-list .menu-item {
  margin: 0 5px;
}

/*文件显示对象-菜单图标*/
.wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-item-menu .menu-list .menu-item .iconfont {
  color: #FFFFFF;
  font-size: 1.4em;
  cursor: pointer;
}

.wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-item-menu .menu-list .menu-item .iconfont:hover {
  color: #FF6633;
}

/*文件显示对象-菜单状态*/
.wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-item-menu .status {
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: #FF6633;
  position: relative;
  top: -15px;
  left: 100%;
  margin-left: -15px;
}

.wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-item-menu .status.success {
  background-color: #00CC66;
}

.wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-item-menu .status.isupload {
  background-color: #FFCC33;
}

.wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .icon-img {
  height: 60px;
  width: 60px;
  overflow: hidden;
  text-align: center;
}

/*文件显示对象-图标显示*/
.wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .icon-img .show-img {
  height: 60px;
}

.wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .icon-img .show-icon {
  text-align: center;
  margin: 0 auto;
  font-size: 3.7em;
}

/*文件显示对象-文件基本信息*/
.wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-info {
  padding: 5px;
  width: calc(100% - 70px);
}

.wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-info .file-name {
  font-size: 14px;
  color: #444444;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .file-info .file-size {
  font-size: 12px;
  color: #666666;
  margin-top: 10px;
}


/*文件显示对象-进度条*/
.wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .process {
  height: 5px;
  width: 100%;
  border-radius: 5px;
  border: solid thin #DDDDDD;
}

.wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .process-inner {
  height: 5px;
  background-color: #438cff;
  width: 20%;
  border-radius: 5px;
  -webkit-transition: width 300ms;
  -o-transition: width 300ms;
  transition: width 300ms;
}

.wp-upload-container-list .wp-upload-files-contain-list .wp-upload-files-contain-list-item .process-inner.fail {
  background-color: #FF6633;
}
</style>