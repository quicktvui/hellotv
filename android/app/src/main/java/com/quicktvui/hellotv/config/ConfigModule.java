package com.quicktvui.hellotv.config;

import android.content.Context;

import com.quicktvui.hellotv.App;

import eskit.sdk.support.EsPromise;
import eskit.sdk.support.PromiseHolder;
import eskit.sdk.support.module.IEsModule;

/**
 * <br>
 *
 * <br>
 */
public class ConfigModule implements IEsModule {

    @Override
    public void init(Context context) {

    }

    public void readConfig(EsPromise promise) {
        PromiseHolder callback = PromiseHolder.create(promise);
        Config config = App.sConfig;
        if (config != null) {
            callback.put("config", config.config);
            callback.put("success", true);
        } else {
            callback.put("success", false);
        }
        callback.sendSuccess();
    }

    @Override
    public void destroy() {

    }
}
