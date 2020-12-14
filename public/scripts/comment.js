window.onload = function () {
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


}

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