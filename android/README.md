# 一键打包apk

## 配置
修改app/build.gradle的ext部分:
``` groovy
ext {
    APP_PACKAGE = 'com.quicktvui.hellotv'   # APK包名
    APP_NAME = 'HelloTV'                    # APK名字(Launcher显示)
    APP_VERSION_CODE = 1                    # APK版本code
    APP_VERSION_NAME = '1.0.0'              # APK版本名称

    RPK_PACKAGE = "es.hellotv"              # 生成的rpk包名
    RPK_FILE_NAME = "hello.rpk"             # 生成的rpk文件名

    vueDistDir = new File(project.rootDir, '../dist/android')   # vue编译后代码
    assetsDir = new File(project.buildDir, 'assets')            # rpk生成的位置
}
```
## 编译
``` bash
# 生成debug包
./gradlew app:assembleDebug
# 生成release包
./gradlew app:assembleRelease
```