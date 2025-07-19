using System.ComponentModel.DataAnnotations;
using static ConstructionCompany.Infrastructure.Constants.DataConstants;
using static ConstructionCompany.Core.Constants.MessageConstants;

namespace ConstructionCompany.Core.Models
{
    public class ProjectApplicationModel
    {
        [Required(ErrorMessage = RequiredMessage)]
        [StringLength(TitleMaxLength,
            MinimumLength = TitleMinLength,
            ErrorMessage = LengthMessage)]
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // Client info
        [Required(ErrorMessage = RequiredMessage)]
        [StringLength(ClientNameMaxLength,
            MinimumLength = ClientNameMinLength,
            ErrorMessage = LengthMessage)]
        public string ClientName { get; set; } = string.Empty;

        [Required(ErrorMessage = RequiredMessage)]
        [StringLength(ClientBankMaxLength,
           MinimumLength = ClientBankMinLength,
           ErrorMessage = LengthMessage)]
        public string ClientBank { get; set; } = string.Empty;

        [Required(ErrorMessage = RequiredMessage)]
        [StringLength(ClientBankIbanMaxLength,
           MinimumLength = ClientBankIbanMinLength,
           ErrorMessage = LengthMessage)]
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

    }
}
