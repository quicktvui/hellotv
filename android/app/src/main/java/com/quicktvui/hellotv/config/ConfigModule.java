package com.quicktvui.hellotv.config;

import android.content.Context;

import com.quicktvui.hellotv.App;

import org.json.JSONObject;

import eskit.sdk.support.EsPromise;
import eskit.sdk.support.PromiseHolder;
import eskit.sdk.support.args.EsMap;
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
        Config config = (App.sConfigLoadResult != null && App.sConfigLoadResult.success) ? App.sConfigLoadResult.config : null;
        if (config != null) {
            try {
                EsMap configMap = new EsMap();
                configMap.pushJSONObject(new JSONObject(config.config.toString()));
                callback.put("config", configMap);
                callback.put("success", true);
            } catch (Throwable e) {
                e.printStackTrace();
            }
        } else {
            callback.put("success", false);
        }
        callback.sendSuccess();
    }

    @Override
    public void destroy() {

    }
}
