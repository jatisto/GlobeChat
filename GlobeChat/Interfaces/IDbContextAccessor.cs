﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GlobeChat.Interfaces
{
    interface IDbContextAccessor
    {
        void  AddNewConnectionInfo(string username, string connectionid);
        Task  SendMessageToChannel(string message, string channel);
        Task  HandleUserDiscionnection(string connectionid);
    }
}
