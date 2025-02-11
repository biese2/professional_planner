function testEmpty(){
  var constraints = {
    minHrs: 2,
    maxHrs: 5,
    minShift: 2,
    maxShift: 4,
    normalShift: 2.5,
    minEmployees: 2,
    maxEmployees: 4,
    prefferedNumberOfEmployees: 3,
    businessHrs: {
      m: { start: 10, end: 17.5 },
      t: { start: 10, end: 17.5 },
      w: { start: 10, end: 17.5 },
      r: { start: 10, end: 17.5 },
      f: { start: 10, end: 17.5 },
    },
  };

  var employees = {};

  let alg = await algorithm(constraints, employees);
  console.log(JSON.stringify(alg));
}

function runTests(){
  testEmpty();
}