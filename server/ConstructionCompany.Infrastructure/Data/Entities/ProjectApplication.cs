using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public enum ApplicationStatus
{
    Created = 0,              // Initial draft by agent
    Submitted = 1,            // Sent to supervisor
    ReturnedBySupervisor = 2, // Supervisor returned with feedback
    Approved = 3,             // Approved by supervisor
    Finished = 4              // Finalized/completed project
}


public class ProjectApplication
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string Title { get; set; }

    [Required]
    [MaxLength(1000)]
    public string Description { get; set; }

    [Required]
    public DateTime SubmittedAt { get; set; }

    [Required]
    public ApplicationStatus Status { get; set; }

    // Client Info
    [Required]
    [MaxLength(100)]
    public string ClientName { get; set; }

    [Required]
    [MaxLength(100)]
    public string ClientBank { get; set; }

    [Required]
    [MaxLength(34)] // IBAN max length
    public string ClientBankIban { get; set; }

    // Financial
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    [Required]
    [MaxLength(300)]
    public string PriceInWords { get; set; }

    // Construction Materials
    public bool UsesConcrete { get; set; }
    public bool UsesBricks { get; set; }
    public bool UsesSteel { get; set; }
    public bool UsesInsulation { get; set; }
    public bool UsesWood { get; set; }
    public bool UsesGlass { get; set; }

    // Relationships
    [Required]
    public string AgentId { get; set; }

    [ForeignKey(nameof(AgentId))]
    public ApplicationUser Agent { get; set; }

    public string? SupervisorId { get; set; }

    [ForeignKey(nameof(SupervisorId))]
    public ApplicationUser? Supervisor { get; set; }

    public ICollection<SupervisorFeedback> Feedbacks { get; set; }
    public ICollection<ApplicationFile> Files { get; set; }
}
