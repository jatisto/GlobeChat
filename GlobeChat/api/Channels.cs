using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GlobeChat.Models;
using SignalRWebPack.Hubs;
using GlobeChat;
using Microsoft.AspNetCore.SignalR;
using static GlobeChat.Consts.Chat;
namespace GlobChat.api
{
    public class Response
    {
        public string Login;
        public string Message;

        public Response(string Login, string Message)
        {
            this.Login = Login;
            this.Message = Message;
        }
    }

    [Route("api/channels")]
    [ApiController] 
    public class ChannelsControllerAPI : ControllerBase
    {
        private readonly GlobeChatContext _context;
        private readonly IHubContext<ChatHub> _chatHubContext;

        public ChannelsControllerAPI(GlobeChatContext context, IHubContext<ChatHub> hubContext)
        {
            _context = context;
               _chatHubContext = hubContext;
        }
      
        [HttpPost]
        [Route("/api/Channels/{channelName}/join")]
        public async Task<string> JoinChannelAsync([FromRoute] string channelName, string Login)
        {            
            var newChannel = _context.Channels.Where(c => c.ChannelName == channelName).Single();
            var user = await _context.User.FirstOrDefaultAsync(u => u.Login == HttpContext.User.Identity.Name);
            string currentChannelName = "";       
            if (user.Channel != null) {
                 currentChannelName = user.Channel.ChannelName;
                 await _chatHubContext.Groups.RemoveFromGroupAsync(user.ConnectionId.connectionId, user.Channel.ChannelName);
                 await _chatHubContext.Clients.Group(currentChannelName).SendAsync(USER_LEFT_CHANNEL, user.ToJson(), currentChannelName);
                 await _chatHubContext.Clients.Group(newChannel.ChannelName).SendAsync(USER_JOINED_CHANNEL, user.ToJson());             
            }                       
            await _chatHubContext.Groups.AddToGroupAsync(user.ConnectionId.connectionId, newChannel.ChannelName);
            user.Channel = newChannel;
            newChannel.Users.Add(user);            
            await _context.SaveChangesAsync();
            return newChannel.ChannelName;
        }

        [Route("/api/getChannels")]
        [HttpPost]
        public async Task<dynamic> GetChannels()
        {
            var Less = from c in _context.Channels
                      select new
                      {
                          #pragma warning disable IDE0037 // Use inferred member name
                          ChannelName = c.ChannelName,
                          UserCount = c.Users.Count,
                          CSSclass = Helpers.RateUserCount(c.Users.Count),
                          Id = c.Id
                      };
            return await Less.OrderByDescending(c => c.UserCount).ToListAsync();
        }
        [HttpGet]

        [HttpPost]
        [Route("{channelName}/users")]
        public async Task<dynamic> GetUsers([FromRoute] string channelName)
        {
            var Channel = await _context.Channels.FirstOrDefaultAsync(c => c.ChannelName == channelName);
            var Less = from u in Channel.Users
                      select new
                      {
                          Login = u.Login,
                          Id = u.Login,
                          Age = DateTime.Now.Year - u.DateOfBirth.Year,
                          Gender = u.Gender
                      };

            return await Less.ToAsyncEnumerable().ToList();
        }

        [HttpPost]
        [Route("{channelName}/users/avatars")]
        public async Task<dynamic> GetAvatars([FromRoute] string channelName)
        {
            var Users = _context.User.Where(u => u.Channel.ChannelName == channelName);
            var Avatars = _context.User.Where(u => u.Channel.ChannelName == channelName)
                .Join(_context.Avatar.Where(a => a.image != null),
                u => u.Login,
                a => a.User.Login, (u, a) => new {
                    login = u.Login, image = a.image
                });
           
            return await Avatars.ToAsyncEnumerable().ToList();
            
        }
        /*
        [HttpGet]
        [Route("populate")]
        public void populate()
        {
            for (int i = 0; i < 1000; i++)
            {
                var u = new User();
                u.Login = Helpers.GenerateGuestUserLogin();
                u.Password = Helpers.GenerateRandomString(10);
                u.Email = Helpers.GenerateRandomString(10);
                u.IsGuest = false;
                u.EmailConfirmed = true;
                u.DateOfBirth = DateTime.Now;
                u.Gender = "Male";
                var c = (from cn in _context.Channels orderby Guid.NewGuid() select cn).Take(1).Single();
                c.Users.Add(u);
                _context.User.Add(u);
                _context.SaveChanges();
            }
        }

        [Route("clear")]
        public void clear()
        {
            foreach(var Channel in _context.Channels)
                Channel.Users.Clear();
            _context.SaveChanges();            

        }

        [HttpGet]
        [Route("pch")]
        public void pch()
        {
            for (int i = 0; i < 10; i++)
            {
                var u = new Channel();
                u.ChannelName = Helpers.GenerateGuestUserLogin();
                u.OwnerId = new Random().Next(50);
                _context.Channels.Add(u);
                _context.SaveChanges();
            }
        }

        // GET: api/ChannelsControllerAPI/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetChannel([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var channel = await _context.Channels.FindAsync(id);

            if (channel == null)
            {
                return NotFound();
            }
            return Ok(channel);
        }
        */
        // PUT: api/ChannelsControllerAPI/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutChannel([FromRoute] int id, [FromBody] Channel channel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != channel.Id)
            {
                return BadRequest();
            }

            _context.Entry(channel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ChannelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        // POST: api/ChannelsControllerAPI
        [HttpPost]
        public async Task<IActionResult> PostChannel([FromBody] Channel channel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Channels.Add(channel);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetChannel", new { id = channel.Id }, channel);
        }

        // DELETE: api/ChannelsControllerAPI/5
        [HttpDelete("{id}")]        
        public async Task<IActionResult> DeleteChannel([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var channel = await _context.Channels.FindAsync(id);
            if (channel == null)
            {
                return NotFound();
            }
            _context.Channels.Remove(channel);
            await _context.SaveChangesAsync();

            return Ok(channel);
        }

        private bool ChannelExists(int id)
        {
            return _context.Channels.Any(e => e.Id == id);
        }
    }
}