using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GlobeChat.Models
{
    public class Connection
    {
        public int id { get; set; }
        public string connectionId { get; set; }
        public User User { get; set; } 
        public DateTime lastSeen { get; set; }
    }
}
