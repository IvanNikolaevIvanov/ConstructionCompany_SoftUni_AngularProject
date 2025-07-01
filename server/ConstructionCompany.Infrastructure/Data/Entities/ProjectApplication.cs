using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using static ConstructionCompany.Infrastructure.Constants.DataConstants;
using ConstructionCompany.Infrastructure.Enumerations;




public class ProjectApplication
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(TitleMaxLength)]
    public string Title { get; set; }

    [Required]
    [MaxLength(DescriptionMaxLength)]
    public string Description { get; set; }

    [Required]
    public DateTime SubmittedAt { get; set; }

    [Required]
    public ApplicationStatus Status { get; set; }

    // Client Info
    [Required]
    [MaxLength(ClientNameMaxLength)]
    public string ClientName { get; set; }

    [Required]
    [MaxLength(ClientBankMaxLength)]
    public string ClientBank { get; set; }

    [Required]
    [MaxLength(ClientBankIbanMaxLength)] // IBAN max length
    public string ClientBankIban { get; set; }

    // Financial
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    [Required]
    [MaxLength(PriceInWordsMaxLength)]
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
