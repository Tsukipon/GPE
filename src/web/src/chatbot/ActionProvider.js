class ActionProvider {
    constructor(
     createChatBotMessage,
     setStateFunc,
     createClientMessage,
     stateRef,
     createCustomMessage,
     ...rest
   ) {
     this.createChatBotMessage = createChatBotMessage;
     this.setState = setStateFunc;
     this.createClientMessage = createClientMessage;
     this.stateRef = stateRef;
     this.createCustomMessage = createCustomMessage;
   }

   firstHandler = () => {
    const message = this.createChatBotMessage("ForexMetrics est une application permettant de monitrer les cours de diverses devises tout en enseignant les bases du Forex et de la finance");
    this.setChatbotMessage(message);
    }

  secondHandler = () => {
    const message = this.createChatBotMessage("Bonjour, j'espère que vous passez une bonne journée");
    this.setChatbotMessage(message);
    }


  botInfoHander= () => {
    const message = this.createChatBotMessage("Je suis Robert, un majordome crée par ForexMetrics, mon but est d'aider les nouveaux arrivants. Mon collègue Smith est en cours de création et s'occupera de vous dans l'application mobile");
    this.setChatbotMessage(message);
  }

  derienHandler =() => {
    const message = this.createChatBotMessage("Je vous en prie. N'hésitez pas à faire appel à moi si vous avez une autre demande.");
    this.setChatbotMessage(message);
  }

  byeHandler =() => {
    const message = this.createChatBotMessage("Au revoir , prenez bien soin de vous.");
    this.setChatbotMessage(message);
  }

  helplessHandler = () => {
    const message = this.createChatBotMessage("Toutes mes excuses, je ne suis pas encore assez développé pour traiter votre message");
    this.setChatbotMessage(message);
    }    







   setChatbotMessage = (message) => {
     this.setState( state => ({...state,messages: [...state.messages, message] }))
   }



 }
 
 export default ActionProvider;