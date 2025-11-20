package com.quicktvui.hellotv;

import android.os.Bundle;
import android.os.Handler;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import eskit.sdk.core.EsData;
import eskit.sdk.core.EsManager;

/**
 * <br>
 *
 * <br>
 */
public class MainActivity extends AppCompatActivity {

    private Handler mHandler = new Handler();

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        startApp();
    }

    private void startApp() {
        if (App.sConfigLoadResult == null) {
            mHandler.postDelayed(this::startApp, 200);
            return;
        }
        if (!App.sConfigLoadResult.success) {
            finish();
            return;
        }

        // 第一步 设置启动参数
        EsData data = DataCreateHelper.createWithConfig(App.sConfigLoadResult.config);

        if (data == null) {
            finish();
            return;
        }
        //data.setCoverLayoutId(R.layout.my_custom_cover);

        // 第二步 启动
        EsManager.get().start(data);
    }

    @Override
    protected void onStop() {
        super.onStop();
        if (!isFinishing()) {
            finish();
        }
    }
}
