const eventStr = (event) => {
   MailApp.sendEmail(
	'dev@dev.com',
	'test',
	JSON.stringify(e));
}

function onSubmit(event){

  try{
    const recipient = "approver@this.com";
    const c_respuesta = "approver@this.com";
    const correo_reject = Session.getActiveUser().getEmail();
    const s = SpreadsheetApp.getActiveSheet();
    const headers = s.getRange(1,1,1,s.getLastColumn()).getValues()[0];
    let rowsData = [['Params', 'Vals']];

    for (let i =0; i<headers.length;i++) {
      let header = headers[i]
      let value = event.namedValues[header][0];
      if (value !== "") {
        rowsData.push([header, value]);
      }
    }

    const correo_apro = "mail@mail.com" + correo_reject;
    const nom_prov = event.namedValues["NameBS"][0];
    let dapp = DriveApp;
    let doc = DocumentApp.create('Request of creation - ' + nom_prov).addViewer(recipient);
    let body = doc.getBody();
    let id = dapp.getFilesByName('Request of creation - ' + nom_prov).next().getId();
    body.insertParagraph(
          0,
          doc.getName()
        ).setHeading(
          DocumentApp.ParagraphHeading.HEADING1
        );

    let table = body.appendTable(rowsData);
    let docFile = dapp.getFileById(id);
    table.getRow(0).editAsText().setBold(true);

    dapp.getFoldersByName('FOLDER').next().addFile(docFile);
    dapp.getRootFolder().removeFile(docFile);

    const ruta_uno = "https://docs.google.com/document/d/";
    const ruta_dos = "/export?format=doc";
    const url = ruta_uno + id + ruta_dos;
    const messagehtml = url;
    const message = "Please verify and aprove this information.";

    let html = "<body>"+
      "<strong>Request</strong><br/>" +
        "<br>"+message+"<br><br>"+
          "More information following link:<br>" + url + "<br><br>" +
            "Please approve or reject this request<br/>" +
              "<a href='mailto:"+correo_apro+"?subject=Approved%20-%20Request%20of%20vendor%20creation%20-%20"+nom_prov+"&body=Buen%20día,%0D%0DSolicitud%20de%20creación%20aprobada.%0D%0DVer%20el%20documento%20en%20el%20siguiente%20link:%0D%0D"+messagehtml+"%0D%0DComentarios:%0D%0D'><button style='background-color:green; border-color:white; color:white'>Approve</button></a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<a href='mailto:"+correo_reject+"?subject=Rejected%20-%20Request%20of%20vendor%20creation%20"+nom_prov+"&body=Buen%20día,%0D%0DSu%20solicitud%20de%20creación%20fue%20rechazada%20por%20la%20siguiente%20razón:%0D%0DComentarios:%0D%0DSolicitud%20detallada%20en%20el%20siguiente%20link:%0D%0D"+messagehtml+"'><button style='background-color:red; border-color:white; color:white'>Reject</button></a>"+
                  "</body>";

    let subject = "Request of vendor creation - " + nom_prov;
    let options = { name:"Required Approve" , htmlBody: html, replyTo: c_respuesta };
    MailApp.sendEmail(recipient, subject, message, options);

  }catch(error){
    let admin = "user@admin.com";
    MailApp.sendEmail(admin,"Error","Message: " + error);
  }
}
