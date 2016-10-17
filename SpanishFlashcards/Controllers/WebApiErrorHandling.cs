using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace SpanishFlashcards.Controllers
{
    public static class WebApiErrorHandling
    {
        #region Fields

        private const int m_maxIterations = 100;

        #endregion Fields

        #region Methods

        public static String ConcatResultErrors(IdentityResult result)
        {
            StringBuilder sb = new StringBuilder();

            foreach (var error in result.Errors)
            {
                sb.AppendLine(error);
            }

            return sb.ToString();
        }

        public static String ConcatModelStateErrors(System.Web.Http.ModelBinding.ModelStateDictionary modelState)
        {
            var sb = new StringBuilder();

            foreach (var field in modelState)
            {
                foreach (var error in field.Value.Errors)
                {
                    if (!String.IsNullOrWhiteSpace(error.ErrorMessage))
                    {
                        sb.AppendLine(error.ErrorMessage);
                    }
                    else
                    {
                        sb.AppendLine(error.Exception?.Message);
                    }
                }
            }

            return sb.ToString();
        }

        public static String GetInnermostExceptionMessage(Exception ex)
        {
            int i = 0;
            while ((ex.InnerException != null) && (++i < m_maxIterations))
            {
                ex = ex.InnerException;
            }

            return ex.Message;
        }

        #endregion Methods
    }
}