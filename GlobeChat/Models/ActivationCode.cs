using Microsoft.AspNetCore.Mvc;

using System.ComponentModel.DataAnnotations;


namespace GlobeChat.Models
{
    public class ActivationCode
    {
        public int Id { get; set; }
        [Required]
        [Remote("ActivationCodeValid", "Users", AdditionalFields = "Id",
               ErrorMessage = "Activation Code is not valid.")]
        public string Code { get; set; }
        virtual public User User { get; set; }
    }
}
