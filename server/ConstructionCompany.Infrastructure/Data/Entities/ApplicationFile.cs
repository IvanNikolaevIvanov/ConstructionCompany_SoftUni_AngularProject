using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ApplicationFile
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string FileName { get; set; } = string.Empty;

    [Required]
    public string FilePath { get; set; } = string.Empty;

    [Required]
    public DateTime UploadedAt { get; set; }

    [Required]
    public int ApplicationId { get; set; }

    [ForeignKey(nameof(ApplicationId))]
    public ProjectApplication Application { get; set; }
}
