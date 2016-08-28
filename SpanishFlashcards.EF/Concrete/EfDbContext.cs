using SpanishFlashcards.EF.Models;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace SpanishFlashcards.EF.Concrete
{
    public class EfDbContext : DbContext
    {
        public virtual DbSet<Card> Card { get; set; }
        public virtual DbSet<PartOfSpeech> PartOfSpeech { get; set; }
        public virtual DbSet<Hint> Hint { get; set; }
        public virtual DbSet<History> History { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //base.OnModelCreating(modelBuilder); // This default command needs to be commented.
            // This overridden function and the Conventions.Remove below solved the problem EF trying to change the table name Card to Cards, for example.
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}