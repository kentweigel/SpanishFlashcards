﻿using SpanishFlashcards.EF.Concrete;
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
    public class CardApiController : ApiController
    {
        #region Fields

        private EfDbContext m_dataContext;

        #endregion Fields

        #region Constructors

        public CardApiController(EfDbContext dbContext)
        {
            m_dataContext = dbContext;
        }

        #endregion Constructors

        #region Methods

        //[ResponseType(typeof(List<Card>))]
        public async Task<IHttpActionResult> Get()
        {
            //Request.Abort();  // Use for testing failure condition in Javascript get()
            //return Json(m_cards, JsonRequestBehavior.AllowGet);

            //var q = m_dataContext.Card.Include("History").sele;
            var q = from card in m_dataContext.Card
                    join history in m_dataContext.History
                    on card.Id equals history.CardId into sub1
                    //from sub2 in sub1.DefaultIfEmpty()
                    group sub1 by card.Id into sub2
                    from sub3 in sub2
                    select new
                    {
                        CardId = sub2.Key,
                        //Spanish = card.Spanish,
                        //English = card.English,
                        //PartOfSpeech = card.PartOfSpeech,
                        //Correct = sub2.Correct == null ? false : sub2.Correct,
                        //HintUsed = sub2.HintUsed == null ? false : sub2.HintUsed,
                        //NoHistory = sub2.Correct == null
                        CorrectCount = sub3.Count(h => h.Correct),
                        TotalCount = sub3.Count(),
                        HintUsedCount = sub3.Count(h => h.HintUsed)//,
                        //FirstHistoryDateTime = sub3.Min(h => h.CreatedDate),
                        //LatestHistoryDateTime = sub3.Max(h => h.CreatedDate)
                    } into sub4
                    join card in m_dataContext.Card
                    on sub4.CardId equals card.Id
                    join partOfSpeech in m_dataContext.PartOfSpeech
                    on card.PartOfSpeech equals partOfSpeech.Id
                    select new
                    {
                        Id = card.Id,
                        Spanish = card.Spanish,
                        English = card.English,
                        PartOfSpeech = partOfSpeech.Name,
                        CorrectCount = sub4.CorrectCount,
                        TotalCount = sub4.TotalCount,
                        HintUsedCount = sub4.HintUsedCount//,
                        //FirstHistoryDateTime = sub4.FirstHistoryDateTime,
                        //LatestHistoryDateTime = sub4.LatestHistoryDateTime
                    };
            try
            {
                var cards = await q.ToListAsync();

                return this.Ok(cards);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        #endregion Methods

    }
}
