
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

var load = Nostradamouse.Loader.prototype.load;

Nostradamouse.Loader.prototype.load = function(src) {
    load.apply(this, arguments);

    // Toast looks messed up if we show it right away
    window.setTimeout(function() {
        toast.setAttribute('text', 'Loading ' + src);
        toast.show();
    }, 100);
};
