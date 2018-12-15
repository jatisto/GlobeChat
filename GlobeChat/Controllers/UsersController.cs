using GlobeChat.Models;
using GlobeChat;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace GlobChat.Controllers
{
    public class UsersController : Controller
    {
        private readonly GlobeChatContext _context;
        public UsersController(GlobeChatContext context)
        {
            _context = context;
        }

        // GET: Users
        public async Task<IActionResult> Index()
        {
            if(User.IsInRole("Admin"))
                return View(await _context.User.ToListAsync());
                else return Redirect(Url.Content("Home/Index"));
        }

        // GET: Users
        public IActionResult Login()
        {
            if (HttpContext.Session.GetString("LoggedIn") != null)
                return Redirect(Url.Content("Home/Index"));
            return View();
        }

        public IActionResult Logout()
        {
            HttpContext.SignOutAsync("Cookies");
            return Redirect(Url.Content("/Users/LoggedOut"));
        }
        [Route("/Users/LoggedOut")]
        public IActionResult LoggedOut()
        {
            foreach (var cookieKey in Request.Cookies.Keys)
                if(cookieKey!=".AspNet.Consent")Response.Cookies.Delete(cookieKey);
            HttpContext.Session.Remove("LoggedIn");
            return View();
        }


        [HttpPost, ActionName("Login")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login([Bind("Login,Password")] User user)
        {
           
            var dbUser = await _context.User.FirstOrDefaultAsync(u => u.Login == user.Login);
            ModelState.AddModelError("Login", "Login or password incorrect.");
            if (dbUser == null) return View();
            if (dbUser.Password == user.Password)
            {
                HttpContext.Session.SetString("LoggedIn", "True");
                var claims = new List<Claim>();
                claims.Add(new Claim(ClaimTypes.Name, user.Login));
                claims.Add(new Claim(ClaimTypes.Role, "ChatUser"));
                var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                var principal = new ClaimsPrincipal(identity);
                var props = new AuthenticationProperties();
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, props);
                HttpContext.Session.SetString("LoggedIn_Login", user.Login);
                return Redirect(Url.Content("~/"));
            }
            else
            {
                return View();
            }
        }

        [HttpPost, ActionName("Activate")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ActivationConfirmed(string Code)
        {
            var usrCode = Code;
            var usr = (from c in _context.ActivationCodes
                       where c.Code == usrCode
                       select c.User).Single();

            var codes = await _context.ActivationCodes.FirstOrDefaultAsync(a => a.Code == usrCode);
            _context.ActivationCodes.Remove(codes);
            usr.IsGuest = false;
            usr.EmailConfirmed = true;
            await _context.SaveChangesAsync();

            HttpContext.Session.SetString("LoggedIn", "True");
            return Redirect(Url.Content("~/"));
        }


        public IActionResult Activate()
        {
            return View();
        }

        // GET: Users/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var user = await _context.User
                .FirstOrDefaultAsync(m => m.Id == id);


            if (user == null)
            {
                return NotFound();
            }
            if (user.Login == User.Identity.Name)
                return View(user);
            else return NotFound();
        }

        [Route("Users/Register")]
        public IActionResult Create()
        {
            if (HttpContext.Session.GetString("LoggedIn") == null)
                return View();
            else return Redirect(Url.Content("~/"));
        }

        // POST: Users/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Login,Email,Gender,DateOfBirth,Password")] User user, string passconf)
        {
            if (ModelState.IsValid)
            {
                var code = Helpers.GenerateRandomString(8);
                ActivationCode ActCode = new ActivationCode
                {
                    Code = code,
                    User = user
                };
                
                _context.Add(user);
                _context.ActivationCodes.Add(ActCode);
                await _context.SaveChangesAsync();
                Helpers.SendActivationEmail(user, code);
                return View("Activate");
            }
            return View();
        }
        [HttpGet]
        [Route("/Settings")]
        public async Task<IActionResult> Edit()
        {
            var user = await _context.User.FirstOrDefaultAsync(u => u.Login == User.Identity.Name);
            if (user == null) return NotFound();
            if (User.Identity.Name != user.Login) return NotFound();         
            return View(user);
        }

        // POST: Users/Edit/5
        // To protect from overposting attacks, please enable the specif    ic properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [Route("/Users/Edit/{login}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string login, [Bind("Id, Login, Password")] User user)
        {            
            if (User.Identity.Name != user.Login) return NotFound();          
            var _user = await _context.User.FirstOrDefaultAsync(u => u.Login == login);
            if (_user == null) return NotFound();
            else {
                try
                {
                    _user.Password = user.Password;
                    await _context.SaveChangesAsync();
                    return View(user);
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserExists(user.Id)) return NotFound();
                    else throw;
                }      
            }        
        }

       
        private bool UserExists(int id)
        {
            return _context.User.Any(e => e.Id == id);
        }

        public bool LoginTaken(string Login)
        {
            var val = _context.User.Where(u => u.Login == Login);
            if (val.Count() > 0) return false;
            else return true;
        }


        public bool EmailTaken(string Email)
        {
            var val = _context.User.Where(u => u.Email == Email);
            if (val.Count() > 0) return false;
            else return true;
        }

        public bool ActivationCodeValid(string Code)
        {
            var val = _context.ActivationCodes.Where(a => a.Code == Code);
            if (val.Count() > 0) return true;
            else return false;
        }

        public bool IsUnderage(dynamic date)
        {
            var str = JsonConvert.SerializeObject(date);
            Helpers.AddLogMessage(_context, str);
            return true;
        }
    }
}
