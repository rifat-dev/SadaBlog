window.onload = function() {
    let basic = $('#crop-img').croppie({
        viewport: {
            width: 200,
            height: 200
        },
        boundary: { width: 300, height: 300 },
        showZoomer: true,
    })

    function readable(file) {
        let reader = new FileReader()
        reader.onload = function(event) {
            basic.croppie('bind', {
                url: event.target.result,
            }).then(() => {
                $('.cr-slider').attr({
                    'min': 0.5000,
                    'max': 1.5000
                })
            })
        }
        reader.readAsDataURL(file)
    }

    $('#profilePicFile').on('change', function(e) {
        if (this.files[0]) {
            readable(this.files[0])
            $('#crop-model').modal({
                backdrop: 'static',
                keyboard: false
            })
        }
    })

    $('#cancel-cropping').on('click', function() {
        $('#crop-model').modal('hide')
            // setTimeout(() => {
            //     basic.croppie('destroy');
            // }, 1000);
    })


    $('#uplode-img').on('click', function() {
        basic.croppie('result', 'blob')
            .then(blob => {
                let formdata = new FormData()
                let file = document.getElementById('profilePicFile').files[0]
                let name = generateFileName(file.name)
                formdata.append('profilePics', blob, name)

                let headers = new Headers()
                headers.append('Accept', 'Application/JSON')


                let req = new Request('/uplodes/profilePics', {
                    method: 'POST',
                    headers,
                    body: formdata
                })

                return fetch(req)
            })
            .then(res => res.json())
            .then(data => {
                document.getElementById('removePics').style.display = 'block'
                document.getElementById('profilePics').src = data.profilePics
                    // document.getElementById('profilePicForm').requestFullscreen()


                $('#crop-model').modal('hide')


                // setTimeout(() => {
                //     basic.croppie('destroy');
                // }, 1000);


            })
    })

    $('#removePics').on('click', function(e) {
        let req = new Request('/uplodes/profilePics', {
            method: 'DELETE',
            mode: 'cors'
        })

        fetch(req)
            .then(res => res.json())
            .then(data => {
                document.getElementById('removePics').style.display = 'none'
                document.getElementById('profilePics').src = data.profilePics
                    // document.getElementById('profilePicForm').requestFullscreen()
            })
            .catch(e => {
                console.log(e);
                alert('Error')
            })
    })



    function generateFileName(name) {
        const types = /(.jpeg|.jpg|.gif|.png)/

        return name.replace(types, '.png')
    }


}