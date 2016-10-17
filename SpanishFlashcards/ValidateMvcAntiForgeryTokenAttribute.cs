using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace SpanishFlashcards
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public class ValidateMvcAntiForgeryTokenAttribute : FilterAttribute, IAuthorizationFilter
    {
        // The ValidateAntiForgeryToken is part of a large MVC library, so the functionality is duplicated here,
        // rather than including that largely irrelevant library in WebAPI controllers.
        // References:
        // CodePlex MVC Source Code: https://aspnetwebstack.codeplex.com/SourceControl/latest#src/System.Web.WebPages/Helpers/AntiForgeryConfig.cs
        // https://aspnetwebstack.codeplex.com/SourceControl/latest
        // The latest MVC source code clone is stored locally at G:\CodePlex ASP.NET Source Code\aspnetwebstack

        // Note about SpanishFlashcards and AntiForgery: After trying to handle form and cookie tokens manually, and update them
        // either on every request, or on login and logout only, it just wasn't working, and I was always getting to the catch 
        // block below. What finally worked the best is to only put @Html.AntiForgeryToken() on the _LoginPartial.cshtml view,
        // and to never exchange cookies or form tokens manually. In other words, let MVC send the form and cookie tokens automatically
        // on Login and Logoff, however it does it, and to manually refresh the whole SPA from angularjs any time the user logs
        // on or off. This gets both the cookie and form token together and keeps them in sync. BUT: the form token still needs
        // to be retrieved from the hidden input in the _LoginPartial view and sent with any AJAX requests in the header
        // named __RequestVerificationToken in the angularjs controller and/or factory/service.

        public Task<HttpResponseMessage> ExecuteAuthorizationFilterAsync(HttpActionContext actionContext, CancellationToken cancellationToken, Func<Task<HttpResponseMessage>> continuation)
        {
            if (actionContext == null)
            {
                throw new ArgumentNullException("actionContext");
            }

            try
            {
                var headers = actionContext.Request.Headers;
                var cookies = headers.GetCookies();
                var cookie = cookies.Select(c => c[AntiForgeryConfig.CookieName]).FirstOrDefault();
                //var token = headers.Where(h => h.Key == "__RequestVerificationToken").FirstOrDefault(); // This is correct, but not DRY.
                var token = headers.Where(h => h.Key == AntiForgeryConfig.CookieName).FirstOrDefault(); // Hopefully this isn't confusing to use the CookieName string for the form token lookup. They are the same, and it is DRY this way.
                AntiForgery.Validate(cookie?.Value, token.Value.FirstOrDefault());
            }
            catch (Exception ex)
            {
                actionContext.Response = new HttpResponseMessage
                {
                    StatusCode = System.Net.HttpStatusCode.Forbidden,
                    RequestMessage = actionContext.ControllerContext.Request,
                    ReasonPhrase = ex.Message.Replace(Environment.NewLine, ";")
                };

                return Task.FromResult(actionContext.Response);
            }

            return continuation();
        }
    }
}