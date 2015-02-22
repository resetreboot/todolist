 $.afui.autoLaunch = false; //By default, it is set to true and you're app will run right away.  We set it to false to show a splashscreen
    /* This function runs when the content is loaded.*/
     $(document).ready(function(){
        setTimeout(function(){
            $.afui.launch();
        },1500);
    });

/* window.addEventListener('load', function() {
    new FastClick(document.body);
}, false); */
