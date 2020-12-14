window.onload = function() {

    let likeBtn = document.getElementById('likeBtn');
    let dislikeBtn = document.getElementById('dislikeBtn');
    
    likeBtn.addEventListener('click',function(e){
        let postId = likeBtn.dataset.post

        sendRequest('likes',postId)
               .then(res=>res.json())
               .then(data=>{
            
                   let likeTxt = data.liked ? 'Liked' : 'Like'
                   likeTxt = likeTxt + `(${data.totalLikes})`

                   let dislikeText = `DisLike (${data. totalDislikes})`

                   likeBtn.innerHTML = likeTxt
                   dislikeBtn.innerHTML = dislikeText

               })
               .catch(e=>{
                   console.error(e.response.data)
                   alert(e.response.data.error)
               })
              
    })

    dislikeBtn.addEventListener('click',function(e){
        let postId = dislikeBtn.dataset.post

        sendRequest('dislikes',postId)
               .then(res=>res.json())
               .then(data=>{               
                   let dislikeTxt = data.disliked ? 'DisLiked' : 'DisLike'
                   dislikeTxt = dislikeTxt + `(${data.totalDislikes})`

                   let likeText = `Like (${data.totalLikes})`

                   dislikeBtn.innerHTML = dislikeTxt
                   likeBtn.innerHTML = likeText
                  

               })
               .catch(e=>{
                   console.log(e)
                   alert(e.response.data.error)
               })
              
    })

    function sendRequest(type,postId){
        let headers = new Headers()
        headers.append('Accept','Application/json')
        headers.append('Content-Type','application/json')

        let req = new Request(`/api/${type}/${postId}`,{
            method:'GET',
            headers,
            mode:'cors'
        })

        return fetch(req)
    }


}