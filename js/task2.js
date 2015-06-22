//Open booking Window
function bookMyTicket() {
    processSeatMap();
    $('#bookingWindow').show();
}

var selectedSeats = [];
var availableSeats = [];

//Create a dynamic seatMap chunk using JSON: oSeatMap
function processSeatMap() {
    var noOfClasses = oSeatMap.length;
    //var classObject = document.getElementById('classItem'),
    //cloneClass = classObject.cloneNode(true);
    $('#bookingSeatMap').empty();
    $('#classSelect').empty();
    var htmlToAdd = '';
    for (var iter = 0; iter < noOfClasses; iter++) {

        $('#classSelect').append('<option value = ' + iter + '>' + oSeatMap[iter].className + '</option>');
        htmlToAdd = '';
        htmlToAdd = htmlToAdd + '<div id="classItem_' + iter + '" class="classItem">';
        htmlToAdd += '<div class="classType"><label class="className">' + oSeatMap[iter].className + '</label></div>';
        htmlToAdd += '<div class="seats" style="background-color:' + oSeatMap[iter].classColor + '">';
        var rows = oSeatMap[iter].rows;
        var rowsLength = rows.length;
        for (var iterRow = 0; iterRow < rowsLength; iterRow++) {
            if (iterRow > 0) {
                htmlToAdd += '<br /><br />';
            }
            htmlToAdd += '<div class="seatName left">' + rows[iterRow].name + '</div><div class="seatingArrangement left">';
            var seats = rows[iterRow].seats;
            var seatlength = seats.length;

            for (var iterSeat = 0; iterSeat < seatlength; iterSeat++) {
                var imageName = "",
                    additionalFunction = "";

                switch (seats[iterSeat].isBooked) {
                    case true:
                        imageName = "Booked";
                        additionalFunction = ' class="seatItem" ';
                        break;
                    default:
                        additionalFunction = ' class="seatItem hoverMouseClickable" onClick= "modifyThis(this)"';
                        imageName = "default";
                }

                htmlToAdd += '<img id="' + iter + '_' + iterRow + '_' + iterSeat + '_' + seats[iterSeat].seatNumber + '"src="images/' + imageName + '.png" alt=""' + additionalFunction + ' />';
            }
            htmlToAdd += '</div>';
        }

        htmlToAdd += '</div></div><br />';
        $('#bookingSeatMap').append(htmlToAdd);
    }
    $('#seatCount>option:eq(0)').attr('selected', 'selected');
    $('#bookingSeatMap').hide();
    $('#bookingSeatMapDisabled').show();
}

//Closes window
function closeBookingWindow() {
	removeSelectedValues();
        selectedSeats = [];
		availableSeats = [];
    $('#bookingWindow').hide();
}

var noOfSelectedSeats = 0;

//Finds the number of seat as input
function selectSeats(th) {
    noOfSelectedSeats = th.selectedIndex;
    if (th.selectedIndex > 0) {
        $('#bookingSeatMapDisabled').hide();
        $('#bookingSeatMap').show();
    } else {
        $('#bookingSeatMapDisabled').show();
        $('#bookingSeatMap').hide();
    }

    if (selectedSeats.length === noOfSelectedSeats) {
        $('#btnCheckout').removeClass('btnDisabled').addClass('btnEnabled');
    } else {
        $('#btnCheckout').removeClass('btnEnabled').addClass('btnDisabled');
    }
}

//To check if a string is present
Array.prototype.has = function(elementValue) {
    var i = this.length;
    if (this.indexOf(elementValue) > -1) {
        return 1;
    } else return 0;
};

//Check if the seat is single seat silo: left and right are occupied
function isASingleSeatSilo(classNumber, rowNumber, seatNumber) {
    if (oSeatMap[classNumber].rows[rowNumber].seats[seatNumber] !== undefined && !oSeatMap[classNumber].rows[rowNumber].seats[seatNumber].isBooked && !oSeatMap[classNumber].rows[rowNumber].seats[seatNumber].isSelected) {
        if (
            (
                oSeatMap[classNumber].rows[rowNumber].seats[seatNumber + 1] === undefined || oSeatMap[classNumber].rows[rowNumber].seats[seatNumber + 1].isBooked || oSeatMap[classNumber].rows[rowNumber].seats[seatNumber + 1].isSelected
            ) &&
            (
                oSeatMap[classNumber].rows[rowNumber].seats[seatNumber - 1] === undefined || oSeatMap[classNumber].rows[rowNumber].seats[seatNumber - 1].isBooked || oSeatMap[classNumber].rows[rowNumber].seats[seatNumber - 1].isSelected
            )
        ) return true;
    }
    return false;
}

function noOfSeatSelectedInCurrentRow(classNumber, rowNumber){
	var strToSearch = classNumber + "_" + rowNumber + "_";
	var regex = new RegExp(strToSearch, 'g');
	var temp = selectedSeats.toString();
	return (temp.match(regex) || []).length;		
}

//Select or de-select a seat
function modifyThis(th) {
    var ids = th.id.split('_');
    if (oSeatMap[ids[0]].rows[ids[1]].seats[ids[2]].isSelected) {
        oSeatMap[ids[0]].rows[ids[1]].seats[ids[2]].isSelected = false;
        $(('#' + th.id)).attr('src', 'images/default.png');
        selectedSeats.splice(selectedSeats.indexOf(th.id), 1);
        var seatIndexLeft = parseInt(ids[2]) - 1;
        var seatIndexRight = parseInt(ids[2]) + 1;
        // if we de-select a mid seat
        if (oSeatMap[ids[0]].rows[ids[1]].seats[seatIndexLeft] !== undefined && oSeatMap[ids[0]].rows[ids[1]].seats[seatIndexLeft].isSelected && oSeatMap[ids[0]].rows[ids[1]].seats[seatIndexRight] !== undefined && oSeatMap[ids[0]].rows[ids[1]].seats[seatIndexRight].isSelected) {
            // iterate over selected selectedSeats and make it null after marking all as unselect
            // make available seat as []
            for (var iter = 0; iter < selectedSeats.length; iter++) {
                ids = selectedSeats[iter].split('_');
                oSeatMap[ids[0]].rows[ids[1]].seats[ids[2]].isSelected = false;
                $(('#' + selectedSeats[iter])).attr('src', 'images/default.png');
            }
            selectedSeats = [];
            availableSeats = [];
        } else if (oSeatMap[ids[0]].rows[ids[1]].seats[seatIndexRight] === undefined 
			|| oSeatMap[ids[0]].rows[ids[1]].seats[seatIndexRight].isSelected
			|| oSeatMap[ids[0]].rows[ids[1]].seats[seatIndexRight].isBooked) {
            if(noOfSeatSelectedInCurrentRow(ids[0], ids[1]) > 0) 
				availableSeats.push(th.id);
            if (oSeatMap[ids[0]].rows[ids[1]].seats[seatIndexLeft] !== undefined && availableSeats.has(ids[0] + '_' + ids[1] + '_' + seatIndexLeft + '_' + oSeatMap[ids[0]].rows[ids[1]].seats[seatIndexLeft].seatNumber)) {
                availableSeats.splice(availableSeats.indexOf(ids[0] + '_' + ids[1] + '_' + seatIndexLeft + '_' + oSeatMap[ids[0]].rows[ids[1]].seats[seatIndexLeft].seatNumber), 1);
            }
        } else if (oSeatMap[ids[0]].rows[ids[1]].seats[seatIndexLeft] === undefined 
			|| oSeatMap[ids[0]].rows[ids[1]].seats[seatIndexLeft].isSelected
			|| oSeatMap[ids[0]].rows[ids[1]].seats[seatIndexLeft].isBooked
			) {
            if(noOfSeatSelectedInCurrentRow(ids[0], ids[1]) > 0)
				availableSeats.push(th.id);
            if (oSeatMap[ids[0]].rows[ids[1]].seats[seatIndexRight] !== undefined && availableSeats.has(ids[0] + '_' + ids[1] + '_' + seatIndexRight + '_' + oSeatMap[ids[0]].rows[ids[1]].seats[seatIndexRight].seatNumber)) {
                availableSeats.splice(availableSeats.indexOf(ids[0] + '_' + ids[1] + '_' + seatIndexRight + '_' + oSeatMap[ids[0]].rows[ids[1]].seats[seatIndexRight].seatNumber), 1);
            }
        }

        if (selectedSeats.length === 0)
            availableSeats = [];
    } else {
        if (selectedSeats.length === noOfSelectedSeats) {
            alert('Seats count reached! Please increase count or remove seat selection.');
            return;
        }
        var selectIt = false;
        if (availableSeats.length === 0 || (availableSeats.length > 0 && availableSeats.has(th.id))) {
            selectIt = true;
        }
        if (!selectIt) {
            alert("Please select adjacent seats.");
            return;
        }

        oSeatMap[ids[0]].rows[ids[1]].seats[ids[2]].isSelected = true;
        if (selectedSeats.length + 1 === noOfSelectedSeats) { // check if single seat silo occurring
            // isASingleSeatSilo
            if (isASingleSeatSilo(ids[0], ids[1], (parseInt(ids[2]) + 1))) {
                if (isASingleSeatSilo(ids[0], ids[1], (parseInt(ids[2]) - noOfSeatSelectedInCurrentRow(ids[0], ids[1]) - 1))) {
                    oSeatMap[ids[0]].rows[ids[1]].seats[ids[2]].isSelected = false;
                    alert('You are creating a single seat silo on both sides. Please avoid it.');
                    return;
                }
            } else if (isASingleSeatSilo(ids[0], ids[1], (parseInt(ids[2]) - 1))) {
                if (isASingleSeatSilo(ids[0], ids[1], (parseInt(ids[2]) + noOfSeatSelectedInCurrentRow(ids[0], ids[1]) + 1))) {
                    oSeatMap[ids[0]].rows[ids[1]].seats[ids[2]].isSelected = false;
                    alert('You are creating a single seat silo on both sides. Please avoid it.');
                    return;
                }
            }
        }

        selectedSeats.push(th.id);
        if (availableSeats.has(th.id)) {
            availableSeats.splice(availableSeats.indexOf(th.id), 1);
        }
        //oSeatMap[ids[0]].rows[ids[1]].seats[ids[2]].isSelected = true;
        $(('#' + th.id)).attr('src', 'images/selected.png');
        // code to select adjacent seats only
        var seatIndex = parseInt(ids[2]) - 1;
        if (oSeatMap[ids[0]].rows[ids[1]].seats[seatIndex] !== undefined && !oSeatMap[ids[0]].rows[ids[1]].seats[seatIndex].isBooked && !oSeatMap[ids[0]].rows[ids[1]].seats[seatIndex].isSelected) {
            availableSeats.push(ids[0] + '_' + ids[1] + '_' + seatIndex + '_' + oSeatMap[ids[0]].rows[ids[1]].seats[seatIndex].seatNumber);
        }
        seatIndex += 2;
        if (oSeatMap[ids[0]].rows[ids[1]].seats[seatIndex] !== undefined && !oSeatMap[ids[0]].rows[ids[1]].seats[seatIndex].isBooked && !oSeatMap[ids[0]].rows[ids[1]].seats[seatIndex].isSelected) {
            availableSeats.push(ids[0] + '_' + ids[1] + '_' + seatIndex + '_' + oSeatMap[ids[0]].rows[ids[1]].seats[seatIndex].seatNumber);
        }
    }
    if (selectedSeats.length === noOfSelectedSeats) {
        $('#btnCheckout').removeClass('btnDisabled').addClass('btnEnabled');
    } else {
        $('#btnCheckout').removeClass('btnEnabled').addClass('btnDisabled');
    }
}

function removeSelectedValues(){
	var ids = "";
	for (var iter = 0; iter < selectedSeats.length; iter++) {
            ids = selectedSeats[iter].split('_');
            oSeatMap[ids[0]].rows[ids[1]].seats[ids[2]].isSelected = false;
    }
} 

//Final Booking Details
function bookFinalSeats() {
    if (selectedSeats.length === noOfSelectedSeats) {
        var ids = "";
        var resultMessage = 'We have booked below seats for you: ';
        for (var iter = 0; iter < selectedSeats.length; iter++) {
            ids = selectedSeats[iter].split('_');
            resultMessage += '\n' + oSeatMap[ids[0]].className + ' ' + oSeatMap[ids[0]].rows[ids[1]].seats[ids[2]].seatNumber;
            oSeatMap[ids[0]].rows[ids[1]].seats[ids[2]].isSelected = false;
            oSeatMap[ids[0]].rows[ids[1]].seats[ids[2]].isBooked = true;
        }
		removeSelectedValues();
        selectedSeats = [];
		availableSeats = [];
        alert(resultMessage);
        closeBookingWindow();
    }
}

// seatMap JSON
var oSeatMap = [{
    "className": "Gold",
    "classColor": "#FFFFB2",
    "rows": [{
        "name": "A",
        "seats": [{
            "seatNumber": "A1",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "A2",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "A3",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "A4",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "A5",
            "isBooked": false,
            "isSelected": false
        }]
    }, {
        "name": "B",
        "seats": [{
            "seatNumber": "B1",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "B2",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "B3",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "B4",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "B5",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "B6",
            "isBooked": true,
            "isSelected": false
        }]
    }, {
        "name": "C",
        "seats": [{
            "seatNumber": "C1",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "C2",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "C3",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "C4",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "C5",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "C6",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "C7",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "C8",
            "isBooked": false,
            "isSelected": false
        }]
    }]
}, {
    "className": "Silver",
    "classColor": "#BFD4D4",
    "rows": [{
        "name": "A",
        "seats": [{
            "seatNumber": "A1",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "A2",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "A3",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "A4",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "A5",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "A6",
            "isBooked": false,
            "isSelected": false
        }]
    }, {
        "name": "B",
        "seats": [{
            "seatNumber": "B1",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "B2",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "B3",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "B4",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "B5",
            "isBooked": true,
            "isSelected": false
        }]
    }, {
        "name": "C",
        "seats": [{
            "seatNumber": "C1",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "C2",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "C3",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "C4",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "C5",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "C6",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "C7",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "C8",
            "isBooked": true,
            "isSelected": false
        }]
    }, {
        "name": "D",
        "seats": [{
            "seatNumber": "D1",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "D2",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "D3",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "D4",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "D5",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "D6",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "D7",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "D8",
            "isBooked": true,
            "isSelected": false
        }]
    }, {
        "name": "E",
        "seats": [{
            "seatNumber": "E1",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "E2",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "E3",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "E4",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "E5",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "E6",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "E7",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "E8",
            "isBooked": false,
            "isSelected": false
        }]
    }]
}, {
    "className": "Bronze",
    "classColor": "#EAC9A9",
    "rows": [{
        "name": "A",
        "seats": [{
            "seatNumber": "A1",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "A2",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "A3",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "A4",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "A5",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "A6",
            "isBooked": false,
            "isSelected": false
        }]
    }, {
        "name": "B",
        "seats": [{
            "seatNumber": "B1",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "B2",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "B3",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "B4",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "B5",
            "isBooked": true,
            "isSelected": false
        }]
    }, {
        "name": "C",
        "seats": [{
            "seatNumber": "C1",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "C2",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "C3",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "C4",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "C5",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "C6",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "C7",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "C8",
            "isBooked": true,
            "isSelected": false
        }]
    }, {
        "name": "D",
        "seats": [{
            "seatNumber": "D1",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "D2",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "D3",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "D4",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "D5",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "D6",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "D7",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "D8",
            "isBooked": true,
            "isSelected": false
        }]
    }, {
        "name": "E",
        "seats": [{
            "seatNumber": "E1",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "E2",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "E3",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "E4",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "E5",
            "isBooked": true,
            "isSelected": false
        }, {
            "seatNumber": "E6",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "E7",
            "isBooked": false,
            "isSelected": false
        }, {
            "seatNumber": "E8",
            "isBooked": false,
            "isSelected": false
        }]
    }]
}];