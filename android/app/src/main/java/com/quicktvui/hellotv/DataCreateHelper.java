package com.quicktvui.hellotv;

import java.io.File;

import eskit.sdk.core.EsData;

/**
 * <br>
 *
 * <br>
 */
public class DataCreateHelper {

    /**
     * 从Asset加载代码
     **/
    public static EsData createFromAssets() {
        if (!BuildConfig.IS_BUILD_RPK_IN_APK) {
            throw new RuntimeException("没有开启Assets加载");
        }
        EsData data = new EsData();
        data.setAppPackage(BuildConfig.RPK_PACKAGE);
        data.setAppLoadUri(BuildConfig.RPK_FILE_NAME);
        return data;
    }

    /**
     * 从File加载代码
     **/
    public static EsData createFromFile(File file) {
        if (!file.exists()) throw new RuntimeException("文件不存在");
        // 如果文件是外置存储卡，请申请文件权限
        EsData data = new EsData();
        data.setAppPackage(BuildConfig.RPK_PACKAGE);
        data.setAppLoadUri("file://" + file.getAbsolutePath());
        return data;
    }

    /**
     * 从网络地址加载代码
     **/
    public static EsData createFromUrl(String url) {
        EsData data = new EsData();
        data.setAppPackage(BuildConfig.RPK_PACKAGE);
        data.setAppLoadUri(url);
        return data;
    }

    /**
     * 从仓库地址加载代码
     * 需要将代码上传至仓库
     **/
    public static EsData createFromRepoServer(String repo) {
        EsData data = new EsData();
        data.setAppPackage(BuildConfig.RPK_PACKAGE);
        data.setRepository(repo);
        return data;
    }

}
