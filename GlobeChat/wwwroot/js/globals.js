"use strict";
var CONVERSATION_STATUS;
(function (CONVERSATION_STATUS) {
    CONVERSATION_STATUS[CONVERSATION_STATUS["PENDING"] = 0] = "PENDING";
    CONVERSATION_STATUS[CONVERSATION_STATUS["ACCEPTED"] = 1] = "ACCEPTED";
    CONVERSATION_STATUS[CONVERSATION_STATUS["REJECTED"] = 2] = "REJECTED";
    CONVERSATION_STATUS[CONVERSATION_STATUS["ENDED"] = 3] = "ENDED";
    CONVERSATION_STATUS[CONVERSATION_STATUS["BLOCKED"] = 4] = "BLOCKED";
})(CONVERSATION_STATUS || (CONVERSATION_STATUS = {}));
const USER_LEFT_CHANNEL = "userLeftChannel";
const USER_JOINED_CHANNEL = "userJoinedChannel";
const USER_CONNECTION_TIMEOUT = "userConnectionTimeOut";
const USER_DISCONNECTED = "userDisconnected";
const CHANNEL_MESSAGE_RECEIVED = "channelMessageReceived";
const PRIVATE_MESSAGE_RECEIVED = "privateMessageReceived";
const INVITATION_RECEIVED = "invitationReceived";
const INVITATION_SEND = "invitationSend";
const ACCEPT_INVITATION = "acceptInvitation";
const REJECT_INVITATION = "rejectInvitation";
const END_CONVERSATION = "endConversation";
const INVITATION_ACCEPTED = "invitationAccepted";
const INVITATION_REJECTED = "invitationRejected";
const CONVERSATION_ENDED = "conversationEnded";
const NEW_MESSAGE = "newMessage";
const NEW_PRIVATE_MESSAGE = "newPrivateMessage";
const MALE = "Male";
const FEMAILE = "Female";
const GLOBAL_CHANNEL = 1;
