package com.quicktvui.hellotv;

import eskit.sdk.core.EsData;

/**
 * <br>
 *
 * <br>
 */
public class DataCreateHelper {

    public static EsData createWithConfig() {
        EsData data = new EsData();
        data.setAppPackage(BuildConfig.RPK_PACKAGE);

        switch (BuildConfig.LOAD_TYPE) {
            case 4:
                data.setRepository(App.REPOSITORY_HOST);
                break;
            case 1:
            case 2:
            case 3:
                data.setAppLoadUri(App.RPK_LOAD_URI);
                break;
            default:
                throw new RuntimeException("not support LOAD_TYPE " + BuildConfig.LOAD_TYPE);
        }

        return data;
    }

}
