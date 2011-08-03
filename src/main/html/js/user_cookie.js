Ext.onReady(function() {
    if (Ext.util.Cookies.get("x-addama-registry-user") == null) {
        Ext.util.Cookies.set("x-addama-registry-user", "/addama/users/anonymous-user-" + new Ext.ux.GUID());
    }    
});