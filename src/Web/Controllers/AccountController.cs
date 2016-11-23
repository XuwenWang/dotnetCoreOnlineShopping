using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Web.Controllers
{
    public class AccountController : Controller
    {
        private IConfigurationRoot Config;
        public AccountController(IConfigurationRoot config)
        {
            Config = config;
        }


        /// <summary>
        /// Login view
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Login()
        {
            return View();
        }

        /// <summary>
        /// Login view template
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> LoginTemplate()
        {
            return PartialView();
        }

        /// <summary>
        /// Login a user by email and password
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login(string email, string password)
        {
            try
            {
                System.Threading.Thread.Sleep(2000);
                var user = await Data.Repository.ValidateUser(email, password);

                var claims = new List<Claim> {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Email, user.Email )
                    };
                var userIdentity = new ClaimsIdentity(claims, "Passport");
                var principal = new ClaimsPrincipal(userIdentity);
                await HttpContext.Authentication.SignInAsync(Config["Auth-cookie"], principal);
                return Json(new { url = Url.Action("index", "home") });

            }
            catch(Exception ex)
            {
                return Json(new { msg = ex.Message});
            }
        }

        /// <summary>
        /// Logoff the current user and redirect to login page
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> LogOff()
        {
            await HttpContext.Authentication.SignOutAsync(Config["Auth-cookie"]);
            return RedirectToAction("login");
        }

        /// <summary>
        /// Register view
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Register()
        {
            return View();
        }


        /// <summary>
        /// Register user view template
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterTemplate()
        {
            return PartialView();
        }

        /// <summary>
        /// Register a new user
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Register(string email, string name, string password)
        {
            try
            {
                await Data.Repository.AddNewUser(email, name, password);
                return Json(new { });
            }
            catch(Exception ex)
            {
                return Json(new { msg=ex.Message});
            }
        }
    }
}
