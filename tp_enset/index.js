      let methode_element = document.querySelector("#methodes");
      let url_requete = document.querySelector("#url_requete");
      let header_key = document.querySelector("#header-key");
      let header_data = document.querySelector("#header-value");
      let body_requete = document.querySelector("#body");
      let response_requete = document.querySelector("#response-body");

      let button_envoyer = document.querySelector(".envoyer");
      let button_ajouter = document.querySelector(".ajouter");

      let headers = [];

      methode_element.addEventListener("change", () => {
        afficher_data(methode_element);
      });
      url_requete.addEventListener("blur", () => {
        afficher_data(url_requete);
      });
      header_key.addEventListener("blur", () => {
        afficher_data(header_key);
      });
      header_data.addEventListener("blur", () => {
        afficher_data(header_data);
      });
      body_requete.addEventListener("blur", () => {
        afficher_data(body_requete);
      });
      button_ajouter.addEventListener("click", () => {
        ajouter_header(headers);
      });

      button_envoyer.addEventListener("click", () => {
        envoyer_requete();
      });

      async function envoyer_requete() {
        let headers_formater = {};
        headers.forEach((header) => {
          // On sépare la chaîne "Clé : Valeur" en un tableau ["Clé", " Valeur"]
          let parties = header.split(":");
          if (parties.length === 2) {
            let cle = parties[0].trim(); 
            let valeur = parties[1].trim();
            headers_formater[cle] = valeur; 
        }});

        let options = {
          method: methode_element.value,
          headers: headers_formater,
        };

        if (
          methode_element.value !== "GET" &&
          methode_element.value !== "HEAD"
        ) {
          options.body = JSON.stringify(body_requete.value);
        }

        const requete = new Request(url_requete.value, options);

        try {
          const response = await fetch(requete);
          const data = await response.json(); 
          
          response_requete.value = JSON.stringify(data, null, 2);
        } catch (error) {
          response_requete.value = "Erreur : " + error.message;
        }
      }
      function ajouter_header(headers) {
        headers.push(`${header_key.value} : ${header_data.value}`);
        header_key.value = "";
        header_data.value = "";
        console.log(headers);
      }

      function afficher_data(data) {
        console.log(data.value);
      }