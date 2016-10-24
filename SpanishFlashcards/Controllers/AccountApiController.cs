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
using System.Text;
using System.Web.Helpers;
using System.Net.Http.Headers;

namespace SpanishFlashcards.Controllers
{
    [AuthorizeOr403(Users = "kentpmac@aol.com")]
    public class AccountApiController : ApiController
    {
        #region Fields

        private const String ChangePasswordSuccess = "Your password has been changed.";
        private const String SetPasswordSuccess = "Your password has been set.";

        #endregion Fields

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
        // POST: /Manage/ChangePassword
        [HttpPost]
        [ValidateMvcAntiForgeryToken]
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordViewModel model)
        {
            var message = String.Empty;

            if (ModelState.IsValid)
            {
                var result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword, model.NewPassword);
                if (result.Succeeded)
                {
                    var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
                    if (user != null)
                    {
                        await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                    }

                    return Ok(ChangePasswordSuccess);
                }

                message = WebApiErrorHandling.ConcatResultErrors(result);
            }
            else
            {
                message = WebApiErrorHandling.ConcatModelStateErrors(ModelState);
            }

            return BadRequest(message);
        }

        // GET: /Api/AccountApi/CurrentUser
        [HttpGet]
        [ActionName("CurrentUser")]
        [AllowAnonymous]
        public IHttpActionResult CurrentUser()
        {
            return Ok(AuthenticationManager.User.Identity.Name);
        }

        //
        // POST: /Api/AccountApi/Login
        [HttpPost]
        [ActionName("Login")]
        [AllowAnonymous]
        [ValidateMvcAntiForgeryToken]
        public async Task<IHttpActionResult> Login(LoginViewModel model)
        //public async Task<HttpResponseMessage> Login(LoginViewModel model)
        {
            var message = String.Empty;

            if (ModelState.IsValid)
            {

                // This doesn't count login failures towards account lockout
                // To enable password failures to trigger account lockout, change to shouldLockout: true
                var result = await SignInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, shouldLockout: true);
                switch (result)
                {
                    case SignInStatus.Success:
                        //String cookieToken, formToken;
                        //AntiForgery.GetTokens(null, out cookieToken, out formToken);
                        //var response = Request.CreateResponse(HttpStatusCode.OK, new { data = AntiForgery.GetHtml().ToString() });
                        //response.Headers.AddCookies(new CookieHeaderValue[] {  new CookieHeaderValue(AntiForgeryConfig.CookieName, cookieToken) });
                        //return response;
                        //return Ok(AntiForgery.GetHtml());
                        return Ok(model.Email);
                    case SignInStatus.LockedOut:
                        message = "Lockout";
                        break;
                    case SignInStatus.RequiresVerification:
                        message = "Requires verification";
                        break;
                    case SignInStatus.Failure:
                        message = "Login failed";
                        break;
                    default:
                        message = "Invalid login attempt.";
                        break;
                }
            }
            else
            {
                message = WebApiErrorHandling.ConcatModelStateErrors(ModelState);
            }

            //return new HttpResponseMessage { StatusCode = HttpStatusCode.BadRequest, ReasonPhrase = message };
            return BadRequest(message);
        }

        // POST: /Api/AccountApi/Logoff
        [HttpPost]
        [ActionName("Logoff")]
        [ValidateMvcAntiForgeryToken]
        //public HttpResponseMessage Logoff()
        public IHttpActionResult Logoff()
        {
            try
            {
                AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            }
            catch (Exception ex)
            {
                FileLogger.WriteLine(ex.Message, FileLogger.Category.Exception, FileLogger.Priority.High, User.Identity.Name, ex);
                return BadRequest(ex.Message);
            }

            ////return Ok(AntiForgery.GetHtml());
            //String cookieToken, formToken;
            //AntiForgery.GetTokens(null, out cookieToken, out formToken);
            //var response = Request.CreateResponse(HttpStatusCode.OK, new { data = AntiForgery.GetHtml() });
            //response.Headers.AddCookies(new CookieHeaderValue[] { new CookieHeaderValue(AntiForgeryConfig.CookieName, cookieToken) });
            //response.ReasonPhrase = AntiForgery.GetHtml().ToString();
            //return response;
            return Ok();
        }

        //
        // POST: /Api/AccountApi/Register
        [HttpPost]
        [ActionName("Register")]
        [AllowAnonymous]
        [ValidateMvcAntiForgeryToken]
        public async Task<IHttpActionResult> Register(RegisterViewModel model)
        {
            var message = string.Empty;

            if (ModelState.IsValid)
            {
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);

                    // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=320771
                    // Send an email with this link
                    // string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                    // var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                    // await UserManager.SendEmailAsync(user.Id, "Confirm your account", "Please confirm your account by clicking <a href=\"" + callbackUrl + "\">here</a>");

                    return Ok(model.Email);
                }

                message = WebApiErrorHandling.ConcatResultErrors(result);
            }
            else
            {
                message = WebApiErrorHandling.ConcatModelStateErrors(ModelState);
            }

            return BadRequest(message);
        }

        //
        // POST: /Manage/SetPassword
        [HttpPost]
        [ValidateMvcAntiForgeryToken]
        public async Task<IHttpActionResult> SetPassword(SetPasswordViewModel model)
        {
            var message = string.Empty;

            if (ModelState.IsValid)
            {
                var result = await UserManager.AddPasswordAsync(User.Identity.GetUserId(), model.NewPassword);
                if (result.Succeeded)
                {
                    var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
                    if (user != null)
                    {
                        await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                    }

                    return Ok(SetPasswordSuccess);
                }

                message = WebApiErrorHandling.ConcatResultErrors(result);
            }
            else
            {
                message = WebApiErrorHandling.ConcatModelStateErrors(ModelState);
            }

            // If we got this far, something failed, redisplay form
            return BadRequest(message);
        }

        #endregion Actions

    }
}
