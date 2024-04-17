package com.quicktvui.hellotv.config;

import androidx.annotation.Keep;

import com.google.gson.annotations.SerializedName;

import org.json.JSONObject;

/**
 * <br>
 *
 * <br>
 */
@Keep
public class Config {

    public int version;

    @SerializedName("load_type")
    public int loadType;

    @SerializedName("rpk_load_uri")
    public String rpkLoadUri;

    @SerializedName("rpk_package")
    public String rpkPackage;

    public String repo;

    public JSONObject config;

}
