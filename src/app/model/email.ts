export class Email {
    content: string; 
    averageContent: string; 
    footerContent: string; 
    email: string; 
    subject: string;
  
    public; constructor(init?: Partial<Email>) {
      Object.assign(this, init);
    }
  }
  