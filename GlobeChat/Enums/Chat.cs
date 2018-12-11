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
        public const string INVITATION_RECEIVED = "invitationReceived";
        public const string INVITATION_SEND = "invitationSend";
        public const string PRIVATE_MESSAGE_RECEIVED = "privateMessageReceived";
        public const string INVITATION_ACCEPTED = "invitationAccepted";
        public const string INVITATION_REJECTED = "invitationRejected";
        public const string ACCEPT_INVITATION = "acceptInvitation";
        public const string REJECT_INVITATION = "rejectInvitation";
        public const string END_CONVERSATION = "endConversation";
    }
}
