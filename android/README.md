# 一键打包apk

## 1、开发环境配置
项目编译需要VUE和Android的开发环境，环境配置请 [参考这里](https://developer.extscreen.com/guide/#%E5%AE%89%E8%A3%85%E5%92%8C%E7%8E%AF%E5%A2%83%E9%85%8D%E7%BD%AE)
## 2、项目配置
修改app/local.properties文件:
``` properties
# AndroidSDK路径修改为自己电脑的环境
sdk.dir=AndroidSDK路径
```
根据需求修改app/build.gradle的ext部分。**注意是app文件夹下的build.gradle**
``` groovy
// ext的信息影响APK的包名、版本、名称等。
ext {
    APP_PACKAGE = 'com.quicktvui.hellotv'   // APK包名
    APP_NAME = 'HelloTV'                    // APK名字(Launcher显示)
    APP_VERSION_CODE = 1                    // APK版本code
    APP_VERSION_NAME = '1.0.0'              // APK版本名称

    BUILD_RPK_IN_APK = true                 // 是否将rpk打入apk(非assets加载方式不用打包进apk)
    RPK_PACKAGE = "es.hellotv"              // 生成的rpk包名
    RPK_FILE_NAME = "hello.rpk"             // 生成的rpk文件名

    vueDistDir = new File(project.rootDir, '../dist/android')   // vue编译后代码
    assetsDir = new File(project.buildDir, 'assets')            // rpk生成的位置
}

// 引入runtime SDK
dependencies {
    implementation 'com.extscreen.runtime:official:2.8.0'
}
```

**SDK最新版本:**
![](
    https://img.shields.io/badge/dynamic/xml?url=https://nexus.extscreen.com/repository/maven-releases/com/extscreen/runtime/official/maven-metadata.xml&query=metadata/versioning/latest&label=latest
)

## 3、安装VUE库
cd到hellotv的根目录，执行:
```bash
npm install
或
yarn i
```
## 4、编译

``` bash
# 生成debug包
./gradlew app:assembleDebug
# 生成release包
./gradlew app:assembleRelease
```