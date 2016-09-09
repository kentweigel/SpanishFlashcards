using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace SpanishFlashcards
{
    public class AuthorizeOr403Attribute : AuthorizeAttribute
    {
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            // Always throw a 403, so that MVC won't try to redirect to the login page. Let ui-router handle the error.
            filterContext.Result = new System.Web.Mvc.HttpStatusCodeResult(HttpStatusCode.Forbidden);
            //base.HandleUnauthorizedRequest(filterContext);
        }
    }
}