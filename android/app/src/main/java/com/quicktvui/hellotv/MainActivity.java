package com.quicktvui.hellotv;

import android.os.Bundle;

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

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        App.sExecutor.execute(WORK_START_APP);
    }

    private final Runnable WORK_START_APP = () -> {
        if (App.sConfig == null) {
            finish();
            return;
        }

        // 第一步 设置启动参数
        EsData data = DataCreateHelper.createWithConfig();

        if (data == null) {
            finish();
            return;
        }
        data.setCoverLayoutId(R.layout.my_custom_cover);

        // 第二步 启动
        EsManager.get().start(data);
    };

    @Override
    protected void onStop() {
        super.onStop();
        if (!isFinishing()) {
            finish();
        }
    }
}
