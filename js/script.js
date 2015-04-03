window.addEventListener("load", init);

function init() {
	FastClick.attach(document.body);

	var tabCount = 3; // all tabs
	var currentTab = 1; // number of current tab
	var prevTab = 1;  // number of previous tab

	/* Show form */
	document.getElementById("reg-button").addEventListener("click", toggleForm);

	/* Navigation */
	document.getElementById("rf-tabs").addEventListener("click", catchTab);
	document.getElementById("rf-buttons").addEventListener("click", catchButton);

	/* Check form */
	var form = document.forms.form;
	//
	form.firstname.addEventListener("blur", checkUsertext);
	form.lastname.addEventListener("blur", checkUsertext);
	form.email.addEventListener("blur", checkUsertext);
	//
	form.password.addEventListener("keyup", checkUsertext);
	form.password.addEventListener("blur", checkUsertext);
	//
	form.fileImage.addEventListener("change", checkImage);
	//
	form.passwordRepeat.addEventListener("focus", checkPasswordCompare);
	form.passwordRepeat.addEventListener("keyup", checkPasswordCompare);
	form.passwordRepeat.addEventListener("blur", checkPasswordCompare);

	function toggleForm() {
		document.getElementById("overlay").classList.toggle("hidden");
		document.getElementById("reg-form").classList.toggle("show-form");
	}

	function catchTab(event) {
		var target = event && event.target || event.srcElement;
		while(target != this) {
			if (target.tagName = "span") {
				for (var i = 0; i < this.children.length; i++) {
					// find clicked tab
					if (target == this.children[i]) {
						currentTab = i + 1;
						break;
					}
				}
				// hide previous step, show next step
				toggleStep();
				break;
			}
			target = target.parentNode;
		}
	}

	function catchButton(event) {
		event.preventDefault();
		var target = event && event.target || event.srcElement;
		var action = target.getAttribute("data-action");
		// if button has an action-attribute, that attribute will be handled
		if (action) {
			pressButton[action]();
		}
	}

	function showPreviousStep() {
		if (currentTab != 1) {
			currentTab--;
			toggleStep();
		}
	}

	function showNextStep() {
		if (currentTab != tabCount) {
			currentTab++;
			toggleStep();
		} else {
			// last step - submit form
			submitForm();
		}
	}

	function ButtonFunctions() {
		this.cancel = toggleForm;
		this.backStep = showPreviousStep;
		this.nextStep = showNextStep;
	}
	var pressButton = new ButtonFunctions();

	function toggleStep() {
		document.getElementById("tab" + prevTab).classList.remove("tab-active");
		document.getElementById("rf-tab-pointer").classList.remove("pointer-step-" + prevTab);
		document.getElementById("rf-step-" + prevTab).classList.add("hide-step");
		document.getElementById("rf-step-" + prevTab).classList.remove("show-step");
		prevTab = currentTab;
		document.getElementById("tab" + currentTab).classList.add("tab-active");
		document.getElementById("rf-tab-pointer").classList.add("pointer-step-" + currentTab);
		document.getElementById("rf-step-" + currentTab).classList.remove("hide-step");
		document.getElementById("rf-step-" + currentTab).classList.add("show-step");
	}

	function checkUsertext() {
		// if element has pattern regexp becomes this pattern
		var regexp;
		if (this.getAttribute("data-pattern")) {
			regexp = new RegExp(this.getAttribute("data-pattern"));
		}
		var validElem = this.parentNode.querySelector(".fa-cell-valid");
		var invalidElem = this.parentNode.querySelector(".cell-invalid");
		// if usertext is not matching regexp or it is empty - show invalid, else - show valid
		if (!this.value.match(regexp) || !this.value) {
			toggleValidation(validElem, invalidElem);
			return;
		} else {
			toggleValidation(invalidElem, validElem);
			return true;
		}
	}

	function checkImage() {
		document.getElementById("step2-cell-placeholder").classList.add("hidden");
		document.getElementById("step2-cell-value").classList.remove("hidden");
		document.getElementById("step2-cell-value").innerHTML = this.value;
		toggleValidation(null, this.parentNode.querySelector(".fa-cell-valid"));
	}

	function checkPasswordCompare() {
		var validElem = this.parentNode.querySelector(".fa-cell-valid");
		var invalidElem = this.parentNode.querySelector(".cell-invalid");
		// comparing password fields
		if (this.value && this.value == this.form.password.value) {
			toggleValidation(invalidElem, validElem);
			return true;
		} else {
			toggleValidation(validElem, invalidElem);
			return;
		}
	}

	function toggleValidation(hiddenELem, shownElem) {
		if (hiddenELem && !hiddenELem.classList.contains("hidden")) {
			hiddenELem.classList.add("hidden");
		}
		shownElem.classList.remove("hidden");
	}

	function submitForm() {
		// final validation
		if (checkUsertext.call(form.firstname) &&
			checkUsertext.call(form.lastname) &&
			checkUsertext.call(form.email) &&
			checkUsertext.call(form.password) &&
			checkPasswordCompare.call(form.passwordRepeat)
		) {
			// Submit
			form.submit();
		} else {
			// if there is at least one invalid field - return
			return;
		}
	}
}