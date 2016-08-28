using Microsoft.Practices.Unity;
using SpanishFlashcards.EF.Concrete;
using System.Web.Http;
using Unity.WebApi;

namespace SpanishFlashcards
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
			var container = new UnityContainer();

            // register all your components with the container here
            // it is NOT necessary to register your controllers

            // e.g. container.RegisterType<ITestService, TestService>();

            container.RegisterType<EfDbContext>(new HierarchicalLifetimeManager());
            
            GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(container);
        }
    }
}