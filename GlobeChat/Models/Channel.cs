using GlobeChat.Interfaces;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace GlobeChat.Models 
{
    public class Channel : IJSONable
    {
        public int Id { get; set; }
        public string ChannelName { get; set; }
        public int OwnerId { get; set; }
        public virtual ICollection<User> Users { get; set; }

        public string ToJson()
        {
            return JsonConvert.SerializeObject(
                new { channelName = this.ChannelName, id = this.Id }
                );
        }
    }

}
