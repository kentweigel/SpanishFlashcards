using SpanishFlashcards.EF.Concrete;
using SpanishFlashcards.EF.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace SpanishFlashcards.Controllers
{
    public class HistoryApiController : ApiController
    {
        #region Fields

        private EfDbContext m_dataContext;

        #endregion Fields

        #region Constructors

        public HistoryApiController(EfDbContext dbContext)
        {
            m_dataContext = dbContext;
        }

        #endregion Constructors

        #region Methods

        public async Task<IHttpActionResult> Post(History history)
        {
            //if ((history.CardId == null) || (history.Correct == null) || (history.HintUsed == null))
            //{
            //    return this.BadRequest("CardId, Correct and HintUsed must not be null.");
            //}

            //ModelState["history.Id"].Errors.Clear();
            ModelState["history.CreatedDate"].Errors.Clear();

            if (ModelState.IsValid)
            {
                try
                {
                    m_dataContext.History.Add(history);
                    var task = await m_dataContext.SaveChangesAsync();

                }
                catch (Exception ex)
                {
                    return this.BadRequest("Unable to post history for card with ID " + history.CardId + ". " + ex.Message);
                }
            }
            else
            {
                return this.BadRequest("ModelState validation errors detected, starting with: " + ModelState.Values.First().Errors.ToString());
            }

            //return Json(new { placeholderId = placeholderId, newId = product.Id }, JsonRequestBehavior.AllowGet);
            return this.Ok(new { Id = history.Id });
        }

        #endregion Methods
    }
}
