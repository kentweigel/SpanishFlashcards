using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SpanishFlashcards.EF.Models;
using SpanishFlashcards.EF.Concrete;
using SpanishFlashcards.ViewModels;

namespace SpanishFlashcards.Controllers
{
    [AuthorizeOr403Attribute(Users = "kentpmac@aol.com")]
    public class CardController : Controller
    {
        private EfDbContext db = new EfDbContext();

        //
        // GET: /Card/
        [OutputCache(VaryByParam = "*", Duration = 0, NoStore = true)]  // This is necessary to keep user from accessing cached copy after logging out.
        public ActionResult Index()
        {
            //return View(db.Card.ToList());
            return View();
        }

        //
        // GET: /Card/Create
        [OutputCache(VaryByParam = "*", Duration = 0, NoStore = true)]  // This is necessary to keep user from accessing cached copy after logging out.
        public ActionResult Create()
        {
            CardViewModel viewModel = new CardViewModel();
            viewModel.PartOfSpeechSelectList = GetPartOfSpeechSelectList();
            return View(viewModel);
        }

        //
        // POST: /Card/Create

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Card card)
        {
            if (ModelState.IsValid)
            {
                db.Card.Add(card);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(card);
        }

        //
        // GET: /Card/Edit/5
        [OutputCache(VaryByParam = "*", Duration = 0, NoStore = true)]  // This is necessary to keep user from accessing cached copy after logging out.
        public ActionResult Edit()
        {
            //Card card = db.Card.Find(id);
            //if (card == null)
            //{
            //    return HttpNotFound();
            //}

            var viewModel = new CardViewModel();
            //viewModel.Card = card;
            viewModel.PartOfSpeechSelectList = GetPartOfSpeechSelectList();

            return View(viewModel);
            //return View();
        }

        //
        // POST: /Card/Edit/5

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(Card card)
        {
            // This executes when you press the Save button in Edit.cshtml ("Save" is the label, not the action; the action (Edit) persists from the GET)
            if (ModelState.IsValid)
            {
                db.Entry(card).State = System.Data.Entity.EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(card);
        }

        //
        // GET: /Card/Delete/5
        [OutputCache(VaryByParam = "*", Duration = 0, NoStore = true)]  // This is necessary to keep user from accessing cached copy after logging out.
        public ActionResult Delete(int id = 0)
        {
            Card card = db.Card.Find(id);
            if (card == null)
            {
                return HttpNotFound();
            }
            return View(card);
        }

        //
        // POST: /Card/Delete/5

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Card card = db.Card.Find(id);
            db.Card.Remove(card);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        // GET: /Card/Single
        [AllowAnonymous]
        public ActionResult Single()
        {
            return View();
        }

        private SelectList GetPartOfSpeechSelectList()
        {
            var selectListItemList = new List<SelectListItem>();

            foreach (var partOfSpeech in db.PartOfSpeech)
            {
                selectListItemList.Add(new SelectListItem { Text = partOfSpeech.Name, Value = partOfSpeech.Id.ToString() });
            }

            return new SelectList(selectListItemList.ToArray(), "Value", "Text", "Name");
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}