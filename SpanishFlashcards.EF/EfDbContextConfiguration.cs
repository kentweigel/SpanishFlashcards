using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Text;
using System.Threading.Tasks;
using SpanishFlashcards.EF.Concrete;

namespace SpanishFlashcards.EF
{
    class EfDbContextConfiguration : DbMigrationsConfiguration<EfDbContext>
    {
        public EfDbContextConfiguration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = false;
        }
    }
}
