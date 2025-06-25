using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class SupervisorFeedback
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(1000)]
    public string Text { get; set; } = string.Empty;

    [Required]
    public DateTime CreatedAt { get; set; }

    // FK to Application
    [Required]
    public int ApplicationId { get; set; }
    [ForeignKey(nameof(ApplicationId))]
    public ProjectApplication Application { get; set; }

    // FK to Supervisor (User)
    [Required]
    public string AuthorId { get; set; }
    [ForeignKey(nameof(AuthorId))]
    public ApplicationUser Author { get; set; }
}
