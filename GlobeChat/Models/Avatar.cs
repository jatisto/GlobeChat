using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GlobeChat.Models
{
    public class Avatar
    {
        public int id { get; set; }
        public virtual User User { get; set; }
        public string image { get; set; }
    }
}
