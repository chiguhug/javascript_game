//ページ上部に戻る
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.back_button').addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});