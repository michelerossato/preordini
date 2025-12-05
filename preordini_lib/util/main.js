// VARIABILI GLOBALI (necessarie per l'uso in più funzioni)
var graphicManager;
var dataManager;

// TUTTA la logica di inizializzazione dell'app deve essere qui.
// Questa funzione viene chiamata da data.js SOLO DOPO che menu.json è stato caricato.
function avviaApplicazione() {
   
   // Inizializza i manager solo una volta
   graphicManager = new GraphicManager();
   dataManager = new Data();
   
   // Aggiunge la gestione degli eventi alla pagina principale
   $(document).on("pagebeforeshow","#pageprinc",function(){
      
      // QUESTO BLOCCO COSTRUISCE LA LISTA DEGLI ARTICOLI!
      $("#lista").empty().append(
         graphicManager.generateMenu(
            dataManager.getInstanceHashmap()
         )
      ).collapsibleset();
      
      $("#lista").trigger("create");
      
      graphicManager.setButtonPlusMinus();
      
      $("#resoconto-btn").click(function(evt) {
         evt.stopImmediatePropagation();
         evt.preventDefault();
         var hashmap = dataManager.getInstanceHashmap();
         if(hashmap.isEmpty()){
            graphicManager.generatePopup(
               "#popup-ordine",
               {value: false}
            );
            $("#popup-ordine").popup("open");
         }
         else{
            dataManager.saveInstanceHashmap(hashmap);
            $.mobile.pageContainer.pagecontainer("change", "#pageres", {});
         }
      });
      
      $("#elimina-ordine-btn").click(function(evt) {
         evt.stopImmediatePropagation();
         evt.preventDefault();
         var txt;
         var dataElimina = {value: true, state: 0};
         
         var hashmap = dataManager.getInstanceHashmap();
         if(!hashmap.isEmpty()){
            dataElimina.state = 1;
            hashmap.makeEmpty();
            dataManager.saveInstanceHashmap(hashmap);
            hashmap = dataManager.getInstanceHashmap();
            for(var i = 0; i < elencoPrincipale.length; i++){
               var pietanze = elencoPietanze[elencoPrincipale[i]];
               for(var j = 0; j < pietanze.length; j++){
                  var id = pietanze[j].id;
                  var quantitaHtml = $("#quantita" + id);
                  var quantita = hashmap.contains(id) ? hashmap.get(id) : 0;
                  quantitaHtml.html(quantita + "");
               }
            }   
         }

         graphicManager.generatePopup(
            "#popup-ordine",
            dataElimina
         );
         
         $("#popup-ordine").popup( "open");

      });   
   });
   
   // Logica per le altre pagine (#pageres e #pageqrcode)
   // Non hanno bisogno di attendere i dati del menu, ma usano gli stessi manager.
   // Le lasciamo fuori dalla funzione avviaApplicazione per coerenza col tuo codice originale.
}

// Codice iniziale (eseguito subito)
$(document).on("pagecreate",function(event){
   
   // Inizializza le pagine che NON dipendono dal caricamento del menu (tutto tranne #pageprinc)
   
   // La funzione avviaApplicazione() viene chiamata da data.js,
   // dopo che i dati del menu sono stati caricati.
     
   $(document).on("pagebeforeshow","#pageres",function(){ 
      // Qui devi usare le variabili globali definite in avviaApplicazione
      var hashmap = dataManager.getInstanceHashmap();
      if(hashmap.isEmpty()){
         $.mobile.pageContainer.pagecontainer("change", "#pageprinc", {});
         return;
      }
		var dict = {};
	  dict['nomecliente'] =  $('#nomecliente').val();
	  dict['coperti'] = $('#coperti').val();
	  dict['tavolo'] = $('#tavolo').val();
	  
      $("#resoconto").html(
         graphicManager.generateResoconto(
            hashmap, dict
         )
      );
      $("#modifica-btn").click(function(evt) {
         evt.stopImmediatePropagation();
         evt.preventDefault();
         $.mobile.pageContainer.pagecontainer("change", "#pageprinc", {});
      });
      $("#conferma-btn").click(function(evt) {
         evt.stopImmediatePropagation();
         evt.preventDefault();
         $.mobile.pageContainer.pagecontainer("change", "#pageqrcode", {});
      });
   });
   
   $(document).on("pagebeforeshow","#pageqrcode",function(){ 
	  function generateTextQRCode(hashmap){
		 var nomecliente = $('#nomecliente').val();
		 var numerotavolo = $('#tavolo').val();
		 var numerocoperti = $('#coperti').val();
		 
         var obj = {numeroTavolo:numerotavolo,cliente:nomecliente,coperti:numerocoperti,righe:[]};
         var keys = hashmap.keys();
         for(var i = 0; i < keys.length; i++){
            obj.righe.push({id:parseInt(keys[i]),qta:hashmap.get(keys[i])});
         }
         return encodeURIComponent(JSON.stringify(obj));
      }
      
      // Qui le variabili devono essere definite, ma sono globali ora:
      var hashmap = dataManager.getInstanceHashmap();
      
      if(hashmap.isEmpty()){
         $.mobile.pageContainer.pagecontainer("change", "#pageprinc", {});
         return;
      }
      
      $("#nuovo-ordine-btn").click(function(evt) {
         evt.stopImmediatePropagation();
         evt.preventDefault();
         dataManager.saveInstanceHashmap(new HashMap());
         $.mobile.pageContainer.pagecontainer("change", "#pageprinc", {});
      });
      
      $("#qrcode").html("");
      var qrcode = new QRCode(
         document.getElementById("qrcode"),
         {
            width: 100,
            height: 100,
            useSVG: true
         }
      );
         
      var qrCodeManager = new QRCodeManager(qrcode);
      qrCodeManager.clear();
      qrCodeManager.makeQRCode(generateTextQRCode(hashmap));
   });

});