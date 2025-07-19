using System.ComponentModel.DataAnnotations;

namespace ConstructionCompany.Core.Models
{
    public class RegisterDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(4), MaxLength(8)]
        public string Password { get; set; } = string.Empty;
        
    }
}
