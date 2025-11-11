package com.quicktvui.hellotv;

import android.text.TextUtils;

import com.quicktvui.hellotv.config.Config;
import com.sunrain.toolkit.utils.ToastUtils;

import eskit.sdk.core.EsData;

/**
 * <br>
 *
 * <br>
 */
public class DataCreateHelper {

    public static EsData createWithConfig(Config cfg) {

        if (TextUtils.isEmpty(cfg.rpkPackage)) {
            ToastUtils.showLong("需要设置 rpk_package");
            return null;
        }

        EsData data = new EsData();
        data.setAppPackage(cfg.rpkPackage);

        switch (cfg.loadType) {
            case 4:
                if (TextUtils.isEmpty(cfg.repo)) {
                    ToastUtils.showLong("需要设置 repo");
                    return null;
                }
                data.setRepository(cfg.repo);
                break;
            case 1:
            case 2:
            case 3:
                if (TextUtils.isEmpty(cfg.rpkLoadUri)) {
                    ToastUtils.showLong("需要设置 rpk_load_uri");
                    return null;
                }
                data.setAppLoadUri(cfg.rpkLoadUri);
                break;
            default:
                throw new RuntimeException("not support LOAD_TYPE " + cfg.loadType);
        }

        return data;
    }

}
