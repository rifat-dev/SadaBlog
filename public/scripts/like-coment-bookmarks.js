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

    //===========================================================
    //===========================================================
    //comment section 
    //===========================================================
    let comment = document.getElementById('comment')
    let comentHolder = document.getElementById('comment-holder')
 
    comment.addEventListener('keydown', function (e) {
       if (e.key === 'Enter') {
          if (e.target.value) {
             let postId = e.target.dataset.post
 
             let data = {
                body: e.target.value
             }
 
             let req = generateReq(`/api/comments/${postId}`, 'POST', data)
 
             fetch(req)
                .then(res => res.json())
                .then(data => {
 
                   let commentElement = createComment(data)
 
                   comentHolder.insertBefore(commentElement, comentHolder.children[0])
 
                   e.target.value = ''
                })
                .catch(e => {
                   console.log(e);
                   alert(e.message)
                })
 
          } else {
             alert('Please Provide a valide comment')
          }
       }
    })
 
    comentHolder.addEventListener('keypress',function(e){
       if(comentHolder.hasChildNodes(e.target)){
           if(e.key==='Enter'){
              let comentId = e.target.dataset.comment
              let value = e.target.value
 
              if(value){
 
                let data = {
                   body: value
                }
 
                let req = generateReq(`/api/comments/replies/${comentId}`,'POST',data)
                fetch(req)
                      .then(response => response.json())
                      .then(data=>{
                         let replyElement = createReply(data)
 
                         let parent = e.target.parentElement
                         parent.previousElementSibling.appendChild(replyElement)
                         
                         e.target.value = ''
 
                      })
                      .catch(e=>{
                         console.log(e)
                         alert(e.message)
                      })
 
              }else{
                 alert('Please provide a valide Reply')
              }
           }
       }
    })


    // ===========================
    // ===========================
    // bookmarks section
    // ===========================

    const bookmarks = document.getElementsByClassName('bookmark');
    [...bookmarks].forEach(bookmark=>{
        bookmark.style.cursor = 'pointer';
        bookmark.addEventListener('click', function(e){
            let target = e.target.parentElement

            let headers = new Headers()
            
            headers.append('Accept','Application/JSON')

            let req = new Request(`/api/bookmarks/${target.dataset.post}`,{
                method: 'GET',
                headers,
                mode:'cors'
            })

            fetch(req)
                 .then( res =>res.json())
                 .then(data => {                    
                   if(data.bookmark){
                       target.innerHTML = ' <i class="fas fa-bookmark" ></i>'
                      
                   }else{
                      
                       target.innerHTML = ' <i class="far fa-bookmark" ></i>'
                   }
                 })
                 .catch(e=>{
                     console.error(e.response.data)
                     alert(e.response.data.error)
                 })
        })
    })


}

//===========================
//===========================
// comment js function 
// =================
function generateReq(url, method, body) {
    let headers = new Headers()
    headers.append('Accept', 'Application/json')
    headers.append('Content-Type', 'application/json')
 
    let req = new Request(url, {
       method,
       headers,
       body: JSON.stringify(body),
       mode: 'cors'
    })
 
    return req;
 }

 function createComment(comment) {
    let innerHTML = `
    <img src="${comment.user.profilePics}" 
    class="align-self-center rounded-circle mx-3 my-3" style="width:40px"
    />
    <div class="media-body mt-3">
         <p class=""> ${comment.body}</p>
         <div class="my-3">
         <input name="comment" type="text" class="form-control" placeholder="Press Enter" data-comment="${comment._id}" >
         </div>
    </div>
    `
 
    let div = document.createElement('div')
    div.className = 'media border'
    div.innerHTML = innerHTML
 
    return div
 }
 
 function createReply(reply){
    let innerHTML = `
    <img src="${reply.profilePics}" 
    class="align-self-center rounded-circle mx-3 my-3" style="width:40px"
    />
    <div class="media-body mt-3">
         <p> ${reply.body}</p>   
    </div>
    `
 
    let div = document.createElement('div')
    div.className = 'media mt-3'
    div.innerHTML = innerHTML
 
    return div
 }