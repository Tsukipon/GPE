class MessageParser {
    constructor(actionProvider, state) {
      this.actionProvider = actionProvider;
      this.state = state;
    }
  
    parse(message) {
      console.log(message)
      const lowercase = message.toLowerCase()
      if( lowercase.includes("forexm") || lowercase.includes("forex me")){
        this.actionProvider.firstHandler();
      }

      else if(lowercase.includes("salu") || lowercase.includes ("bonjo")){
        this.actionProvider.secondHandler();
      }

      else if(lowercase.includes(" toi ") || lowercase.includes(" vous ") || lowercase.includes(" es tu ")){
        this.actionProvider.botInfoHander();
      }
      

      else if(lowercase.includes("merci")){
        this.actionProvider.derienHandler();
      }
      else if(lowercase.includes("au revoir") || lowercase.includes("bye") || lowercase.includes("a+") || lowercase.includes("++")){
        this.actionProvider.byeHandler();
      }

      else {
        this.actionProvider.helplessHandler();
      }

    }
  }
  
  export default MessageParser;