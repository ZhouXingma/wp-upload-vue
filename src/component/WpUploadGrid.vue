<template>
  <div class="wp-upload-container">
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
               :style="{width : showItem.processStatus.percent + '%'}"></div>
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
</template>

<script>
export default {
  name: "WpUploadGrid",
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
/*文件容器*/
.wp-upload-container {
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
.wp-upload-container .wp-upload-list-container {
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
.wp-upload-container .wp-upload-list-container .wp-upload-list-item {
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
.wp-upload-container .wp-upload-list-container .wp-upload-list-item .show-img {
  height: 105px
}

/*文件显示图标*/
.wp-upload-container .wp-upload-list-container .wp-upload-list-item .show-icon {
  text-align: center;
  margin: 0 auto;
  font-size: 6em;
}

.wp-upload-container .wp-upload-list-container .wp-upload-list-item .process {
  position: absolute;
  height: 5px;
  width: 100px;
  border-radius: 5px;
  border: none;
  margin-top: 95px;
}

.wp-upload-container .wp-upload-list-container .wp-upload-list-item .process-inner {
  height: 5px;
  background-color: #438cff;
  width: 20%;
  border-radius: 5px;
  -webkit-transition: width 300ms;
  -o-transition: width 300ms;
  transition: width 300ms;
}

.wp-upload-container .wp-upload-list-container .wp-upload-list-item .process-inner.fail {
  background-color: #FF6633;
}

/*文件名字*/
.wp-upload-container .wp-upload-list-container .wp-upload-list-item .menus .file-name {
  font-size: 10px;
  text-align: center;
  color: #FFFFFF;
  overflow: hidden;
  margin: 5px;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 15px;
}

/*文件菜单*/
.wp-upload-container .wp-upload-list-container .wp-upload-list-item .menus {
  position: absolute;
  height: 100px;
  width: 100px;
  background-color: RGBA(0, 0, 0, 0.6);
  border-radius: 5px;
  display: none;
}

.wp-upload-container .wp-upload-list-container .wp-upload-list-item .menus .status {
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: #FF6633;
  position: absolute;
  top: 85px;
  left: 85px;
}

.wp-upload-container .wp-upload-list-container .wp-upload-list-item .menus .status.success {
  background-color: #00CC66;
}

.wp-upload-container .wp-upload-list-container .wp-upload-list-item .menus .status.isupload {
  background-color: #FFCC33;
}

.wp-upload-container .wp-upload-list-container .wp-upload-list-item:hover .menus {
  display: block;
}

.wp-upload-container .wp-upload-list-container .wp-upload-list-item .menus .menu-list {
  margin-top: 20px;
  line-height: 25px;
}

.wp-upload-container .wp-upload-list-container .wp-upload-list-item .menus .menu-list .menu-item {
  display: inline-block;
}

.wp-upload-container .wp-upload-list-container .wp-upload-list-item .menus .menu-list .menu-item .iconfont {
  color: #FFFFFF;
  font-size: 1.4em;
  cursor: pointer;
}

.wp-upload-container .wp-upload-list-container .wp-upload-list-item .menus .menu-list .menu-item .iconfont:hover {
  color: #FF6633;
}

/*文件选择菜单*/
.wp-upload-container .wp-upload-button-select-file {
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
.wp-upload-container .wp-upload-button-select-file .iconfont {
  font-size: 40px;
  color: #DDDDDD;
}

.wp-upload-container .wp-upload-button-select-file:hover {
  border-color: #438cff;
}

.wp-upload-container .wp-upload-button-select-file:hover .iconfont {
  color: #438cff;
}


</style>