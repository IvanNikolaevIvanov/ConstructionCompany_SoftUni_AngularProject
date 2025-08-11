using System.ComponentModel.DataAnnotations;

namespace ConstructionCompany.Core.Models
{
    public class SupervisorFeedbackDto
    {
        public int Id { get; set; }
     
        public string Text { get; set; } = string.Empty;

        public string CreatedAt { get; set; } = string.Empty;

        public int ApplicationId { get; set; }

        public string AuthorId { get; set; } = string.Empty;

        public string? AuthorName { get; set; }    // Optional: flattening related data
    }
}
