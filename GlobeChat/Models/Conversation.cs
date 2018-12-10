namespace GlobeChat.Models
{
    public enum INVITATION_STATUS { PENDING, ACCEPTED, REJECTED, BLOCKED}
    public class Conversation
    {
        public Conversation(User sender, User receiver, INVITATION_STATUS status)
        {
            this.sender = sender;
            this.receiver = receiver;
            Status = status;
        }
        public Conversation() { }        
        public int Id { get; set; }
        virtual public User sender { get; set; }
        virtual public User receiver { get; set; }
        public INVITATION_STATUS Status { get; set; }        

    }
}
