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
    [AuthorizeOr403(Users = "kentpmac@aol.com")]
    public class AccountApiController : ApiController
    {
        #region Constructors

        public AccountApiController()
        {
        }

        #endregion Constructors

        #region Properties

        private ApplicationSignInManager SignInManager
        {
            get
            {
                return Request.GetOwinContext().Get<ApplicationSignInManager>();
            }
        }

        private ApplicationUserManager UserManager
        {
            get
            {
                return Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
        }

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return Request.GetOwinContext().Authentication;
            }
        }

        #endregion Properties

        #region Actions

        //
        // POST: /Api/AccountApi/Login
        [HttpPost]
        [ActionName("Login")]
        [AllowAnonymous]
        //[ValidateAntiForgeryToken]
        public async Task<IHttpActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid model state.");
            }

            // This doesn't count login failures towards account lockout
            // To enable password failures to trigger account lockout, change to shouldLockout: true
            var result = await SignInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, shouldLockout: true);
            switch (result)
            {
                case SignInStatus.Success:
                    return Ok(model.Email);
                case SignInStatus.LockedOut:
                    return BadRequest("Lockout");
                case SignInStatus.RequiresVerification:
                    return BadRequest("Requires verification");
                case SignInStatus.Failure:
                default:
                    return BadRequest("Invalid login attempt.");
            }
        }

        // POST: /Api/AccountApi/Logoff
        [HttpPost]
        [ActionName("Logoff")]
        //[ValidateAntiForgeryToken]
        public IHttpActionResult Logoff()
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            return Ok();
        }

        // GET: /Api/AccountApi/CurrentUser
        [HttpGet]
        [ActionName("CurrentUser")]
        [AllowAnonymous]
        public IHttpActionResult CurrentUser()
        {
            return Ok(AuthenticationManager.User.Identity.Name);
        }

        #endregion Actions
    }
}
