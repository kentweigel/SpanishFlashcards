using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using SpanishFlashcards.Models;

namespace SpanishFlashcards.Controllers
{
    public class AccountApiController : ApiController
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

        public AccountApiController()
        {
        }

        public AccountApiController(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? Request.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public async Task<IHttpActionResult> Login(LoginViewModel model, string returnUrl)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // This doesn't count login failures towards account lockout
            // To enable password failures to trigger account lockout, change to shouldLockout: true
            var result = await SignInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, shouldLockout: true);
            HttpResponseMessage msg = null;
            switch (result)
            {
                case SignInStatus.Success:
                    return Ok(returnUrl);
                case SignInStatus.LockedOut:
                    msg = new HttpResponseMessage(HttpStatusCode.Unauthorized) { ReasonPhrase = "Account locked out." };
                    throw new HttpResponseException(msg);
                case SignInStatus.RequiresVerification:
                    msg = new HttpResponseMessage(HttpStatusCode.Unauthorized) { ReasonPhrase = "Requires email verification." };
                    throw new HttpResponseException(msg);
                //return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = model.RememberMe });
                case SignInStatus.Failure:
                    msg = new HttpResponseMessage(HttpStatusCode.Unauthorized) { ReasonPhrase = "Login failure." };
                    throw new HttpResponseException(msg);
                default:
                    msg = new HttpResponseMessage(HttpStatusCode.Unauthorized) { ReasonPhrase = "Invalid login attempt." };
                    throw new HttpResponseException(msg);
            }
        }
    }
}
