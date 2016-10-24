using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpanishFlashcards
{
    public static class FileLogger
    {
        #region Enums

        public enum Category
        {
            Debug = 0,
            Exception = 1,
            Information = 2,
            Warning = 3
        }

        public enum Priority
        {
            None = 0,
            High = 1,
            Medium = 2,
            Low = 3
        }

        #endregion Enums

        #region Fields

        private static readonly string m_filePath = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData),
                    "Kent Weigel",
                    ConfigurationManager.AppSettings["ApplicationName"],
                    "Log.txt");

        #endregion Fields

        #region Constructor

        #endregion Constructor

        #region Methods

        public static void WriteLine(string message, Category category, Priority priority, string userId, Exception exception = null)
        {
            string compoundMessage;

            if (exception == null)
            {
                compoundMessage = string.Format("{0}:[{1}-{2}-{3}] {4}", DateTime.Now, userId, category, priority, message);
            }
            else
            {
                //compoundMessage = string.Format("{0}:[{1}-{2}-{3}] {4}\r\nException Message: {5};\r\nStack Trace: {6}", DateTime.Now, userId, category, priority, message,
                //        exception.Message, exception.StackTrace);
                compoundMessage = string.Format("{0}:[{1}-{2}-{3}] {4}\r\nException: {5};", DateTime.Now, userId, category, priority, message,
                        exception.ToString());
            }

            MoveBackupsIfNeeded(message.Length);

            StreamWriter writer;
            var directoryName = Path.GetDirectoryName(m_filePath);

            if (File.Exists(m_filePath)) // Need to check again
            {
                writer = new StreamWriter(m_filePath, true, Encoding.UTF8);
            }
            else
            {
                if (!Directory.Exists(directoryName))
                {
                    Directory.CreateDirectory(directoryName);
                }

                writer = File.CreateText(m_filePath);
            }

            writer.WriteLine(compoundMessage);
            writer.Close();
        }

        private static void MoveBackupsIfNeeded(int messageSize)
        {
            int maxFileSize; // In megabytes.
            if (!int.TryParse(ConfigurationManager.AppSettings["LoggerMaxFileSizeMBs"], out maxFileSize))
                maxFileSize = 1;
            maxFileSize *= (int)Math.Pow(2d, 20d); // Multiply by 1,048,576
            var directoryName = Path.GetDirectoryName(m_filePath);
            var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(m_filePath);
            var fileExtension = Path.GetExtension(m_filePath);
            if (File.Exists(m_filePath))
            {
                var info = new FileInfo(m_filePath);
                if (info.Length + messageSize > maxFileSize)
                {
                    int numBackups;
                    if (!int.TryParse(ConfigurationManager.AppSettings["NumberOfLoggerBackupsToSave"], out numBackups))
                    {
                        numBackups = 1;
                    }

                    for (int i = numBackups; i > 0; i--)
                    {
                        var olderBackupName = Path.Combine(directoryName, string.Format("{0}{1}{2}", fileNameWithoutExtension, i, fileExtension));
                        if (File.Exists(olderBackupName))
                        {
                            File.Delete(olderBackupName);
                        }

                        var newerBackupName = Path.Combine(directoryName, string.Format("{0}{1}{2}", fileNameWithoutExtension, i - 1, fileExtension));
                        if (File.Exists(newerBackupName))
                        {
                            File.Move(newerBackupName, olderBackupName);
                        }
                    }

                    File.Move(m_filePath, Path.Combine(directoryName, string.Format("{0}1{1}", fileNameWithoutExtension, fileExtension)));
                }
            }
        }

        #endregion Methods
    }
}
