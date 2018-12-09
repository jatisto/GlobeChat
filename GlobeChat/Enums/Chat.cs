using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GlobeChat.Enums
{
    public static class Chat
    {
        public const string USER_LEFT_CHANNEL = "userLeftChannel";
        public const string USER_JOINED_CHANNEL = "userJoinedChannel";
        public const string USER_CONNECTION_TIMEOUT = "userConnectionTimeOut";
        public const string USER_DISCONNECTED = "userDisconnected";
        public const string CHANNEL_MESSAGE_RECEIVED = "channelMessageReceived";
        public const string NEW_MESSAGE = "newMessage";        
    }
}
