
using GlobChat.Globals;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GlobeChat.Models
{
    public class User
    {
        public int Id { get; set; }

        [DisplayName("Login")]
        [Required]
        [RegularExpression(Global.LoginRegex)]
        [Remote("LoginTaken", "Users",
                ErrorMessage = "This login is already taken.")]
        public string Login { get; set; }

        [DisplayName("E-mail")]
        [Required]
        [EmailAddress]
        [Remote("EmailTaken", "Users",
                ErrorMessage = "This Email address is already taken.")]
        public string Email { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        [DataType(DataType.Date)]
        [Remote("IsUnderage", "Users", AdditionalFields = "Id",
                ErrorMessage = "Sorry. Try comingback in sometime.")]
        public DateTime DateOfBirth { get; set; }

        [DisplayName("Password")]
        [Required]
        [RegularExpression(Global.PasswordRegex)]
        public string Password { get; set; }

        [ScaffoldColumn(false)]
        public string Salt { get; set; }

        [ScaffoldColumn(false)]
        public string Crypto { get; set; }

        [ScaffoldColumn(false)]
        public bool IsGuest { get; set; }


        [ScaffoldColumn(false)]
        public bool EmailConfirmed { get; set; }

        [NotMapped]
        [ScaffoldColumn(false)]
        public string SessionId { get; set; }

        [NotMapped]
        [ScaffoldColumn(false)]
        public string EmailConf { get; set; }

        public virtual ICollection<Channel> Channels { get; set; }


        public dynamic Few()
        {
            return new
            {
                Login = this.Login,
                Gender = this.Gender,
                Age = DateTime.Now.Year - this.DateOfBirth.Year
            };
        }


    }





}
