package com.micantoapp;

import android.app.Activity;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.content.Intent;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class MCAndroidAutoModule extends ReactContextBaseJavaModule{
    MCAndroidAutoModule(ReactApplicationContext context) {
        super(context);
    }

    public String getName() {
        return "MCAndroidAutoModule";
    }

    @ReactMethod
    public void turnOffShowWhenLocked() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            Activity activity = getReactApplicationContext().getCurrentActivity();
            activity.setShowWhenLocked(false);
            activity.setTurnScreenOn(false);
        }
    }

    @ReactMethod
    public void getDrawOverAppsPermission(Promise promise) {
        Activity activity = getReactApplicationContext().getCurrentActivity();
        promise.resolve(Settings.canDrawOverlays(activity));
    }

    @ReactMethod
    public void askDrawOverAppsPermission() {
        ReactApplicationContext context = getReactApplicationContext();
        Activity activity = context.getCurrentActivity();
        Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:com.micantoapp"));
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
    }


}
