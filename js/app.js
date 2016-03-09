(function(d3){

  var app = {};

  app.init = function(tests){ 
    app.v.displayStats(0, 0, 0, tests.length);
    app.v.displayTests(tests);
  };

  app.v = {};

  app.v.updateStats = function (passed, failed, running, total) {
    var div = d3.select('div.stats');

    div.select('.tests-running')
      .text('Tests Running: ' + running);

    div.select('.tests-passed')
      .text('Tests Passed: ' + passed);

    div.select('.tests-failed')
      .text('Tests Failed: ' + failed);

    div.select('.tests-complete')
      .text('Tests Complete: ' + (passed + failed));

    if (passed + failed === total) {
      div.select('h2.tests-complete')
        .text('All tests have now run.');
    }
  };

  app.v.displayStats = function (passed, failed, running, total) {

    var div = d3.select('body').selectAll('div.stats')
      .data([1])
      .enter()
      .append('div')
      .classed('stats', true);

    div.append('h2')
      .text('Tests Complete: ' + (passed + failed))
      .classed('tests-complete', true);

    div.append('span')
      .classed('tests-running', true)
      .text('Tests Running: ' + running);

    div.append('span')
      .classed('tests-passed', true)
      .text('Tests Passed: ' + passed);

    div.append('span')
      .classed('tests-failed', true)
      .text('Tests Failed: ' + failed);
  };

  app.v.displayTests = function (tests) {
    var numberPassed = 0;
    var numberFailed = 0;
    var numberRunning = 0;

    d3.select('body').selectAll('div.test')
      .data(tests)
      .enter()
      .append('div')
      .classed('test', true)
      .each(function (t) {
        var div = d3.select(this);

        div.append('input')
        .attr('type', 'button')
        .attr('value', 'Start Test')
        .on('click', function () {
          numberRunning++;
          app.v.updateStats(numberPassed, numberFailed, numberRunning, tests.length);
          div.classed('test-running', true);
          t.run(function (passed) {
            numberRunning--;
            div.classed('test-running', false);
            if (passed) {
              numberPassed++;
              div.classed('test-passed', true);
            } else {
              numberFailed++;
              div.classed('test-failed', true);
            }

            app.v.updateStats(numberPassed, numberFailed, numberRunning, tests.length);

          });
          d3.select(this)
            .classed('hidden', true);
        });

      div.append('p')
        .text(t.description);

      });

  };

  window.app = app;

})(d3)
