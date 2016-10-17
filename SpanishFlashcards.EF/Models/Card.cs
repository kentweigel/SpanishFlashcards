using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SpanishFlashcards.EF.Models
{
    //public enum PartOfSpeech This is now a table, instead.
    //{
    //    Noun = 0,
    //    Verb = 1,
    //    Adjective = 2,
    //    Adverb = 3,
    //    Pronoun = 4,
    //    Preposition = 5,
    //    Conjunction = 6
    //}

    public class Card
    {
        #region Fields

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(35)]
        public string Spanish { get; set; }

        [Required]
        [MaxLength(35)]
        public string English { get; set; }

        [Display(Name = "Part of Speech")]
        public int PartOfSpeech { get; set; }

        #endregion Fields

        #region Related Data Properties

        [ForeignKey("PartOfSpeech")]
        public virtual PartOfSpeech PartOfSpeechRecord { get; set; }

        [ForeignKey("Id")]
        public virtual ICollection<Hint> Hints { get; set; }

        [ForeignKey("Id")]
        public virtual ICollection<History> Histories { get; set; }

        #endregion Related Data Properties
    }
}