package com.quicktvui.hellotv;

import androidx.multidex.MultiDexApplication;

import com.extscreen.runtime.EsKitInitHelper;
import com.google.gson.Gson;
import com.quicktvui.hellotv.config.Config;
import com.quicktvui.hellotv.config.ConfigModule;
import com.sunrain.toolkit.utils.FileUtils;
import com.sunrain.toolkit.utils.ToastUtils;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import eskit.sdk.core.InitConfig;
import eskit.sdk.core.internal.EsComponentManager;

/**
 * <br>
 *
 * <br>
 */
public class App extends MultiDexApplication {

    public static ExecutorService sExecutor = Executors.newSingleThreadExecutor();
    public static Config sConfig;

    @Override
    public void onCreate() {
        super.onCreate();

        sExecutor.execute(WORK_INIT_CONFIG);
        sExecutor.execute(WORK_INIT_SDK);
    }

    private final Runnable WORK_INIT_CONFIG = new Runnable() {
        @Override
        public void run() {
            try {
                InputStream is = getAssets().open("config.json");
                ByteArrayOutputStream ops = new ByteArrayOutputStream();
                FileUtils.copy(is, ops);
                String json = ops.toString();
                sConfig = new Gson().fromJson(json, Config.class);
            } catch (Throwable e) {
                e.printStackTrace();
                ToastUtils.showLong("获取配置文件失败 " + e.getMessage());
            }
        }
    };

    private final Runnable WORK_INIT_SDK = new Runnable() {
        @Override
        public void run() {
            if(sConfig == null) return;

            InitConfig initConfig = InitConfig.getDefault();
            initConfig.setDebug(true);
            if (!BuildConfig.IS_INCLUDE_SO) {
                initConfig.addFlags(InitConfig.FLAG_DYNAMIC_SO);
            }

            initConfig.setSdkInitCallback(() -> EsComponentManager.get().registerModule(ConfigModule.class));
            EsKitInitHelper.init(App.this, initConfig);
        }
    };

}
