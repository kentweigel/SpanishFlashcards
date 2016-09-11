using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using SpanishFlashcards.EF.Concrete;

namespace SpanishFlashcards.Controllers
{
    public class PartOfSpeechApiController : ApiController
    {
        #region Fields

        private EfDbContext m_dataContext;

        #endregion Fields

        #region Constructors

        public PartOfSpeechApiController(EfDbContext dbContext)
        {
            m_dataContext = dbContext;
        }

        #endregion Constructors

        #region Methods

        //[ResponseType(typeof(List<PartOfSpeech>))]
        public async Task<IHttpActionResult> Get()
        {
            //Request.Abort();  // Use for testing failure condition in Javascript get()
            //return Json(m_partsOfSpeech, JsonRequestBehavior.AllowGet);

            try
            {
                var partsOfSpeech = await m_dataContext.PartOfSpeech.ToArrayAsync();

                return this.Ok(partsOfSpeech);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        #endregion Methods
    }
}
