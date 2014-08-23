
var settingsBtn = document.getElementById('settingsBtn'),
    settingsDialog,
    searchBox = document.getElementById('searchBox');

//nmouse.prepare({
//    el: settingsBtn,
//    src: 'components/x-settings/x-settings.html',
//    triggers: [ {
//        type: 'proximity',
//        distance: 100
//    } ]
//});
//
//nmouse.prepare({
//    el: searchBox,
//    src: 'components/x-autosuggest/x-autosuggest.html',
//    triggers: [ {
//        type: 'proximity',
//        distance: 100
//    } ]
//});

settingsBtn.addEventListener('click', function() {
    if(!settingsDialog) {
        settingsDialog = document.createElement('x-settings');
        document.body.appendChild(settingsDialog);
    }
    
    settingsDialog.opened = true;
});