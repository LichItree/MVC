!function(){
  var view = document.querySelector('section.message')
  var model ={
    init:function(){
        AV.init({
          appId: "QEbXgbrXwal3rNHiVFMKRk1g-gzGzoHsz",
          appKey: "obeLs6iACXBom9xEXIvwOUog",
          serverURLs: "https://qebxgbrx.lc-cn-n1-shared.com"//这里的在找到这段代码的上面点链接就能找到
        })      
    },
    //获取数据
    fetch:function(){
      var query = new AV.Query('Message')
      return query.find()//返回promise对象
    },
    //保存数据
    save: function(name, content){
      var Message = AV.Object.extend('Message');
      var message = new Message();
      return message.save({  // Promise 对象
        'name': name,
        'content': content
      })
    }
  }  
  var controller = {
    view:null,
    messageList:null,
    model:null,
    init:function(view,model){
      this.view=view
      this.model=model
      this.messageList = document.querySelector('#messageList')//这里的document用view不对
      this.form = document.querySelector('form')
      // this.model.init()
      this.model.init()
      this.loadMessages()
      this.saveMessage()
      this.bindEvents()
    },
   
    loadMessages:function(){
      this.model.fetch().then(//改完一直报错，发现是model打成modle了
        (messages)=> {//改成箭头形式，这样不会把this改了
          let array=messages.map((item)=>item.attributes)
          array.forEach((item)=>{
            let li=document.createElement('li')
            li.innerText=`${item.name}:${item.content}`
            this.messageList.appendChild(li)
          })
        })
    },
    bindEvents:function(){
      this.form.addEventListener('submit',(e)=>{//这个bug找了很久，果然还是基础知识不熟练，这里用了参数e，然后后面又直接用this了
        e.preventDefault()
        this.saveMessage()
      })
    },
    saveMessage:function(){
      let content = this.form.querySelector('input[name=content]').value
      let name = this.form.querySelector('input[name=name]').value//这二行算作处理了，不放入model
      this.model.save(name,content).then(function(object){
        // window.location.reload()
        let li=document.createElement('li')
        li.innerText=`${object.attributes.name}:${object.attributes.content}`
        this.messageList.appendChild(li)
        this.form.querySelector('input[name=content]').value=''//清空
        this.form.querySelector('input[name=name]').value=''
      })//每次点击就加
    },
  }
  controller.init(view,model)
}.call()
