upload 组件上传帮助
使用此组件需要 jquery 依赖包

    <Upload
        edit //是否可编辑
        value:array, //[{name:'xxx', url:'http://XX.png'}]
        help:bool,
        fetchConfig:object, {apiName:'XXX'}
        upload={} //()=>Promise({name, size, url, ...})  不传则使用内置上传方法
        max={999}
        cameraConfig:{
            uploadType:"images", //上传类型 images | files, 【images预览在非微信和非app中直接打开新窗口  files类型直接打开新窗口】
            showName:true, //显示文件名字  默认false
            type:"files", //类型默认是camera 直接打开相机  files是打开文件夹
            accept: 'image/jpeg', //支持上传的类型 默认都支持  格式"image/gif, image/jpeg"
        },
    />
