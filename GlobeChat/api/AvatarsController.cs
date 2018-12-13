using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GlobeChat.Models;

namespace GlobeChat.api
{
    [Route("api/[controller]")]
    [ApiController]
    public class AvatarsController : ControllerBase
    {
        private readonly GlobeChatContext _context;

        public AvatarsController(GlobeChatContext context)
        {
            _context = context;
        }

        // GET: api/Avatars/5
        [HttpGet("{login}")]
        public async Task<IActionResult> GetAvatar([FromRoute] string login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var avatar = await _context.Avatar.FirstOrDefaultAsync(a => a.User.Login == login);

            if (avatar == null)
            {
                return NotFound();
            }

            return Ok(avatar);
        }

        // PUT: api/Avatars/login
        [HttpPut("{login}")]
        public async Task<IActionResult> PutAvatar([FromRoute] string login, [FromBody] Avatar avatar)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (login != avatar.User.Login)
            {
                return BadRequest();
            }

            _context.Entry(avatar).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AvatarExists(login))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Avatars
        [HttpPost]
        public async Task<IActionResult> PostAvatar([FromBody] Avatar avatar)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Avatar.Add(avatar);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAvatar", new { id = avatar.id }, avatar);
        }

        // DELETE: api/Avatars/login
        [HttpDelete("{login}")]
        public async Task<IActionResult> DeleteAvatar([FromRoute] string login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var avatar = await _context.Avatar.FirstOrDefaultAsync(a => a.User.Login == login);
            if (avatar == null)
            {
                return NotFound();
            }

            _context.Avatar.Remove(avatar);
            await _context.SaveChangesAsync();

            return Ok(avatar);
        }

        private bool AvatarExists(string login)
        {
            return _context.Avatar.Any(e => e.User.Login == login);
        }
    }
}