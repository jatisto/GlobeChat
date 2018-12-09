using GlobeChat.Interfaces;
using GlobeChat.Models;
using GlobeChat;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System;
using Microsoft.EntityFrameworkCore;
using static GlobeChat.Enums.Chat;

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
            await SendMessageToChannel(message);
        }
        public override async Task OnConnectedAsync()
        {
            AddNewConnectionInfo(Context.User.Identity.Name, Context.ConnectionId);
            await base.OnConnectedAsync().ConfigureAwait(false);
        }
        public async override Task OnDisconnectedAsync(Exception exception)
        {
            await HandleUserDiscionnection(Context.ConnectionId);
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
                        var newConnection = new Connection();
                        newConnection.User = await _context.User.FirstOrDefaultAsync(u => u.Login == username);
                        newConnection.connectionId = connectionid;
                        newConnection.lastSeen = DateTime.Now;
                        _context.Connections.Add(newConnection);
                        await _context.SaveChangesAsync();
                    }
                    else
                    {
                        var newConnection = new Connection();
                        newConnection.User = await _context.User.FirstOrDefaultAsync(u => u.Login == username);
                        newConnection.connectionId = connectionid;
                        newConnection.lastSeen = DateTime.Now;
                        _context.Connections.Add(newConnection);
                        await _context.SaveChangesAsync();
                    }
                }
            }
        }

  
        public async Task SendMessageToChannel(string message)
        {
            using (var serviceScope = m_ServiceProvider.CreateScope())
            {
                using (var _context = serviceScope.ServiceProvider.GetService<GlobeChatContext>())
                {                   
                    var UserConnection = await _context.Connections.FirstOrDefaultAsync(c => c.connectionId == Context.ConnectionId);
                    var Channel = UserConnection.User.Channel;
                    await Clients.Group(Channel.ChannelName).SendAsync(CHANNEL_MESSAGE_RECEIVED, UserConnection.User.Login, message);                    
                }
            }
        }
     

        public async Task HandleUserDiscionnection(string connectionid)
        {
            using (var serviceScope = m_ServiceProvider.CreateScope())
            {
                using (var _context = serviceScope.ServiceProvider.GetService<GlobeChatContext>())
                {
                    var UserConnection = await _context.Connections.FirstOrDefaultAsync(c => c.connectionId == connectionid);
                    
                    if (UserConnection != null)
                    {
                        var Channel = UserConnection.User.Channel;
                        var User = UserConnection.User;
                        await Clients.Group(Channel.ChannelName).SendAsync(USER_CONNECTION_TIMEOUT, UserConnection.User.Login, " disconnected");
                        Channel.Users.Remove(User);
                        User.Channel = null;

                        await _context.SaveChangesAsync();
                        
                    }                   
                }
            }
        }
    }
    
}