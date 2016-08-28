using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpanishFlashcards.EF.Models
{
    public class Hint
    {
        #region Fields

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int CardId { get; set; }

        [MaxLength(128)]
        public string UserId { get; set; }

        [MaxLength(200)]
        [Required]
        public string HintText { get; set; }

        #endregion Fields

        #region Related Data Fields

        [ForeignKey("CardId")]
        public virtual Card Card { get; set; }

        #endregion Related Data Fields
    }
}
