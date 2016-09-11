using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Formatting;
using System.Web.Http;

namespace SpanishFlashcards
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.MapHttpAttributeRoutes();

            // Routes alone
            config.Routes.MapHttpRoute(
                name: "ApiRouteAlone",
                routeTemplate: "api/{controller}"
            );

            // Routes with IDs
            config.Routes.MapHttpRoute(
                name: "ApiRouteWithID",
                routeTemplate: "api/{controller}/{id}",
                defaults: null,
                constraints: new { id = @"^\d+$" } // Only integers
            );

            // Routes with Actions
            config.Routes.MapHttpRoute(
                name: "ApiRouteWithAction",
                routeTemplate: "api/{controller}/{action}"
            );

            var jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().First();
            jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        }
    }
}
