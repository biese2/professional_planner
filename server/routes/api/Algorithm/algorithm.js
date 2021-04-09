//Managerial Constraints {minHrs, maxHrs, minShift, maxShift, minEmployees, maxEmployees, prefferedEmployees, businessHrs}
//BusinessHrs {M: (start, end), T, W, R, F, S, Su}
//Employee List {Employee1, Employee2, ..., EmployN}
    //Need to make sure there are no duplicate Employees (Maybe make object and adders/delete)
//Employee {id, preferredMaxHrs, preferredMinHrs, preferredHrs, conflicts}
//conflicts {M: [(start,end),...], T, W, R, F}

//Solution {Employee1: {M: [(start,end),...], T, W, R, F}, ..., EmployeeN: {M: [(start,end),...], T, W, R, F}}

function makeArrayOfEmployees(employees) {
    var arr = [];
    for (x in employees) {
        arr.add({"ID": x, "preferredHrs": employees[x]["preferredHrs"], "actualHrs":0, "shifts": {"m":[],"t": [], "w":[], "r":[], "f":[]}});
    }
    return arr;
}

function randomEmployee(employees, employeeArr) {
    var len = employeeArr.length;
    var randEmployeeID = employeeArr(Math.random(len))["ID"];
    var conflicts = employees(randEmployeeID)["conflicts"];
    return [randEmployeeID, conflicts];
}

function isAvailable(employee, employeeArr, managerialConstraints, day, startTime, endOfDayTime) {
    //if employee already has shift here then return null
    if (employee["shifts"][day].length > 0) {
        return null;
    }
    var minHrs = managerialConstraints["minHrs"];
    var maxHrs = managerialConstraints["maxHrs"];
    var conflicts = employee["conflicts"][day];
    var endTime;
    var shiftLength = 0;
    var remainingHrs = employee["preferredHrs"] - employee["actualHrs"];

    //accumulate max valid shiftLength
    //NOT accounting for preferred employee time
    for (endTime = startTime; endTime < endOfDayTime; endTime += 0.25) {
        shiftLength = endTime-startTime;
        if (shiftLength === maxHrs || shiftLength > remainingHrs) {
            break;
        }
        for (c in conflicts) {
            if (!(endTime < c[0] || startTime > c[1])) {
                break;
            }
        }
    }

    if (shiftLength >= minHrs) {
        employee["shifts"][day].add([startTime, endTime]);
        employee["actualHrs"] += shiftLength;
        return endTime;
    }
    //if employee has conflict return null
    return null;
}

function createSchedule(employeeArr, unfilledShifts) {
    var sched = {"m":[],"t": [], "w":[], "r":[], "f":[]};
    for (day in sched) {
        for (employee in employeeArr) {
            for (shift in employee["shifts"][day]) {
                sched[day].add([employee["ID"], shift])
            }
        }
        for (unfilled in unfilledShifts[day]) {
            sched[day].add([-1, unfilled])
        }
    }

    return sched;
}

function algorithm(managerialConstraints, employees) {
    var unfilledShifts = {"m":[],"t": [], "w":[], "r":[], "f":[]};
    var employeeArr = makeArrayOfEmployees(employees);
    var employeeTotalHrsArr = makeArrayOfEmployees(employees);
    var weekdays = ["m", "t", "w", "r", "f"];
    var numEmployeesPerShift = 1;
    var tempEndTime = null;

    //iterate through week
    for (day in weekdays) {
        //iterate through number of employees per shift (default to 1)
        var startTime = managerialConstraints["businessHrs"]["start"];
        var endTime = managerialConstraints["businessHrs"]["end"];

        for (i in numEmployeesPerShift) {
            //iterate through day (per shift block 0.25 hrs)
            for (var i = startTime; i < endTime; i += 0.25) {
                //iterate through day employee list and check for availability during shift block (include randomness here)
                for (employee in employeeArr) {
                    //assign first available employee to that shift
                    tempEndTime = isAvailable(employee, employee);
                    if(tempEndTime != null) {
                        i = tempEndTime - 0.25;
                        break;
                    }
                }

                if(i===startTime) {
                    //noEmployeesAvailableError "Manual Action Required"
                    //make dummy employee to store unfilled shifts
                    //if for example 2 out of 3 shifts filled then skipAhead by 0.25 is good?
                    var skipAhead = 0.25;
                    unfilledShifts[day].add([startTime, startTime + 0.25]);
                    i += skipAhead - 0.25;
                }
            }
        }
    }
    //fill in empty spots (mark for manual action, "close-enough" logic, or mark red)
    
    var sched = createSchedule(employeeArr, unfilledShifts);
        
    return sched;
}
