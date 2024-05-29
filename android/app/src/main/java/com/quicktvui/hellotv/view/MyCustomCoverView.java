package com.quicktvui.hellotv.view;

import android.content.Context;
import android.os.Build;
import android.util.AttributeSet;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

import com.bumptech.glide.Glide;
import com.quicktvui.hellotv.R;

import java.io.Serializable;

import eskit.sdk.support.EsException;
import eskit.sdk.support.cover.IEsCoverView;

/**
 *
 */
public class MyCustomCoverView extends ImageView implements IEsCoverView {

    private Context mContext;

    public MyCustomCoverView(Context context) {
        super(context);
        mContext = context;
    }

    public MyCustomCoverView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        mContext = context;
    }

    public MyCustomCoverView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        mContext = context;
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public MyCustomCoverView(Context context, @Nullable AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        mContext = context;
    }

    @Override
    public void onInit(Serializable serializable) {
        /*if (mContext != null) {
            Glide.with(mContext)
                    .asGif()
                    .load(R.drawable.test)
                    .into(this);
        }*/
    }

    @Override
    public void onEsRenderSuccess() {
        this.postDelayed(() -> {
            try {
                ((ViewGroup) getParent()).removeView(this);
                if (mContext != null) {
                    Glide.with(mContext).clear(this);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, 13000);
    }

    @Override
    public void onEsRenderFailed(EsException e) {

    }

    @Override
    public void suspend(String s) {

    }

    @Override
    public void unSuspend() {

    }
}
