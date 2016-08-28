using System.Linq;
using SpanishFlashcards.EF.Models;

namespace SpanishFlashcards.EF.Abstract
{
    public interface IRepository
    {
        IQueryable<Card> Card { get; }
        IQueryable<Hint> Hint { get; }
        IQueryable<History> History { get; }
    }
}
