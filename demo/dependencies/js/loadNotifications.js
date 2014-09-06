var loader = nmouse.loader,
    load = loader.load;

loader.load = function(src) {
    load.call(this, 'bower_components/paper-toast/paper-toast.html');
    load.call(this, src, function() {
        var toast = document.getElementById('componentLoadedToast');

        toast.setAttribute('text', 'Loaded ' + src);
        toast.opened = true;
    });
};
