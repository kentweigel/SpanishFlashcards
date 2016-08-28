using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(SpanishFlashcards.Startup))]
namespace SpanishFlashcards
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
