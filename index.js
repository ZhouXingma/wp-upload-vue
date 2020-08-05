import wpupload from './src/main'
const WPUPLOAD={
    // install 是默认的方法。当外界在 use 这个组件的时候，就会调用本身的 install 方法，同时传一个 Vue 这个类的参数。
    install:function(Vue){
        Vue.component('wp-upload',wpupload)
    }
}
export default WPUPLOAD