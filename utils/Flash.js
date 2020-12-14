class Flash{
    constructor(req){
        this.req=req
        this.success= this.flashMessage('success')
        this.fail= this.flashMessage('fail')
    }

    flashMessage(name){
        let message = this.req.flash(name)
        return message.length> 0 ? message[0] : false
    }

    static getFlashMessage(req){
        let flash = new Flash(req)
        return{
            success:flash.success,
            fail:flash.fail,
            isMessage:flash.haseMessage()
        }
    }

    haseMessage(){
        return !this.success && !this.fail ? false : true
    }
}
module.exports= Flash