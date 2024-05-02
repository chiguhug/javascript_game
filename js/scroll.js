document.addEventListener('DOMContentLoaded', function() {
    var ul = document.getElementById('scroll_content');
    var li = ul.getElementsByTagName('li');
    for (var i=0; i < li.length; i++) {
        li[i].addEventListener('click', function() {
            // this.remove();
            var input = this.getElementsByTagName('input');
            var frame = document.getElementById('frame');
            frame.src = input[0].value;
        });
    };
});