using System;
using System.Linq;
using SpanishFlashcards.EF.Abstract;
using SpanishFlashcards.EF.Models;

namespace SpanishFlashcards.EF.Concrete
{
    public class EfRepository : IRepository
    {
        // ATTENTION: This class and it's interface do not appear to be used, currently.
        // Verify this is true and either use them or delete them.
        private EfDbContext context = new EfDbContext();

        public IQueryable<Card> Card
        {
            get { return context.Card; }
        }

        public IQueryable<Hint> Hint
        {
            get
            { return context.Hint; }
        }

        public IQueryable<History> History
        {
            get
            { return context.History;  }
        }
    }
}