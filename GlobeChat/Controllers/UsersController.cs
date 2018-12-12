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
                else return Redirect(Url.Content("~/"));
        }

        // GET: Users
        public IActionResult Login()
        {
            if (HttpContext.Session.GetString("LoggedIn") != null)
                return Redirect(Url.Content("~/"));
            return View();
        }


        public IActionResult Logout()
        {
            HttpContext.SignOutAsync();
            return Redirect(Url.Content("~/"));

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
                await Helpers.AddLogMessageAsync(_context, $"authenticating user + {user.Login}");                
                HttpContext.Session.SetString("LoggedIn_Login", user.Login);
                await Helpers.AddLogMessageAsync(_context, $"user authenticated + {user.Login}");
                await Helpers.AddLogMessageAsync(_context, $"user status + {HttpContext.User.Identity.IsAuthenticated}");
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
        public async Task<IActionResult> Create([Bind("Id,Login,Email,Gender,DateOfBirth,Password")] User user)
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
        [Route("/Users/Edit/{login}")]
        public async Task<IActionResult> Edit(string login)
        {
            var user = await _context.User.FirstOrDefaultAsync(u => u.Login == login);

            if (User.Identity.Name != user.Login)
            {
                return NotFound();
            }
            
            if (user == null)
            {
                return NotFound();
            }
            return View(user);
        }

        // POST: Users/Edit/5
        // To protect from overposting attacks, please enable the specif    ic properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Login,Email,Gender,DateOfBirth,Password")] User user)
        {
            if (User.Identity.Name != user.Login)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(user);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserExists(user.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(user);
        }

        // GET: Users/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            return NotFound(); //TEMPORARY
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

            return View(user);
        }

        // POST: Users/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            return NotFound(); //TEMPORARY
            var user = await _context.User.FindAsync(id);
            var codes = await _context.ActivationCodes.FirstOrDefaultAsync(a => a.User.Id == id);

            if (codes != null) _context.ActivationCodes.Remove(codes);
            if (user != null) _context.User.Remove(user);

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
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
