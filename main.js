/**/
const button = document.querySelector(".start");
button.addEventListener("click", () => startFunction());

const startFunction = function () {
  var start = confirm(
    "Приглашаю принять участие в консольной игре-викторине и проверить свои знания по языку JavaScript. В каждом вопросе будет предложено несколько вариантов ответов. Из которых вам нужно выбрать один правильный."
  );

  if (start) {
    console.log("%c Старт викторины! ", "background: #0B61A4; color: #FAFAFA");
    (function () {
      // 1) функция конструктор для создания объекта Question
      var Question = function (question, answers, correctAnswer) {
        this.question = question;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
      };

      // 4) Выбераем один случайный вопрос и выводим его в консоль, вместе с вариантами ответов. Создаем для этого дополнительный метод .consoleRandomQuestion для объектов класса Question
      Question.prototype.consoleRandomQuestion = function () {
        console.log(
          "%c Вопрос: " + this.question + " ",
          "background: #424242; color: #FAFAFA "
        );
        console.log("Варианты ответа:");
        this.answers.forEach(function (item, index) {
          console.log(index + 1 + ") " + item);
        });
      };

      //5) запрос ответа от пользователя. Создаем для этого дополнительный метод .consoleAnswer для объектов класса Question
      Question.prototype.consoleAnswer = function (
        answerUser,
        callback,
        tryCallback
      ) {
        var innerScore;
        var tryinnerScore;
        // console.log(!String(answerUser).includes("."));
        if (checkAnswer(answerUser)) {
          if (answerUser == this.correctAnswer) {
            console.log(
              "%c Правильный ответ! ",
              "background: #66BB6A; color: #FAFAFA"
            );
            innerScore = callback(true);
            tryinnerScore = tryCallback();
          } else {
            console.log(
              "%c Неверный ответ. Попробуйте еще раз. ",
              "background: #ef5350; color: #FAFAFA"
            );
            innerScore = callback(false);
            tryinnerScore = tryCallback();
          }
        } else {
          innerScore = callback(false);
          tryinnerScore = tryCallback();
        }

        // 11.2 Выводим в консоль счет участника запуская соответствующий метод
        this.displayScore(innerScore, tryinnerScore);
      };

      // 11.1 Создаем новый метод для вывода счета участника и количества попыток
      Question.prototype.displayScore = function (score, tryScore) {
        console.log("---------------------------------------");
        console.log(
          "%c Ваш счет равен: " + score + " ",
          "background: #FB8C00; color: #FAFAFA"
        );

        /*

      "%c Ваш счет равен: " + score,
      "background: #FB8C00; color: #FAFAFA"
    
*/

        console.log(
          "%c Количество попыток: " + tryScore + " ",
          "background: #FB8C00; color: #FAFAFA"
        );
        console.log("---------------------------------------");
      };

      // 10. Создаем функцию score() которая отработав оставит замыкание на себя и к своей внутренней переменной scoreValue. Внутри scoreValue будет записан счет участника
      function score() {
        var scoreValue = 0;
        // Ф-я score возвращает ф-ю по увеличению счета участника
        return function (correct) {
          if (correct) {
            scoreValue++;
          }
          return scoreValue;
        };
      }

      // Создаем функцию tryScore() которая отработав оставит замыкание на себя и к своей внутренней переменной tryScoreValue. Внутри tryScoreValue будет записано количество попыток участника
      function tryScore() {
        var tryScoreValue = 0;
        // Ф-я score возвращает ф-ю по увеличению попыток участника
        return function () {
          tryScoreValue++;
          return tryScoreValue;
        };
      }

      // функция корректности ввода ответа от пользователя
      function checkAnswer(answerUser) {
        if (answerUser == "") {
          alert(
            "Вы ничего не ввели. Введите номер ответа от 1 до 3. Попробуйте заново."
          );
          return false;
        } else if (answerUser == "exit" || answerUser == null) {
          console.log("==========================================");
          console.log(
            "%c Вы завершили участие в викторине.",
            "background: #0B61A4; color: #FAFAFA"
          );
          return false;
        } else if (
          Number(answerUser) < 4 &&
          Number(answerUser) > 0 &&
          Number.isInteger(Number(answerUser))
        ) {
          return true;
        } else {
          alert(
            "Вы ввели вариант ответа не числом от 1 до 3. Попробуйте заново."
          );
          return false;
        }
      }

      // 2) создаем 4 объекта на основе конструктора Question
      var question1 = new Question(
        "Какой оператор вернет тип переменной, переданной ему в качестве аргумента?",
        ["native", "instanceof", "typeof"],
        3
      );

      var question2 = new Question(
        "Сколько значений в JavaScript может принимать логический тип?",
        ["Один", "Два", "Три"],
        2
      );

      var question3 = new Question(
        "Что означает значение undefined?",
        [
          "Что значение не было присвоено",
          "Ошибочный результат вычислений",
          "Ссылкой на несуществующий объект ",
        ],
        1
      );

      var question4 = new Question(
        "Чем в JavaScript является функция?",
        ["Последовательностью", "Строкой", "Объектом"],
        3
      );

      // 3) Помещаем все вопросы в массив questions
      var questions = [];
      questions.push(question1);
      questions.push(question2);
      questions.push(question3);
      questions.push(question4);
      // альтернотивно и короче var questions = [question1, question2, question3, question4];

      // 10.1 Запускаем ф-ю  score() и возвращенную ф-ю записываем в переменную keepScore
      var keepScore = score();
      // 10.1 Запускаем ф-ю  tryScore() и возвращенную ф-ю записываем в переменную tryKeepScore
      var tryKeepScore = tryScore();

      // 8. После того как выводится результат ответа (верно/неверно),
      // отобразите следующий случайный вопрос.
      function nextQuestion() {
        // 4. Выберите один случайный вопрос
        // 4.1 Найти случайное число
        var randomNum = Math.floor(Math.random() * questions.length);

        // 4.3 Распечатываем в консоль случайны вопрос с вариантами ответов
        questions[randomNum].consoleRandomQuestion();

        // 5. Используйте функцию prompt для запроса ответа от пользователя.
        var answerUser = prompt(
          questions[randomNum].question +
            " Введите номер вашего ответа, в диапазоне от 1 до 3"
        );

        // 6. Проверьте, является ли введенный ответ корректным
        // 6.2 Проверка ответа с помощью метода consoleAnswer
        questions[randomNum].consoleAnswer(answerUser, keepScore, tryKeepScore);

        if (answerUser !== "exit" && answerUser !== null) {
          nextQuestion();
        }
      }

      nextQuestion();
    })();
  } else {
    console.log(
      "%c Отказ участвовать в викторине. ",
      "background: #ef5350; color: #FAFAFA"
    );
    alert("Вы отказались участвовать в моей викторине.");
  }
};
