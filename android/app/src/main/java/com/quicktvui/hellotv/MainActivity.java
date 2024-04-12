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

        // 第一步 设置启动参数
        EsData data = DataCreateHelper.createFromAssets();
        // 另外还支持的加载方式:
//        DataCreateHelper.createFromFile(new File(""));
//        DataCreateHelper.createFromUrl("https://extcdn.hsrc.tv/data_center/files/plugin/2024/04/12/aa76e1a2-26b3-4a99-a16d-6bd1bd5a3da7.zip");
//        DataCreateHelper.createFromRepoServer("http://nexus.hmon.tv/");

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
