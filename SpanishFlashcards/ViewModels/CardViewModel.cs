using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SpanishFlashcards.EF.Models;
using System.Web.Mvc;

namespace SpanishFlashcards.ViewModels
{
    public class CardViewModel
    {
        public Card Card { get; set; }

        public SelectList PartOfSpeechSelectList { get; set; }
    }
}