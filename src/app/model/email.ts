export class Email {
    textMessage: string; 
    textAverageMessage: string; 
    textFooterMessage: string; 
    email: string; 
    subject: string;
  
    public; constructor(init?: Partial<Email>) {
      Object.assign(this, init);
    }
  }
  