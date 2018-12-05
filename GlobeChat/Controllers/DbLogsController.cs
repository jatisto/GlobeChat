using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using GlobeChat.Models;

namespace GlobeChat.Controllers
{
    public class DbLogsController : Controller
    {
        private readonly GlobeChatContext _context;

        public DbLogsController(GlobeChatContext context)
        {
            _context = context;
        }

        // GET: DbLogs
        public async Task<IActionResult> Index()
        {
            return View(await _context.DbLog.OrderByDescending(d=>d.Id).ToListAsync());
        }

        // GET: DbLogs/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var dbLog = await _context.DbLog
                .FirstOrDefaultAsync(m => m.Id == id);
            if (dbLog == null)
            {
                return NotFound();
            }

            return View(dbLog);
        }

        // GET: DbLogs/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: DbLogs/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Message")] DbLog dbLog)
        {
            if (ModelState.IsValid)
            {
                _context.Add(dbLog);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(dbLog);
        }

        // GET: DbLogs/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var dbLog = await _context.DbLog.FindAsync(id);
            if (dbLog == null)
            {
                return NotFound();
            }
            return View(dbLog);
        }

        // POST: DbLogs/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Message")] DbLog dbLog)
        {
            if (id != dbLog.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(dbLog);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!DbLogExists(dbLog.Id))
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
            return View(dbLog);
        }

        // GET: DbLogs/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var dbLog = await _context.DbLog
                .FirstOrDefaultAsync(m => m.Id == id);
            if (dbLog == null)
            {
                return NotFound();
            }

            return View(dbLog);
        }

        // POST: DbLogs/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var dbLog = await _context.DbLog.FindAsync(id);
            _context.DbLog.Remove(dbLog);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool DbLogExists(int id)
        {
            return _context.DbLog.Any(e => e.Id == id);
        }
    }
}
