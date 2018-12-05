using GlobChat.Globals;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GlobeChat.Models
{
    public class Channel
    {
        public int Id { get; set; }
        public string ChannelName { get; set; }
        public int OwnerId { get; set; }
        public virtual ICollection<User> Users { get; set; }

    }

}
