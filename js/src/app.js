(function(d3, _){

  var id = function() {
    var count = 0;
    id = function() {
      return "_" + ++count;
    };
    return id();
  };

  var User = function (username) {
    this.name = username;
    this.id = id();
    this.role = "student";
  };

  var Answer = function (questionID, answerText) {
    this.question = questionID;
    this.student = app.currentUser;
    this.answer = answerText;
  };

  var Question = function (title, question, deadline) {
    this.id = id();
    this.answers = [];
    this.assignedTo = [];
    this.assignedBy = app.currentUser.name;
    this.question = question;
    this.deadline = deadline;
    this.title = title;
  };

  var app = {};

  app.init = function(state){
    app.v.clearPage();
    app.v.login();
  };

  app.v = {};
  app.m = {
    questions: {},
    users: {},
    answers: {}
  };

  app.currentUser = null;

  app.addQuestion = function (title, question, deadline) {
    if (!title || !question || !deadline) return;
    var q = {};
    q.assignedTo = [];
    q.assignedBy = app.currentUser.name;
    q.answers = [];
    q.title = title;
    q.question = question;
    q.deadline = deadline;
    var questionID = id();
    q.id = questionID;
    app.m.questions[questionID] = q;
  };

  app.addAnswer = function (answer) {
    if (!answer.question || !answer.answer || !app.m.questions[answer.question]) return;
    answer.student = app.currentUser.name;
    var answerID = id();
    app.m.answers[answerID] = answer;
  };

  app.loginUser = function (username) {
    if (!app.m.users[username]) {
      app.m.users[username] = new User(username);
    }

    app.currentUser = app.m.users[username];
    app.v.clearPage();
    app.v.logout();
    app.v.createQuestion();
    app.v.questions();
  };

  app.logoutUser = function () {
    app.currentUser = null;
    app.v.clearPage();
    app.v.login();
  }

  app.v.clearPage = function(){
    d3.select("body").selectAll("*").remove();
  };

  app.v.logout = function () {
    d3.select("div.logout").remove();

    var logout = d3.select("body").append("div")
      .classed("logout", true);

    logout.append("p")
      .text("logged in as " + app.currentUser.name);

    logout.append("input")
      .attr("type", "button")
      .attr("value", "log out")
      .on("click", app.logoutUser);
  };  

  app.v.login = function () {
    var loginID = id();
    d3.select("div.login").remove();
    var login = d3.select("body").append("div")
      .classed('login', true);

    login.append("h2")
      .text("login");
  

    var username = login.append("input")
      .attr("type", "text")
      .attr("placeholder", "Username");

    login.append("input")
      .attr("type", "button")
      .attr("value", "log in")
      .on("click", function () {
        app.loginUser(username.node().value.trim().toLowerCase());
      });
  };

  app.v.createQuestion = function () {
    var qt = d3.select("body").append("div")
      .attr("id", "create-question");

    qt.append("h2")
      .text("Create a new Question!");

    var title = qt.append("input")
      .attr("type", "text")
      .attr("placeholder", "Title");

    var questionID = id();
    var question = qt.append("input")
      .attr("id", questionID)
      .attr("type", "text")
      .attr("placeholder", "Question text here...");

    var deadlineID = id();
    var deadline = qt.append("input")
      .attr("id", deadlineID)
      .attr("type", "text")
      .attr("placeholder", "deadline");

    qt.append("input")
      .attr("type", "button")
      .attr("value", "Create Question")
      .on("click", function (n) {
        saveQuestion();
      });

    function saveQuestion () {
      app.addQuestion(title.node().value, question.node().value, deadline.node().value);
      title.node().value = '';
      question.node().value = '';
      deadline.node().value = '';
      app.v.questions();
    };

  };
 
  app.v.questions = function () {
    var body = d3.select("body");
    var questions = _.values(app.m.questions);
    
    body.selectAll("div.question").remove();
    body.selectAll("div.question")
      .data(questions)
      .enter()
      .append("div")
      .classed("question", true)
      .text(function (q) {return q.question;})
      .each(function (q) {
        d3.select(this).append('p')
        .text(function (q) {
          return "assigned by " + q.assignedBy + " to " + q.assignedTo.length + " students.";});

        if (q.assignedBy === app.currentUser.name) {
        d3.select(this).append('input')
        .attr("type", "button")
        .attr("value", "assign to another student");
        
        var answers = _.filter(app.m.answers, function (n) {
          return (n.question === q.id);
        });

        d3.select(this).selectAll('div.answer')
          .data(answers)
          .enter()
          .append('div')
          .classed("answer", true)
          .text(function (n) {return n.answer;});

        } else {
          d3.select(this).append("input")
            .attr("type", "button")
            .attr("value", "answer the question")
            .on("click", function () {
              app.v.createAnswer(this, q);
            }.bind(this));
        }
      });
  };

  app.v.createAnswer = function (questionNode, question) {
    d3.select("div#create-answer").remove();
    var a = d3.select(questionNode).append("div")
      .attr("id", "create-answer");

    a.append("h2")
      .text("Submit an answer");

    var answer = a.append("input")
      .attr("type", "text")
      .attr("placeholder", "answer text here...");

    a.append("input")
      .attr("type", "button")
      .attr("value", "Answer Question")
      .on("click", function (n) {
        saveAnswer();
      });

    function saveAnswer () {
      app.addAnswer({
        question: question.id,
        answer: answer.node().value
      });
      answer.node().value = '';
      app.v.answers(a, question);
    };


  };

  app.v.answers = function (answerNode, question) {
    var answers = _.filter(app.m.answers, function (n) {
      return n.question === question.id && n.student === app.currentUser.name;
    });
  };
  
  window.app = app;

})(d3, _)
