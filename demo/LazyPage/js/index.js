var settingsBtn = document.getElementById('settingsBtn'),
    settingsDialog,
    toast = document.getElementById('componentLoadedToast'),
    searchBox = document.getElementById('searchBox');

settingsBtn.addEventListener('click', function() {
    if(!settingsDialog) {
        settingsDialog = document.createElement('x-settings');
        document.body.appendChild(settingsDialog);
    }

    settingsDialog.opened = true;
});

var load = nmouse.Loader.prototype.load;

nmouse.Loader.prototype.load = function(src) {
    load.call(this, src, function() {
        toast.setAttribute('text', 'Loaded ' + src);
        toast.show();
    });
};
