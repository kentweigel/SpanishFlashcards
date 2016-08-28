using System.Linq;
using System.Web.Mvc;
using SpanishFlashcards.EF.Concrete;
using SpanishFlashcards.EF.Models;

namespace SpanishFlashcards.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index(int id = -1)
        {
            //Response.Redirect("~/Card/Single");
            //return null;
            //var dbContext = new EfDbContext();
            //Card card;
            //if (id == -1)
            //{
            //    card = dbContext.Card.FirstOrDefault();
            //}
            //else
            //{
            //    card = dbContext.Card.Where(p => p.Id == id).FirstOrDefault();
            //}

            //if (card == null)
            //{
            //    card = new Card();
            //}

            //ViewBag.id = dbContext.Card.ToList().IndexOf(card) + 1;
            //ViewBag.count = dbContext.Card.Count();
            //return View(card);
            return View();
        }

        public ActionResult Previous(int id)
        {
            var dbContext = new EfDbContext();
            Card card = dbContext.Card.Where(p => p.Id < id).OrderByDescending(p => p.Id).FirstOrDefault();
            if (card == null)
                card = dbContext.Card.Where(p => p.Id == id).OrderByDescending(p => p.Id).FirstOrDefault();
            //ViewBag.id = id;
            ViewBag.id = dbContext.Card.ToList().IndexOf(card) + 1;
            ViewBag.count = dbContext.Card.Count();
            return View("Index", card);
        }

        public ActionResult Next(int id)
        {
            var dbContext = new EfDbContext();
            Card card = dbContext.Card.Where(p => p.Id > id).FirstOrDefault();
            if (card == null)
                card = dbContext.Card.Where(p => p.Id == id).FirstOrDefault();
            //ViewBag.id = id;
            ViewBag.id = dbContext.Card.ToList().IndexOf(card) + 1;
            ViewBag.count = dbContext.Card.Count();
            return View("Index", card);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Spanish Flashcards.";

            return View();
        }

        public ActionResult Contact()
        {
            //ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}