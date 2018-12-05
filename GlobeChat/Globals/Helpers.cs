using GlobeChat.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace GlobeChat
{
    public static class Helpers
    { 
        internal static void AddLogMessage(GlobeChatContext _context, string Message)
        {
            var dblog = new DbLog();
            dblog.Message = Message;
            _context.DbLog.Add(dblog);
            _context.SaveChanges();
        }

        internal static async Task AddLogMessageAsync(GlobeChatContext _context, string Message)
        {
            var dblog = new DbLog();
            dblog.Message = Message;
            _context.DbLog.Add(dblog);
            await _context.SaveChangesAsync();
        }

     
        internal static string GenerateRandomString(int length)
        {
            Random R = new Random();
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var len = possible.Length;
            for (var i = 0; i < length; i++)
                text += possible[R.Next(len)];
            return text;
        }


        internal static string GenerateSessionId()
        {
            return GenerateRandomString(40);
        }

        internal static void SendActivationEmail(User user, string activationCode)
        {
            SmtpClient client = new SmtpClient();
            var fromAddress = new MailAddress("globchatreg@gmail.com", "GlobChat");
            var toAddress = new MailAddress(user.Email, user.Login);
            const string fromPassword = "globchattest";
            const string subject = "[GlobChat] Account Activation";

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };

            using (var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = "Welcome to WebChat <b>" + user.Email + "</b> <br>" +
                    "Thank you for joining GlobChat ! <br><br> " +
                    "Login: " + user.Login + " <br>" +
                    "Password : <b> ******** </b> <br><br>" +
                    "Your activation code is following : <b>" + activationCode + "</b> <br>" +
                    "Enjoy World Wide Chatting! <br>" +
                    "<b>GlobChat Team </b>",
                IsBodyHtml = true
            })

                smtp.Send(message);
        }

        internal static string RateUserCount(int userCount)
        {
            if (userCount > 25) return "badge-danger";
            if (userCount > 10) return "badge-Warning";
            if (userCount > 5) return "badge-success";
            else return "badge-secondary";
        }

        internal static string GenerateGuestUserLogin()
        {
            return "Guest_" + GenerateRandomString(6);
        }

    }
}
