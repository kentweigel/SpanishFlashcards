#SpanishFlashcards#

The Card page shows the user the instructions, and allows selection of:
* The direction of translation (Spanish to English or English to Spanish)
* Whether to show hints (not yet implemented) and/or statistics. (see below)
* Whether to show the words from various parts of speech.

An AngularJS controller on the Card form uses a service which reads card data and reads/writes history data via HTTP requests from 2 WebAPI controllers, which use Entity Framework to access a SQL Server database.

In order to alter the word list, you must have access to the Admin page.

**Statistics** are written back to the server, such as number of times a card has been seen, whether the user reported a correct guess, and whether a hint was used.
