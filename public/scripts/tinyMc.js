window.onload = function() {
    tinymce.init({
        selector: '#tiny',
        plugins: ['a11ychecker advcode adlist lists link checklist autolink autosave code', 'preview', 'searchreplace', 'wordcount', 'media table emoticons image imagetools'],

        toolbar: 'bold italic underline | alignleft aligncenter alignright alignjustify | bullshit | numlist outdent indent | link image media | forecolor backcolor  emoticons | code preview',
        toolbar_mode: 'floating',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Tajul Islam Rifat',
        height: 300,
        relative_urls:false,
        automatic_uploads: true,
        images_upload_url: '/uplodes/postimage',
        images_upload_handler: function(blobinfo, success, fail) {
            let headers = new Headers()
            headers.append('Accept', 'Application/JSON')

            let formData = new FormData();
            formData.append('post-image', blobinfo.blob(), blobinfo.filename())

            let req = new Request('/uplodes/postimage', {
                method: 'POST',
                headers: headers,
                mode: 'cors',
                body: formData
            })

            fetch(req)
                .then(res => res.json())
                .then(data => success(data.imgUrl))
                .catch(() => fail('HTTP Error'))
        }

    });
}