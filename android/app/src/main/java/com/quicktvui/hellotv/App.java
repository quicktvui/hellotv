package com.quicktvui.hellotv;

import androidx.multidex.MultiDexApplication;

import com.extscreen.runtime.EsKitInitHelper;

import eskit.sdk.core.InitConfig;

/**
 * <br>
 *
 * <br>
 */
public class App extends MultiDexApplication {

    public static final String RPK_LOAD_URI = BuildConfig.RPK_LOAD_URI;
    public static final String REPOSITORY_HOST = BuildConfig.REPOSITORY_HOST;

    @Override
    public void onCreate() {
        super.onCreate();

        initESKitSDK();
    }

    private void initESKitSDK() {
        InitConfig initConfig = InitConfig.getDefault();
        if (!BuildConfig.IS_INCLUDE_SO) {
            initConfig.addFlags(InitConfig.FLAG_DYNAMIC_SO);
        }
        initConfig.setDebug(true);
        EsKitInitHelper.init(this, initConfig);
    }

}
