package com.extscreen.runtime.demo;

import androidx.multidex.MultiDexApplication;

import com.extscreen.runtime.EsKitInitHelper;

import eskit.sdk.core.InitConfig;

/**
 * <br>
 *
 * <br>
 */
public class App extends MultiDexApplication {

    @Override
    public void onCreate() {
        super.onCreate();

        initESKitSDK();
    }

    private void initESKitSDK() {
        EsKitInitHelper.init(this, InitConfig.getDefault()
                .addFlags(InitConfig.FLAG_DYNAMIC_SO)
        );
    }

}
