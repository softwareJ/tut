
	
    //contract submission********************************************************************************************************* hit from other function when everything seems good
    init = (function() { 
    		
    	//submission info
    	let paymentInfo = {};
    	let tasksAndDuties = {};
    	let agreements = {};
    	let errorObject = {};
    	let editSet = {};
    
    	//hit the first call stack*********************************************************** second layer security called in other function
    	function callStack() {
    	  calculate();
    		setAssignments();
    		setAgreements();
    		setSignature();
    		setContact();
    		if(Object.keys(errorObject).length > 0) { 
    		    $('#myModal').modal('hide'); 
    		    checkErrors(); 
    		} 
    		else { 
    		    viewInvoiceSet(); 
    		    $('#myModal').modal('show'); 
    		}
    	}
    	
      //1 -- using undefined for operations -- I have to for the entire form to go through to display errors
    	function calculate() {
    	    
    		var oneDay = 24 * 60 * 60 * 1000;
    		var totalPay = document.getElementById("totalPay").value;
    		var payPeriod = document.getElementById("payPeriod").value;
    		var startDate = document.getElementById("startDate").value;
    		var endDate = document.getElementById("endDate").value;
    		var hourlyPay = document.getElementById("hourlyPay").value;
    		
    		errorObject = {};
    
    		var eD = parseDate(endDate) ? parseDate(endDate) : undefined;

    		var sD = parseDate(startDate) ? parseDate(startDate) : undefined;
    		!sD ? (errorObject.startDateErrorId = "your start date must be beyondthe next 7 days") : ""; // good
    		
    		var difference = (eD && sD) ? (eD.getTime() - sD.getTime()) : undefined;
    		var days = (Math.round(difference / oneDay)) && (Math.round(difference / oneDay) > 30) ? parseInt((Math.round(difference / oneDay))) : undefined;
    		!days ? (errorObject.totalDaysErrorId = "total amount of days must be more than 30") : ""; // good
    		
    		var invoiceAmount = (days / payPeriod) && (payPeriod < days) ? parseInt((days / payPeriod)) : undefined;
    		!invoiceAmount ? (errorObject.payPeriodErrorId = "The pey period can not exceed the total amount of days") : ""; // good
    		
    		var payPerInvoice = (totalPay / invoiceAmount) ? parseInt((totalPay / invoiceAmount)) : undefined;

    		var totalHours = (totalPay / hourlyPay) && (totalPay > hourlyPay) && (totalPay >= 200) ? parseInt((totalPay / hourlyPay)) : undefined;
    		!totalHours ? 
    		(errorObject.totalPayErrorId = "your total pay must be greater than your hourly pay and more than 200", // good
    		errorObject.hourlPayErrorId = "your your hourly pay must be less than your total pay and more than 200") : ""; // good
    		
    		var hoursPerInvoice = (totalHours / invoiceAmount) ? parseInt((totalHours / invoiceAmount)) : undefined;

    		if(Object.keys(errorObject).length > 0) { return; }
    		
    		//extra fall back in case they bull shit around -- move this bottom part -- only because i am setting this before i know the entire form is good
    		document.getElementById("scheduleUpdate").innerText = payPeriod ? " every " + payPeriod + " days" : "undefined";
    		document.getElementById("payUpdate").innerText = (invoiceAmount * payPerInvoice) ? " $" + (invoiceAmount * payPerInvoice) : "undefined"; 
    		document.getElementById("rateUpdate").innerText = hourlyPay ? " $" + hourlyPay : "undefined";
    		document.getElementById("hoursUpdate").innerText = totalHours ? totalHours + " hours" : "undefined";
    		document.getElementById("invoiceAmountUpdate").innerText = invoiceAmount ? " " + invoiceAmount + " invoices will be submitted" : "undefined";
    		document.getElementById("invoiceCostUpdate").innerText = payPerInvoice ? " each invoice will be $" + payPerInvoice : "undefined"; 
    		document.getElementById("amountOfDaystUpdate").innerText = days ? " " + days + " " : "undefined"
    		document.getElementById("invoicehoursUpdate").innerText = hoursPerInvoice ? " " + hoursPerInvoice : "undefined" ;
    		document.getElementById("endDateUpdate").innerText = eD ? " " + eD.toString().split(" ")[1] + " " + eD.toString().split(" ")[2] + " " + eD.toString().split(" ")[3] : "undefined";
    		document.getElementById("startDatetUpdate").innerText = sD ? " " + sD.toString().split(" ")[1] + " " + sD.toString().split(" ")[2] + " " + sD.toString().split(" ")[3] : "undefined";
    		
    		paymentInfo = {
    			payPeriod: payPeriod,
    			totalPay: totalPay,
    			invoiceAmount: invoiceAmount,
    			payPerInvoice: payPerInvoice,
    			hourlyPay: hourlyPay,
    			totalHours: totalHours,
    			totalDays: days,
    			hoursPerInvoice: hoursPerInvoice,
    			startDate: sD ? sD.toString().split(" ")[1] + " " + sD.toString().split(" ")[2] + " " + sD.toString().split(" ")[3] : undefined,
    			endDate: eD ? eD.toString().split(" ")[1] + " " + eD.toString().split(" ")[2] + " " + eD.toString().split(" ")[3] : undefined,
    			invoiceDates: (invoiceAmount && payPeriod && sD) ? getAllInvoiceDates(invoiceAmount, payPeriod, sD) : undefined,
    		};
    		
    	}
    
      //2
    	function setAssignments() {
    		var value = document.getElementById("assignments").value;
    		if(!value || value == null || value.length > 700 || value.length < 20) { errorObject.tasksAndDutiesErrorId = "Assignment text must be between 20 and 700 characters"; return;  }
    		tasksAndDuties = { assignmentText: value }
    		var projScope = document.getElementById("projectScope");
    		projScope.innerHTML = `<h2><u>*project scope</u></h2>`;
    		projScope.innerHTML += "<p>" + tasksAndDuties.assignmentText + "</p>";
    	}
    
      //3 -- check for length on this
    	function setAgreements() {

    		var trueLength = [];
    		var falseLength = [];
	  		var formCheckBoxes = document.getElementsByClassName("formCheckBoxes");
			
		  	if(formCheckBoxes.length !== 14) { location.replace("initContract.html?nope=Dont mess with the document"); };
    		
    		for(let i = 0; i < formCheckBoxes.length; i++) {
    			if(formCheckBoxes[i].checked == true) {
    				trueLength.push(formCheckBoxes[i].value);
    			} else {
    				falseLength.push(formCheckBoxes[i].value);
    			}
    		}
    		    		
    		agreements = {
    			agree: trueLength,
    			disagree: falseLength
    		}
    		
    		var agreementsModal = document.getElementById("agreementsModal");
    		var disagreementsModal = document.getElementById("disagreementsModal");
    		agreementsModal.innerHTML = ``;
    		disagreementsModal.innerHTML = ``;
    		
    		agreementsModal.innerHTML = `<h2 style = 'margin-left: 25px' ><u>*agreements</u></h2>`;
    		for(let i = 0; i < agreements.agree.length; i++) {
    			agreementsModal.innerHTML += `<b class = "contractInfo" style = "margin-left: 25px"> <small> agree: ${agreements.agree[i]} </small> </b> <hr> `;
    		}
    		
    		disagreementsModal.innerHTML = `<h2 style = 'margin-left: 25px' ><u>*disagreemnts</u></h2>`;
    		for(let i = 0; i < agreements.disagree.length; i++) {
    			disagreementsModal.innerHTML += ` <b class = "contractInfo" style = "margin-left: 25px"> <small> disagree: ${agreements.disagree[i]} </small> </b> <hr> `;
    		}
    		
    	}
    	
    	//4
    	function setSignature() {
    	    var signature = document.getElementById("signature").value;
    	    if(!signature || signature == null || signature.length < 4) { errorObject.signatureErrorId = "Signature: Please enter more than four letters"; }
    	    if(Object.keys(errorObject).length > 0) { return; }
    	    paymentInfo.signature = signature;
    	  	document.getElementById("signatureModal").innerHTML = `<h2 style = 'margin-left: 25px'><u>*Signature</u></h2>`;
    	  	document.getElementById("signatureModal").innerHTML += "<p style = 'margin-left: 25px'>" + paymentInfo.signature + "</p>";
    	}
    
        //5
    	function setContact() {
    	    var email = document.getElementById("email").value;
    	    var phone = document.getElementById("phoneNumber").value;
    	    if(!email || email == null || email.length < 0 || !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) { errorObject.emailErrorId = "your email is formatted incorrectly"; }
    	    if(!phone || phone == null || phone.length < 0 || !/^\d{10}$/.test(phone)) { errorObject.phoneErrorId = "your phone is formatted incorrectly"; }
    	    if(Object.keys(errorObject).length > 0) { return; }
    	    paymentInfo.email = email;
    	    paymentInfo.phone = phone;
    	  	document.getElementById("contactModal").innerHTML = `<h2 style = 'margin-left: 25px'><u>*Contact Info</u></h2>`;
    	  	document.getElementById("contactModal").innerHTML += "<p style = 'margin-left: 25px'>" + paymentInfo.email + "</p>";
    	  	document.getElementById("contactModal").innerHTML += "<p style = 'margin-left: 25px'>" + paymentInfo.phone + "</p>";
    	}
    
        //------------------------------------------------------------- first call stack extensions
    	function viewInvoiceSet() {
    	  if(!paymentInfo.invoiceDates || paymentInfo.invoiceDates == null) { return; } //check days as well
    		var invoiceSet = document.getElementById("invoiceSet");
    		invoiceSet.innerHTML = ``;
    		var element = document.createElement("DIV");
    		var set = ``;
    		for(let i = 0; i < paymentInfo.invoiceDates.length; i++) {
    			var last = i === paymentInfo.invoiceDates.length - 1 ? "end" : paymentInfo.invoiceDates[i + 1];
    			var payment = i + 1 === paymentInfo.invoiceDates.length ? "Free extended time" : paymentInfo.payPerInvoice
    			element.innerHTML += `
                <div class="user-frame container" style = "margin-top: 5px">
            		<h2><u> inv ${i+1}/${paymentInfo.invoiceDates.length-1}</u></h2>
            		<b class = "contractInfo">start date: ${paymentInfo.invoiceDates[i]} </b>
            		<hr>
            		<b class = "contractInfo">end date: ${last} - date payment is due </b>
            		<hr>
            		<b class = "contractInfo">hours worked: ${paymentInfo.hoursPerInvoice} </b>
            		<hr>
            		<b class = "contractInfo">hourly pay: $${paymentInfo.hourlyPay} </b>
            		<hr>
            		<b class = "contractInfo">invoice pay: $${payment} </b>
            		<hr>
            		<button class = "btn" style = "border-radius: 0px; background-color: black; color: white; margin-top: 30px;" onclick = "edit()" >Edit</button>
    			</div> `;
    		}
    	    invoiceSet.appendChild(element);
    	}
    	
    	//invoice extension -- 
    	function edit() {
    	    
    	}
    	
    	//cs 1 extension
    	function getAllInvoiceDates(invoiceLength, payPeriod, startDate) {
    		var increment = parseInt(payPeriod);
    		var invoiceDates = [];
    		var singleDate;
    		invoiceDates.push(convertDateString(startDate));
    		for(let i = 0; i < invoiceLength; i++) {
    			singleDate = startDate.setDate(startDate.getDate() + increment);
    			singleDate = new Date(singleDate);
    			invoiceDates.push(convertDateString(singleDate));
    		}
    		return invoiceDates;
    	}
    
        //cs 1 extension
    	function parseDate(input) {
        	try {
        		  var parts = input.match(/(\d+)/g);
        		  return new Date(parts[0], parts[1] - 1, parts[2]);
        	  } catch(err) {
        	      return undefined;
        	  }
    	}
    	
    	//cs 1 extension
    	function convertDateString(date) {
    		var a, b, c;
    		a = date.toString().split(" ")[1];
    		b = date.toString().split(" ")[2];
    		c = date.toString().split(" ")[3];
    		string = a + " " + b + " " + c;
    		return string;
    	}
    
    	
    	//second call stack ************************************************************************************
    	document.getElementById("submitContract").onclick = submitContract;
    	function submitContract() {
    		checkErrors();
    		pushDb(paymentInfo, agreements, tasksAndDuties);
    	}
    	
    
      //2
    	function pushDb(paymentInfo, agreements, tasksAndDuties) {
    		let errorsLength = document.getElementsByClassName("errIds");
    		$.ajax({
    			type: "POST",
    			url: "pushContract.php",
    			async: false,
    			data: {
    				paymentInfo: paymentInfo,
    				agreements: agreements,
    				tasksAndDuties: tasksAndDuties,
    				submit: "submit"
    			},
    			dataType: "json",
    			success: function(result, status, xhr) {
    				if(typeof(result) == "string") {
    					reRoute(result);
    				} else {
    					alert("Please fix the errors in red"); //loop through hrefs and run gsap
    					$('#myModal').modal('hide');
    				    for(let i = 0; i < errorsLength.length; i++) { errorsLength[i].innerHTML = ""; }
    				    for(let i = 0; i < result.length; i++) {
						  	var element = result[i].split("-")[0];
							  var text = result[i].split("-")[1];
							  document.getElementById(element).innerHTML = `<b style = "color: red">*${text}</b>`;
    				}
    			}
    		},
    			error: function(xhr, status, error) {
    				alert("error");
    			},
    		});
    	}
        
        //----------------------------------------------------------------------call stack 2 extension
    	function reRoute(email) {
    		location.replace(`../index.html?message=Thank you for submitting your contract, <b>please check your email to verify your account.</b> When verified, you will be redirected to your dashboard where you will see the state of your contract. Please expect a call from the owner in the next 0 - 3 days to briefly go over it once more. If everything goes through, you will be able to download your contract as a pdf for you to have and we will begin working. Thank you.&email=${email}`);
    	}
    	
    	//---------------------------------------------------------------------------------- shared extension -- have to do this after everything is set because im running operations which may result with nundefined. and i dont want to to it live
    	function checkErrors() {
    	    for(let i = 0; i < Object.keys(errorObject).length; i++) {
    	        var key = Object.keys(errorObject)[i];
    	        var value = Object.values(errorObject)[i];
    	        document.getElementById(key).innerText = value;
    	    }
    	    
    	    return Object.keys(errorObject)[0];
    	    
    	}
    	
    	return { 
    	    parseDate: parseDate,
    	    callStack: callStack 
    	};
    	
    })();
	
    //on key up -- pass in id and check if correct value -- nex sibling is for single cases and pushing to error id .first layer security
    countErrors = (function() {
    	    
    	    let errObject = {
    	        assignments: false,
    	        startDateEndDate: false,
    	        payPeriod: false,
    	        pay: false,
    	        email: false,
    	        phone: false, 
    	        signature: false,
    	    };
    	    
    	    let enableButton = document.getElementById("callStack");
    	    enableButton.onclick = init.callStack;
    	    enableButton.disabled = true;
    	    
    	    var input = document.getElementsByClassName("commonFormInput");
    	    for(let i = 0; i < input.length; i++) {
    	        if(i == 1 || i == 2 || i == 4) { 
    	            input[i].onchange = function(e) { checkCurrent(e.target.value, i, e.target.nextElementSibling) }  
    	        } else {
    	            input[i].onkeyup = function(e) { checkCurrent(e.target.value, i, e.target.nextElementSibling) } 
    	       }
    	    }
    	    
    	    function checkCurrent(value, index, targ) {
        	    switch(index) {
            	   //assignemnts
            	   case 0: 
            	        if(!value || value == null || value.length < 20 || value.length > 700) {
                	        document.getElementById(targ.id).innerHTML = "<b style = 'color: red'>*assignemnt text must be between 20 and 700 characters</b>";
                	        errObject.assignments = false;
            	        } else {
                	        document.getElementById(targ.id).innerHTML = "<b><span style = 'color: green; font-size: 50px'>&#10003;</span></b>";
                	        errObject.assignments = true;
            	        }
        	        break;
            	    //start date and end date and bi weekly, weekly monthly
            	    case 1:
            	    case 2:
            	    case 4:
            	        var oneDay = 24 * 60 * 60 * 1000;
            	        var sD = document.getElementById("startDate");
            	        var eD = document.getElementById("endDate");
            	        var startDate = init.parseDate(sD.value);
            	        var endDate = init.parseDate(eD.value);
            	            if((startDate && endDate)) {
                    	        var today = new Date();
                        	    var difference = endDate.getTime() - startDate.getTime();
                        	    var daysInContract = Math.round(difference / oneDay);
                        	    var startDateDays = Math.round(startDate.getTime() / oneDay);
                        	    var sevenDaysOut = Math.round(today.getTime() / oneDay) + 7;
                        	        if(daysInContract > 30 && startDateDays > sevenDaysOut) {
                        	            document.getElementById("startDateErrorId").innerHTML = "<b><span style = 'color: green; font-size: 50px'>&#10003;</span></b>";
                        	            document.getElementById("totalDaysErrorId").innerHTML = "<b><span style = 'color: green; font-size: 50px'>&#10003;</span></b>";
                        	            errObject.startDateEndDate = true;
                        	        } else {
                        	            document.getElementById("startDateErrorId").innerHTML = "<b style = 'color: red'>*The startdate must be 10 days out from today</b>";
                        	            document.getElementById("totalDaysErrorId").innerHTML = "<b style = 'color: red'>*The difference between the start and end date must be at least 30 days</b>";  
                        	            errObject.startDateEndDate = false;
                        	       }
                	        } else {
                        	    document.getElementById("startDateErrorId").innerHTML = "<b style = 'color: red'>*The startdate must be 10 days out from today</b>";
                        	    document.getElementById("totalDaysErrorId").innerHTML = "<b style = 'color: red'>*The difference between the start and end date must be at least 30 days</b>"; 
                        	    errObject.startDateEndDate = false;
                	        }
        	           //weekly, bi weekly monthly yearly case 4
            	        var payPeriod = parseInt(document.getElementById("payPeriod").value); // must be less
            	        if((payPeriod !== 7 && payPeriod !== 14 && payPeriod !== 30 && payPeriod !== 365)) {
            	            alert("iterate ove those elemnts change the value ans set to weekly");
            	        } else {
            	                if(payPeriod && daysInContract) {
            	                    if(payPeriod > daysInContract) {
            	                        document.getElementById("payPeriodErrorId").innerHTML = "<b style = 'color: red'>*Pay period must be more than the total days in contract</b>";
            	                        errObject.payPeriod = false;
            	                    } else {
                                        document.getElementById("payPeriodErrorId").innerHTML = "<b><span style = 'color: green; font-size: 50px'>&#10003;</span></b>";
                                        errObject.payPeriod = true;
            	                    }
            	                } else {
            	                    document.getElementById("payPeriodErrorId").innerHTML = "<b style = 'color: red'>*Pay period must be more than the total days in contract</b>"; 
            	                    errObject.payPeriod = false;
            	                }
            	             }
        	        break;
            	    //hourly pay and total pay
            	    case 3:
            	    case 5: 
            	        var hourlyPay = parseInt(document.getElementById("hourlyPay").value);
            	        var totalPay = parseInt(document.getElementById("totalPay").value);
            	            if(totalPay && hourlyPay) {
            	                if((totalPay < hourlyPay) || (totalPay < 200) || (hourlyPay < 9)) { 
                        			document.getElementById("totalPayErrorId").innerHTML = "<b style = 'color: red'>*The total pay must be more than the hourly pay and more than 300</b>";
                        			document.getElementById("hourlPayErrorId").innerHTML = "<b style = 'color: red'>*The hourly pay must be less than the total pay and at least $10</b>";
                        			errObject.pay = false;
            			        } else {
                              document.getElementById("totalPayErrorId").innerHTML = "<b><span style = 'color: green; font-size: 50px'>&#10003;</span></b>";
                        			document.getElementById("hourlPayErrorId").innerHTML = "<b><span style = 'color: green; font-size: 50px'>&#10003;</span></b>";
                        			errObject.pay = true;
                    			}
            	             } else {
            	               document.getElementById("totalPayErrorId").innerHTML = "<b style = 'color: red'>*The total pay must be more than the hourly pay and more than 300</b>";
                        		 document.getElementById("hourlPayErrorId").innerHTML = "<b style = 'color: red'>*The hourly pay must be less than the total pay and at least $10</b>";
                        		 errObject.pay = false;
            	             }
        	        break;
        	        //email
        	        case 6: 
        	            if(value && value !== null && value.length > 0 && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
        	                //check database
        	                document.getElementById(targ.id).innerHTML = "<b><span style = 'color: green; font-size: 50px'>&#10003;</span></b>";
        	                errObject.email = true;
        	            } else {
        	                document.getElementById(targ.id).innerHTML = "<b style = 'color: red'>*Your email is not valid</b>";
        	                errObject.email = false;
        	            }
        	        break;
        	        //phone
        	        case 7: 
        	            if(value && value !== null && value.length > 0 && /^\d{10}$/.test(value)) {
        	                document.getElementById(targ.id).innerHTML = "<b><span style = 'color: green; font-size: 50px'>&#10003;</span></b>";
        	                errObject.phone = true;
        	            } else {
        	                document.getElementById(targ.id).innerHTML = "<b style = 'color: red'>*Your phone number is not valid</b>";
        	                errObject.phone = false;
        	            }
        	        break;
        	        //signature
        	        case 8: 
        	            if(value && value !== null && value.length > 4) {
        	               document.getElementById(targ.id).innerHTML = "<b><span style = 'color: green; font-size: 50px'>&#10003;</span></b>";
        	               errObject.signature = true;
        	            } else {
        	                document.getElementById(targ.id).innerHTML = "<b style = 'color: red'>*Your signature is not valid</b>";
        	                errObject.signature = false;
        	            }  
					break;
					//break out
                    default: return;
        	    }
        	    
        	    //checking error count and updating div and enabling button if good, diabling if bad
        	    let count = 0;
                for(var o in errObject) {
                    if(errObject[o]) {
                        count+=1;
                    }
        	    }
        	    
        	    //enable button here for submission
        	    if(count === Object.keys(errObject).length) { enableButton.disabled = false;  } else { enableButton.disabled = true; }

    	  }
    })();
    
    
  //live chat with ATRAIN -- shared hosting soll ill just connect my twilio account and send messages to a foreign domain and update my db 
	messages = (function(){

    //connect 

    //on send -- to me

    //on receive from me

    //

	})();
