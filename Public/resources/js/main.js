let init = function () {
  loadAllContacts();
  loadCompanyNames();
}


let printMsg = function (msg, type) {

  $.notify(
    {
      title: "<strong>Success</strong>",
      message: msg
    },
    {
      type: type,
      z_index: 2000
    }
  );

}


let loadAllContacts = function () {
  axios
    .get("/contact", {})
    .then(function (response) {
      if (response.status === 200) {

        // Remove all existing contacts in table
        var list = document.getElementById("table-body");
        while (list.firstChild) {
          list.removeChild(list.firstChild);
        }

        for (var i = 0; i < response.data.contact.length; i++) {

          var contact = response.data.contact[i];
          let table = document.getElementById("AddressTable").getElementsByTagName("tbody")[0];
          var newRow = table.insertRow(table.rows.length);
          newRow.className = "contact";
          newRow.onclick = function () {loadPerson(this.id);};
          newRow.setAttribute("data-toggle", "modal");
          newRow.setAttribute("data-target", "#newPersonModal");

          newRow.id = contact._id;
          newRow.insertCell(0).appendChild(document.createTextNode(contact.name.forename));
          newRow.insertCell(1).appendChild(document.createTextNode(contact.name.surname));
          newRow.insertCell(2).appendChild(document.createTextNode(contact.phone));
          newRow.insertCell(3).appendChild(document.createTextNode(contact.email));
          newRow.insertCell(4).appendChild(document.createTextNode(contact.address));
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });

};


let loadContactsByCompany = function () {

  if (document.getElementById("companyNames").options[document.getElementById("companyNames").selectedIndex].id === "n/a") {
    loadAllContacts();
    return;
  }

  axios
    .get("/contact/allCompany/" + document.getElementById("companyNames").options[document.getElementById("companyNames").selectedIndex].id, {})
    .then(function (response) {
      if (response.status === 200) {

        var list = document.getElementById("table-body");
        while (list.firstChild) {
          list.removeChild(list.firstChild);
        }

        for (var i = 0; i < response.data.contact.length; i++) {

          var contact = response.data.contact[i];
          let table = document.getElementById("AddressTable").getElementsByTagName("tbody")[0];
          var newRow = table.insertRow(table.rows.length);
          newRow.className = "contact";
          newRow.onclick = function () {
            loadPerson(this.id);
          };
          newRow.setAttribute("data-toggle", "modal");
          newRow.setAttribute("data-target", "#newPersonModal");

          newRow.id = contact._id;
          newRow
            .insertCell(0)
            .appendChild(document.createTextNode(contact.name.forename));
          newRow
            .insertCell(1)
            .appendChild(document.createTextNode(contact.name.surname));
          newRow
            .insertCell(2)
            .appendChild(document.createTextNode(contact.phone));
          newRow
            .insertCell(3)
            .appendChild(document.createTextNode(contact.email));
          newRow
            .insertCell(4)
            .appendChild(document.createTextNode(contact.address));
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}


let loadCompanyNames = function () {
  axios
    .get("/contact/companyNames", {})
    .then(function (response) {
      if (response.status === 200) {

        // Clear list of current company names
        var myNode = document.getElementById("companyNames");
        while (myNode.firstChild) {
          myNode.removeChild(myNode.firstChild);
        }

        let companyNames = document.getElementById("companyNames");
        var contacts = response.data.contact;

        // Create "All" company
        var option = document.createElement("OPTION");
        option.id = "n/a";
        option.innerText = "";
        companyNames.appendChild(option);

        // Add contacts to table
        for (var i = 0; i < contacts.length; i++) {
          option = document.createElement("OPTION");
          option.id = contacts[i]._id;
          option.innerText = contacts[i].companyName;
          companyNames.appendChild(option);
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};


let addPerson = function () {
  var personId;
  var companyId = document.getElementById("companyNamesPerson").options[document.getElementById("companyNamesPerson").selectedIndex].id;

  var reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (reEmail.test(document.getElementById("personEmail").value) == false) {
    printMsg("Please enter a valid email address", "warning");
    return;
  }

  if (companyId === "n/a") {
    companyId = undefined;
  }

  axios
    .post("/contact", {
      forename: document.getElementById("personForename").value,
      surname: document.getElementById("personSurname").value,
      email: document.getElementById("personEmail").value,
      phone: document.getElementById("personPhone").value,
      address: document.getElementById("personAddress").value,
      companyId: companyId,
    })
    .then(function (response) {
      console.log(response);

      personId = response.data.contact._id;

      // Add to company staff list
      if (companyId != undefined) {
        updateOrgStaff(companyId, personId, true);
      }

      printMsg("New contact created!", "success");


      if (document.getElementById("companyNames").options[document.getElementById("companyNames").selectedIndex].id === document.getElementById("companyNamesPerson").options[document.getElementById("companyNamesPerson").selectedIndex].id) {
        let table = document.getElementById("AddressTable").getElementsByTagName("tbody")[0];
        var newRow = table.insertRow(table.rows.length);
        newRow.className = "contact";
        newRow.onclick = function () {
          loadPerson(this.id);
        };

        newRow.setAttribute("data-toggle", "modal");
        newRow.setAttribute("data-target", "#newPersonModal");

        newRow.id = personId;
        newRow.insertCell(0).appendChild(document.createTextNode(document.getElementById("personForename").value));
        newRow.insertCell(1).appendChild(document.createTextNode(document.getElementById("personSurname").value));
        newRow.insertCell(2).appendChild(document.createTextNode(document.getElementById("personPhone").value));
        newRow.insertCell(3).appendChild(document.createTextNode(document.getElementById("personEmail").value));
        newRow.insertCell(4).appendChild(document.createTextNode(document.getElementById("personAddress").value));
      }

      document.getElementById("personModalCloseBtn").click();
    })
    .catch(function (error) {
      console.log(error);
      return;
    });
};


let addOrganisation = function () {

  if (document.getElementById("organisationName").value.trim() === "") {
    printMsg("Please give an organisation name", "warning");
    return;
  }

  var reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (reEmail.test(document.getElementById("organisationEmail").value) == false) {
    printMsg("Please enter a valid email address", "warning");
    return;
  }


  axios
    .post("/contact", {
      companyName: document.getElementById("organisationName").value,
      email: document.getElementById("organisationEmail").value,
      phone: document.getElementById("organisationPhone").value,
      address: document.getElementById("organisationAddress").value
    })
    .then(function (response) {
      console.log(response);
      if (response.status === 201) {

        printMsg("New Organisation created!", "success");

        var option = document.createElement("OPTION");
        option.id = response.data.contact._id;
        option.innerText = document.getElementById("organisationName").value;
        companyNames.appendChild(option);

        document.getElementById("newOrganisationModal").click();
      }
    })
    .catch(function (error) {
      console.log(error);
    });

};


let setUp = function () {
  var companyId = document.getElementById("companyNames").options[
    document.getElementById("companyNames").selectedIndex
  ].id;
  var companyNamesPerson = document
    .getElementById("companyNames")
    .cloneNode(true);
  companyNamesPerson.id = "companyNamesPerson";
  document.getElementById("companyNamesPerson").replaceWith(companyNamesPerson);

  for (var i = 0; i < document.getElementById("companyNamesPerson").length; i++) {
    if (document.getElementById("companyNamesPerson").options[i].id === companyId) {
      document.getElementById("companyNamesPerson").options[i].selected = true;
      break;
    }
  }
};


let newOrgModal = function () {
  document.getElementById("organisationModalTitle").innerText = "New Organisation";
  document.getElementById("createOrganisationBtn").style.display = "block";
  document.getElementById("submitOrganisationBtn").style.display = "none";

  document.getElementById("organisationName").value = "";
  document.getElementById("organisationEmail").value = "";
  document.getElementById("organisationPhone").value = "";
  document.getElementById("organisationAddress").value = "";

  document.getElementById("deleteOrganisationBtn").style.display = "none";
};


let newPersonModal = function () {
  setUp();

  document.getElementById("personModalTitle").innerText = "New Person";

  document.getElementById("createPersonBtn").style.display = "block";
  document.getElementById("submitPersonBtn").style.display = "none";

  document.getElementById("personForename").value = "";
  document.getElementById("personSurname").value = "";
  document.getElementById("personEmail").value = "";
  document.getElementById("personPhone").value = "";
  document.getElementById("personAddress").value = "";

  document.getElementById("deletePersonBtn").style.display = "none";
};


let loadOrganisation = function () {

  var companyId = document.getElementById("companyNames").options[
    document.getElementById("companyNames").selectedIndex
  ].id;

  if (companyId === "n/a") {
    printMsg("Please select an organisation first!", "warning");
    return;
  }

  $('#newOrganisationModal').modal("show");

  document.getElementById("deleteOrganisationBtn").style.display = "block";

  axios
    .get("/contact/company/" + companyId, {})
    .then(function (response) {
      if (response.status === 200) {
        document.getElementById("organisationModalTitle").innerText =
          "Edit/View Organisation";

        document.getElementById("organisationName").value =
          response.data.companyName;
        document.getElementById("organisationEmail").value =
          response.data.email;
        document.getElementById("organisationPhone").value =
          response.data.phone;
        document.getElementById("organisationAddress").value =
          response.data.address;

        document.getElementById("createOrganisationBtn").style.display = "none";
        document.getElementById("submitOrganisationBtn").style.display = "block";
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};


let loadPerson = function (contactId) {
  axios
    .get("/contact/person/" + contactId, {})
    .then(function (response) {
      if (response.status === 200) {
        document.getElementById("personModalTitle").innerText =
          "Edit/View Person";

        document.getElementById("personForename").value =
          response.data.name.forename;
        document.getElementById("personSurname").value =
          response.data.name.surname;
        document.getElementById("personEmail").value = response.data.email;
        document.getElementById("personPhone").value = response.data.phone;
        document.getElementById("personAddress").value = response.data.address;

        var companyNamesPerson = document.getElementById("companyNames").cloneNode(true); companyNamesPerson.id = "companyNamesPerson"; document.getElementById("companyNamesPerson").replaceWith(companyNamesPerson);

        for (var i = 0; i < document.getElementById("companyNamesPerson").length; i++) {
          if (document.getElementById("companyNamesPerson").options[i].id === response.data.companyId) {
            document.getElementById("companyNamesPerson").options[i].selected = true;
            break;
          }
        }

        document.getElementById("createPersonBtn").style.display = "none";
        document.getElementById("submitPersonBtn").style.display = "block";

        localStorage.setItem("personId", contactId);

        document.getElementById("deletePersonBtn").style.display = "block";
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};


function arrayRemove(arr, value) {
  return arr.filter(function (ele) {
    return ele != value;
  });
}


let updateOrgStaff = function (companyId, staffId, addTo) {
  // Get list of people affiliated with the company
  axios
    .get("/contact/company/" + companyId, {})
    .then(function (response) {
      if (response.status === 200) {
        var staff = response.data.people;

        // Add or remove staff from the list
        if (addTo === true) {
          staff.push(staffId);
        } else {
          staff.filter(function (ele) {
            return ele != staffId;
          });
        }

        // Update company list of staff
        axios
          .patch("/contact/" + companyId, {
            people: staff
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};


let updateOrganisation = function () {
  var orgId = document.getElementById("companyNames").options[document.getElementById("companyNames").selectedIndex].id
  axios
    .patch(
      "/contact/" + orgId,
      {
        companyName: document.getElementById("organisationName").value,
        email: document.getElementById("organisationEmail").value,
        phone: document.getElementById("organisationPhone").value,
        address: document.getElementById("organisationAddress").value
      }
    )
    .then(function (response) {
      if (response.status === 200) {
        printMsg("Contact updated", "success");
      }

      // if company name changes then change value in company name in slection box
      document.getElementById("companyNames").options[document.getElementById("companyNames").selectedIndex].innerText = document.getElementById("organisationName").value;

    })
    .catch(function (error) {
      console.log(error);
    });

  document.getElementById("orgModalCloseBtn").click();
};


let updatePerson = function () {
  var personId = localStorage.getItem("personId");

  axios
    .get("/contact/person/" + personId, {})
    .then(function (response) {
      if (response.status === 200) {
        var oldCompanyId = response.data.companyId;
        var companyId = document.getElementById("companyNamesPerson").options[document.getElementById("companyNamesPerson").selectedIndex].id;

        if (companyId === "n/a") {
          companyId = undefined;
        }

        axios
          .patch("/contact/" + personId, {
            forename: document.getElementById("personForename").value,
            surname: document.getElementById("personSurname").value,
            email: document.getElementById("personEmail").value,
            phone: document.getElementById("personPhone").value,
            address: document.getElementById("personAddress").value,
            companyId: companyId
          })
          .then(function (response) {

            // if staff moved company
            if (companyId != undefined) {

              // update staff list from new and old company
              updateOrgStaff(oldCompanyId, personId, false);
              updateOrgStaff(companyId, personId, true);

            }

            // companyId != undefined : special case if changes company from all comntacts list
            if (oldCompanyId != companyId && companyId != undefined) {
              // if staff changes company remove from staff contacts table
              var myNode = document.getElementById(personId);
              while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
              }
            }

            printMsg("Contact updated!", "success");

            if (document.getElementById(personId) && companyId === oldCompanyId) {

              NodeList.prototype.forEach = Array.prototype.forEach
              var child = document.getElementById(personId).childNodes;

              child[0].innerText = document.getElementById("personForename").value;
              child[1].innerText = document.getElementById("personSurname").value;
              child[2].innerText = document.getElementById("personPhone").value;
              child[3].innerText = document.getElementById("personEmail").value;
              child[4].innerText = document.getElementById("personAddress").value;
            }

            document.getElementById("personModalCloseBtn").click();
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};


let deleteContact = function (person) {
  var contactId;
  var companyId;

  if (person) {
    contactId = localStorage.getItem("personId");

    axios
      .get("/contact/person/" + contactId, {})
      .then(function (response) {
        if (response.status === 200) {

          companyId = response.data.companyId;
          if (companyId != undefined) {
            updateOrgStaff(companyId, contactId, false);
          }

        }
      })
      .catch(function (error) {
        console.log(error);
      });

  } else {
    contactId = document.getElementById("companyNames").options[document.getElementById("companyNames").selectedIndex].id;
  }

  axios.delete('/contact/' + contactId, {
  })
    .then(function (response) {
      if (response.status === 202) {
        printMsg("Contact Deleted", "success");
        loadCompanyNames();
      }
    })
    .catch(function (error) {
      console.log(error);
    });

  if (person) {
    var myNode = document.getElementById(localStorage.getItem("personId"));
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
    document.getElementById("personModalCloseBtn").click();
  } else {
    document.getElementById("orgModalCloseBtn").click();
  }
}


let refreshTable = function (response) {
  var myNode = document.getElementById("table-body");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }

  for (var i = 0; i < response.data.contact.length; i++) {
    var contact = response.data.contact[i];
    let table = document
      .getElementById("AddressTable")
      .getElementsByTagName("tbody")[0];
    var newRow = table.insertRow(table.rows.length);
    newRow.className = "contact";
    newRow.onclick = function () {
      loadPerson(this.id);
    };
    newRow.setAttribute("data-toggle", "modal");
    newRow.setAttribute("data-target", "#newPersonModal");

    newRow.id = contact._id;
    newRow
      .insertCell(0)
      .appendChild(document.createTextNode(contact.name.forename));
    newRow
      .insertCell(1)
      .appendChild(document.createTextNode(contact.name.surname));
    newRow
      .insertCell(2)
      .appendChild(document.createTextNode(contact.phone));
    newRow
      .insertCell(3)
      .appendChild(document.createTextNode(contact.email));
    newRow
      .insertCell(4)
      .appendChild(document.createTextNode(contact.address));
  }
}


let searchContacts = function () {

  if (document.getElementById("searchBar").value.trim() === "" && document.getElementById("companyNames").options[document.getElementById("companyNames").selectedIndex].id === "n/a") {
    loadAllContacts();
    return;
  }

  if (document.getElementById("searchBar").value.trim() === "" && document.getElementById("companyNames").options[document.getElementById("companyNames").selectedIndex].id != "n/a") {
    loadContactsByCompany();
    return;
  }

  if (document.getElementById("companyNames").options[document.getElementById("companyNames").selectedIndex].id != "n/a") {
    axios
      .get("/contact/" + document.getElementById("companyNames").options[document.getElementById("companyNames").selectedIndex].id + "/name/" + document.getElementById("searchBar").value, {})
      .then(function (response) {
        if (response.status === 200) {
          console.log(response);
          refreshTable(response);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    axios
      .get("/contact/allPeople/" + document.getElementById("searchBar").value, {})
      .then(function (response) {
        if (response.status === 200) {

          console.log(response);
          refreshTable(response);

        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

};
