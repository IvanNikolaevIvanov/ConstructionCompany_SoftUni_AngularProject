namespace ConstructionCompany.Core.Models
{
    public class ProjectApplicationDetailsModel
    {
        
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

       
        public string ClientName { get; set; } = string.Empty;

        public string ClientBank { get; set; } = string.Empty;

        
        public string ClientBankIban { get; set; } = string.Empty;

        public decimal Price { get; set; }
        public string PriceInWords { get; set; } = string.Empty;

        // Materials
        public bool UsesConcrete { get; set; }
        public bool UsesBricks { get; set; }
        public bool UsesSteel { get; set; }
        public bool UsesInsulation { get; set; }
        public bool UsesWood { get; set; }
        public bool UsesGlass { get; set; }

        public string? SupervisorId { get; set; }
        public string SupervisorName { get; set; } = string.Empty;
        
        public ICollection<ApplicationFileModel> Files { get; set; } = new List<ApplicationFileModel>();

    }
}
