using System.Data.Entity;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using SpanishFlashcards.EF.Concrete;
using System.Web.Http;

namespace SpanishFlashcards
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            UnityConfig.RegisterComponents();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            //// The SetInitializer command below was necessary to avoid the following error:
            ////      "The model backing the 'EFDbContext' context has changed since the database was created. Consider using Code First Migrations to update the database"
            // Update (10/3/2015) This may not have been the best choice. In another solution, (WebGraphicsLibrary) I enabled automatic migrations in the LibraryConfiguration
            // class constructor, and it got rid of the 
            // Unable to update database to match the current model because there are pending changes and automatic migration is disabled. Either write the pending model 
            // changes to a code-based migration or enable automatic migration. Set DbMigrationsConfiguration.AutomaticMigrationsEnabled to true to enable automatic migration.
            // error and made it so the database was automatically created.
            // Update (12/31/2015) The SetInitializer command below has been commented out since the previous update above. Today, the PartOfSpeech
            // field was added to the Card model and to the database. The error mentioned above was the result. 
            // In the Tools->NuGet Package Manager->Package Manager Console window, I ran the update-database command and got an error saying that
            // no migrations configuration type was found in the assembly, and that I should run enable-migrations. When I tried to do that, I got
            // an error saying that the database had been created with a database initializer, (see history above) and that I needed to delete the
            // __MigrationHistory table in the SpanishFlashcards database and then run enable-migrations again with the -enableautomaticmigrations 
            // and -force parameters. The SetInitializer command is still commented out.
            // see http://codetunnel.io/getting-your-database-back-in-sync-with-your-entity-framework-code-first-model/ 
            // and https://msdn.microsoft.com/en-us/data/jj591621.aspx
            // The latest news is from https://azure.microsoft.com/en-us/documentation/articles/mobile-services-dotnet-backend-how-to-use-code-first-migrations/
            // which says: "If you have already published your .NET backend mobile service project to Azure, and your SQL Database table schema does 
            // not match the current data model of your project, you must use an initializer, drop the tables manually, or otherwise get the schema 
            // and data model in sync before you try to publish using Code First Migrations."
            // Azure doesn't apply to me, but it sounds like I can't use automatic migrations without an initializer, which will wipe out my data, unless
            // I have a seed method to replace it. I added another field just now called IncorrectGuessCount, in both the model and the database table.
            // That worked, but only because I sync'ed the two manually. At least it worked. Automatic migrations are still enabled, but they are 
            // ineffectual without an initializer, apparently.
            // Update (5/20/2016) This solution no longer uses migrations nor an initializer. My (KJW) personal opinion is that they are not worth it
            // in most of the situations that I encounter. It is easier to manually change the database and the classes at the same time, the former
            // of which will probably be accomplished by a change to a create or alter SQL statement in a file, or a complete backup and restore into
            // production, to be used at test/deployment time, and an immediate change to the development database. Yes, this sounds like triple or 
            // quadruple redundancy of effort, and I still think it's worth it. It just causes too many problems to try to keep data in the database,
            // or in an initializer seed method, while making illegal alterations to tables that contain data. Obviously, I could be wrong, but that
            // is the current thought, and the new, uncommented code below will not work with migrations. One hugely compelling reason not to use 
            // migrations is when you don't want the models and the database to be the same, like in the case of a shared database, or intentionally 
            // incomplete models, or backup tables, or testing or whatever.
            //Database.SetInitializer<EfDbContext>(null);

            Database.SetInitializer<EfDbContext>(null);
        }
    }
}
