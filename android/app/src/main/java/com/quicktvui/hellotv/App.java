package com.quicktvui.hellotv;

import android.util.Log;

import androidx.multidex.MultiDexApplication;

import com.extscreen.runtime.EsKitInitHelper;
import com.google.gson.Gson;
import com.quicktvui.hellotv.config.Config;
import com.quicktvui.hellotv.config.ConfigLoadResult;
import com.quicktvui.hellotv.config.ConfigModule;
import com.sunrain.toolkit.utils.FileUtils;
import com.sunrain.toolkit.utils.ThreadUtils;
import com.sunrain.toolkit.utils.ToastUtils;
import com.sunrain.toolkit.utils.Utils;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

import eskit.sdk.core.InitConfig;
import eskit.sdk.core.internal.EsComponentManager;

/**
 * <br>
 *
 * <br>
 */
public class App extends MultiDexApplication {

    private static final String TAG = "[-App-]";

    public static ConfigLoadResult sConfigLoadResult;

    @Override
    public void onCreate() {
        super.onCreate();
        initSdk();
        initAppConfig();
    }

    private void initSdk() {
        InitConfig initConfig = InitConfig.getDefault();
        if (!BuildConfig.IS_INCLUDE_SO) {
            initConfig.addFlags(InitConfig.FLAG_DYNAMIC_SO);
        }

        initConfig.setSdkInitCallback(() -> EsComponentManager.get().registerModule(ConfigModule.class));
        EsKitInitHelper.init(App.this, initConfig);
        Log.d(TAG, "initSdk");
    }

    private void initAppConfig() {
        ThreadUtils.executeByIo(new Utils.Task<Void>(null) {
            @Override
            public Void doInBackground() {
                try {
                    InputStream is = getAssets().open("config.json");
                    ByteArrayOutputStream ops = new ByteArrayOutputStream();
                    FileUtils.copy(is, ops);
                    String json = ops.toString();
                    Config config = new Gson().fromJson(json, Config.class);
                    sConfigLoadResult = new ConfigLoadResult(true, config);
                    Log.d(TAG, "initAppConfig");
                } catch (Throwable e) {
                    sConfigLoadResult = new ConfigLoadResult(false, null);
                    e.printStackTrace();
                    ToastUtils.showLong("获取配置文件失败 " + e.getMessage());
                }
                return null;
            }
        });
    }

}
