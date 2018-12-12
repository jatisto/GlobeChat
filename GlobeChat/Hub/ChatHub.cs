using GlobeChat.Interfaces;
using GlobeChat.Models;

using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;

using System.Threading.Tasks;
using System;
using Microsoft.EntityFrameworkCore;
using static GlobeChat.Enums.Chat;
using GlobeChat;

namespace SignalRWebPack.Hubs
{
    public class ChatHub : Hub, IDbContextAccessor
    {

        private readonly IServiceProvider m_ServiceProvider;
        public ChatHub(IServiceProvider serviceProvider)
        {
            if (serviceProvider == null)
                throw new ArgumentNullException(nameof(serviceProvider));
            m_ServiceProvider = serviceProvider;
        }

        public async Task NewMessage(string message)
        {
            using (var serviceScope = m_ServiceProvider.CreateScope())
            {
                using (var _context = serviceScope.ServiceProvider.GetService<GlobeChatContext>())
                {
                    var UserConnection = await _context.Connections.FirstOrDefaultAsync(c => c.connectionId == Context.ConnectionId);
                    var Channel = UserConnection.User.Channel;
                    await Clients.Group(Channel.ChannelName).SendAsync(CHANNEL_MESSAGE_RECEIVED, UserConnection.User.Login, message, Channel.ChannelName);
                }
            }
        }

        public async Task NewPrivateMessage(string hash, string message)
        {
            using (var serviceScope = m_ServiceProvider.CreateScope())
            {
                using (var _context = serviceScope.ServiceProvider.GetService<GlobeChatContext>())
                {
                    var UserConnection = await _context.Connections.FirstOrDefaultAsync(c => c.connectionId == Context.ConnectionId);
                    var Channel = UserConnection.User.Channel;
                    await Clients.Group(hash).SendAsync(PRIVATE_MESSAGE_RECEIVED, hash, UserConnection.User.Login, message);
                }
            }
        }

        public async Task InvitationSend( string receiver)
        {
            using (var serviceScope = m_ServiceProvider.CreateScope())
            {
                using (var _context = serviceScope.ServiceProvider.GetService<GlobeChatContext>())
                {                    
                    var SenderConnection = await _context.Connections.FirstOrDefaultAsync(c => c.connectionId == Context.ConnectionId);
                    var ReceiverConnection = await _context.Connections.FirstOrDefaultAsync(c => c.User.Login == receiver);
                    var invExist = await _context.Conversations.FirstOrDefaultAsync(i => i.sender == SenderConnection.User && i.receiver == ReceiverConnection.User);
               
                    if (((invExist == null) || (invExist.Status==CONVERSATION_STATUS.ENDED))
                        && (SenderConnection.connectionId != ReceiverConnection.connectionId))
                    {
                        var con = new Conversation(SenderConnection.User, ReceiverConnection.User, CONVERSATION_STATUS.PENDING);
                        await Clients.Client(ReceiverConnection.connectionId).SendAsync(INVITATION_RECEIVED, SenderConnection.User.Login, con.hash);
                        await Groups.AddToGroupAsync(SenderConnection.connectionId, con.hash);
                        await Groups.AddToGroupAsync(ReceiverConnection.connectionId, con.hash);
                        await _context.Conversations.AddAsync(con);
                        await _context.SaveChangesAsync();
                    }
                }
            }
        }

        public async Task AcceptInvitation(string hash)
        {
            using (var serviceScope = m_ServiceProvider.CreateScope())
            {
                using (var _context = serviceScope.ServiceProvider.GetService<GlobeChatContext>())
                {                    
                    var connection = await _context.Connections.FirstOrDefaultAsync(c => c.connectionId == Context.ConnectionId);
                    var receiver = await _context.User.FirstOrDefaultAsync(u => u.ConnectionId.connectionId == connection.connectionId);
                    var invitation = await _context.Conversations.FirstOrDefaultAsync(c => c.hash == hash);

                    if (receiver.Login == invitation.receiver.Login) {
                        invitation.Status = CONVERSATION_STATUS.ACCEPTED;
                        Helpers.AddLogMessage(_context, "Sender : " + invitation.receiver.Login + " Receiver : " + receiver.Login);
                        await Clients.Client(receiver.ConnectionId.connectionId).SendAsync(INVITATION_ACCEPTED, hash, invitation.sender.Login);
                        await Clients.Client(invitation.sender.ConnectionId.connectionId).SendAsync(INVITATION_ACCEPTED, hash, receiver.Login);
                    }
                   await _context.SaveChangesAsync();                   
                }
            }
        }

        public async Task RejectInvitation(string hash)
        {
            using (var serviceScope = m_ServiceProvider.CreateScope())
            {
                using (var _context = serviceScope.ServiceProvider.GetService<GlobeChatContext>())
                {
                    var connection = await _context.Connections.FirstOrDefaultAsync(c => c.connectionId == Context.ConnectionId);
                    var receiver = await _context.User.FirstOrDefaultAsync(u => u.ConnectionId.connectionId == connection.connectionId);
                    var invitation = await _context.Conversations.FirstOrDefaultAsync(c => c.hash == hash);

                    if (receiver.Login == invitation.receiver.Login)
                    {
                        invitation.Status = CONVERSATION_STATUS.REJECTED;
                        await Clients.Client(receiver.ConnectionId.connectionId).SendAsync(INVITATION_REJECTED, hash, invitation.sender.Login);
                        await Clients.Client(invitation.sender.ConnectionId.connectionId).SendAsync(INVITATION_REJECTED, hash, receiver.Login);
                    }
                    await _context.SaveChangesAsync();
                }
            }
        }

        public async Task EndConversation(string hash)
        {
            using (var serviceScope = m_ServiceProvider.CreateScope())
            {
                using (var _context = serviceScope.ServiceProvider.GetService<GlobeChatContext>())
                {
                    var connection = await _context.Connections.FirstOrDefaultAsync(c => c.connectionId == Context.ConnectionId);
                    var receiver = await _context.User.FirstOrDefaultAsync(u => u.ConnectionId.connectionId == connection.connectionId);
                    var conversation = await _context.Conversations.FirstOrDefaultAsync(c => c.hash == hash);                   
                        conversation.Status = CONVERSATION_STATUS.ENDED;
                        await Clients.Group(hash).SendAsync(CONVERSATION_ENDED, hash, connection.User.Login);
                        await Groups.RemoveFromGroupAsync(conversation.sender.ConnectionId.connectionId, hash);
                        await Groups.RemoveFromGroupAsync(conversation.receiver.ConnectionId.connectionId, hash);
                        //await Clients.Client(receiver.ConnectionId.connectionId).SendAsync(CONVERSATION_ENDED, hash, conversation.sender.Login);
                       // await Clients.Client(conversation.sender.ConnectionId.connectionId).SendAsync(CONVERSATION_ENDED, hash, receiver.Login);                        
                    await _context.SaveChangesAsync();
                }
            }
        }

        public override async Task OnConnectedAsync()
        {   
            AddNewConnectionInfo(Context.User.Identity.Name, Context.ConnectionId);           
            await base.OnConnectedAsync().ConfigureAwait(false);
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            using (var serviceScope = m_ServiceProvider.CreateScope())
            {
                using (var _context = serviceScope.ServiceProvider.GetService<GlobeChatContext>())
                {
                    var UserConnection = await _context.Connections.FirstOrDefaultAsync(c => c.connectionId == Context.ConnectionId);

                    if (UserConnection != null)
                    {
                        var Channel = UserConnection.User.Channel;
                        var User = UserConnection.User;
                        await Clients.Group(Channel.ChannelName).SendAsync(USER_CONNECTION_TIMEOUT, UserConnection.User.Login, " disconnected", Channel.ChannelName);
                        Channel.Users.Remove(User);
                        User.Channel = null;

                        await _context.SaveChangesAsync();

                    }
                }
            }
        }


        public async void AddNewConnectionInfo(string username, string connectionid)
        {
            using (var serviceScope = m_ServiceProvider.CreateScope())
            {
                using (var _context = serviceScope.ServiceProvider.GetService<GlobeChatContext>())
                {
                    var UserConnection = await _context.Connections.FirstOrDefaultAsync(c => c.User.Login == username);
                    if (UserConnection != null)
                    {
                        _context.Remove(UserConnection);
                        var newConnection = new Connection
                        {
                            User = await _context.User.FirstOrDefaultAsync(u => u.Login == username),
                            connectionId = connectionid,
                            lastSeen = DateTime.Now
                        };
                        _context.Connections.Add(newConnection);
                        await _context.SaveChangesAsync();
                    }
                    else
                    {
                        var newConnection = new Connection
                        {
                            User = await _context.User.FirstOrDefaultAsync(u => u.Login == username),
                            connectionId = connectionid,
                            lastSeen = DateTime.Now
                        };
                        _context.Connections.Add(newConnection);
                        await _context.SaveChangesAsync();
                    }
                }
            }
        }
  
        public async Task SendMessageToChannel(string message, string channel)
        {
            using (var serviceScope = m_ServiceProvider.CreateScope())
            {
                using (var _context = serviceScope.ServiceProvider.GetService<GlobeChatContext>())
                {                   
                    var UserConnection = await _context.Connections.FirstOrDefaultAsync(c => c.connectionId == Context.ConnectionId);
                    var Channel = UserConnection.User.Channel.ChannelName;
                    await Clients.Group(Channel).SendAsync(CHANNEL_MESSAGE_RECEIVED, UserConnection.User.Login, message, channel);                    
                }
            }
        }

        public Task HandleUserDiscionnection(string connectionid)
        {
            throw new NotImplementedException();
        }

     
    }
    
}