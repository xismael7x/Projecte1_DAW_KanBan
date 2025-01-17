        // Agafem les variables de les columnes
        const columnaToDo = document.querySelector('.todo-column');
        const columnaDoing = document.querySelector('.doing-column');
        const columnaDone = document.querySelector('.done-column');

        // Aqui agafem les variables dels botons
        const bNetejarTot = document.querySelector('.btn-danger');
        const bAfegirTasca = document.querySelector('.btn-success');
        const bCarregarTasques = document.querySelector('.btn-primary');

        // Fem un event per afegir la tasca
        bAfegirTasca.addEventListener('click', function() {
            // Demanem l'informació general de la tasca
            alert("Tots els camps son obligatoris.")
            const titol = prompt('Títol de la tasca:');
            const dataFi = prompt('Data de finalització (DD/MM/AAAA):');

            // Creem una variable booleana per validar la data
            let dataCorrecte = true;

            // Si la data està escrita incorrectament fem un alert
            if (!validarData(dataFi)) {
                alert("Error en la data, té que tindre el format: DD/MM/AAAA.");
                dataCorrecte = false;

            // Sino
            } else {
                // Demanem la resta d'informació
                const descripcio = prompt('Descripció de la tasca:');
                const dataInici = dataActual();
                const responsable = prompt('Nom del responsable:');

                // Si s'omple tota l'informació, emplenem els camps
                if (titol && descripcio && dataInici && dataFi && responsable) {
                const novaTasca = {
                    // Aquest ID anirà per data en un string
                    id: Date.now().toString(),
                    titol: titol,
                    descripcio: descripcio,
                    dataInici: dataInici,
                    dataFi: dataFi,
                    responsable: responsable,
                    // Aqui posa To-Do, ja que anirà per defecte les tasques, desprè s'arrossega
                    estat: 'todo',
                    favorita: false 
                };

                // Aqui obtenim les tasques del localStorage
                const tasques = JSON.parse(localStorage.getItem('tasquesKanban')) || [];
                
                // Quan es fa clic en afegir, pujem la tasca
                tasques.push(novaTasca);

                // Emmagatzem les tasques en el localStorage
                localStorage.setItem('tasquesKanban', JSON.stringify(tasques));

                // Tornem a mostrar les tasques en les columnes corresponents
                mostrarTasques(tasques);
            } else {
                alert('S\'ha d\'emplenar totes les dades');
            }
            }
        });

        // Creem una funció per posar la data de creació de les tasques
        function dataActual() {
            let avui = new Date();
            let dia = avui.getDate().toString().padStart(2, '0'); // Agregem un zero si el dis és menor a 10, per exemple 07
            let mes = (avui.getMonth() + 1).toString().padStart(2, '0'); // Fem el mateix amb el mes
            let any = avui.getFullYear();
            return `${dia}/${mes}/${any}`;
        }

        // Aqui creem una funció per validar la data que posa l'usuari
        function validarData(data) {
            // Validem la data amb una expressió regular
            let validarData = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
            return validarData.test(data);
        }

        // Creem una tarja de tasca amb l'HTML, les classes anirán asociades amb bootstrap
        function crearTasca(tasca) {
            const targeta = document.createElement('div');
            targeta.classList.add('card', 'targetaTasca');
            targeta.setAttribute('draggable', 'true');
            targeta.setAttribute('data-id', tasca.id);
            targeta.innerHTML = `
                <div class="card-body">
                    <h3 class="card-title">${tasca.titol}</h3>
                    <p class="card-text">${tasca.descripcio}</p>
                    <p style="color: gray; font-size: 12px; text-align: left;">Creació de la tasca: ${tasca.dataInici}</p>
                    <p style="color: gray; font-size: 12px; text-align: left;">Data fi: ${tasca.dataFi}</p>
                    <p style="font-size: 12px; text-align: right;"><strong>Responsable:</strong> ${tasca.responsable}</p>
                </div>
                <div class="card-footer">
                    <i class="fa-${tasca.favorita ? 'solid' : 'regular'} fa-star" onclick="marcarFavorita(this, '${tasca.id}')"></i>
                    <i class="fa-regular fa-pen-to-square" onclick="modificarTasca('${tasca.id}')" onmouseenter="canviarSolid(this)" onmouseleave="canviarRegular(this)"></i>
                    <i class="fa-regular fa-trash-can" onclick="esborrarTasca('${tasca.id}')" onmouseenter="canviarSolid(this)" onmouseleave="canviarRegular(this)"></i>
                </div>
            `;
            return targeta;
        }

        // Creem altre event per el botó de netejar tot
        bNetejarTot.addEventListener('click', function() {
            // Mostrem un missatge, per confirmar si l'usuari vol esborrar tot, o no
            const confirmacio = confirm('Vols esborrar TOTES les tasques?');

            // Si l'usuari confirma, esborrem les tasques, sino deixem com abans
            if (confirmacio) {
                // Esborrem totes les tasques dins del localStorage
                localStorage.removeItem('tasquesKanban');

                // Tornem a mostrar les columnes buides
                mostrarTasques([]); // Retornem un array buit
            }
        });

        // Fem una funció per carregar totes les tasquest que estan dins del localStorage
        function carregarTasques() {
            const tasques = JSON.parse(localStorage.getItem('tasquesKanban')) || [];
            mostrarTasques(tasques);
        }

        // Mostrem les tasques
        function mostrarTasques(tasques) {
            // Aqui anirà primer de tot els texts de les columnes
            columnaToDo.innerHTML = '<h2>To-Do</h2>';
            columnaDoing.innerHTML = '<h2>Doing</h2>';
            columnaDone.innerHTML = '<h2>Done</h2>';

            // Amb un filtre ordenem l'array per tasques marcades com favorites, o no
            let tasquesFavorites = tasques.filter(tasca => tasca.favorita);
            let tasquesNoFavorites = tasques.filter(tasca => !tasca.favorita);
            let tasquesOrdenades = [...tasquesFavorites, ...tasquesNoFavorites];

            // Amb el foreach recorrem tot l'array i mostrem les tasques ordenades
            tasquesOrdenades.forEach(tasca => {
                // En aquest petit fragment mostrem les tasques en la pàgina
                const targeta = crearTasca(tasca);
                if (tasca.estat == 'todo') {
                    columnaToDo.appendChild(targeta);
                } else if (tasca.estat == 'doing') {
                    columnaDoing.appendChild(targeta);
                } else if (tasca.estat == 'done') {
                    columnaDone.appendChild(targeta);
                }
            });

            // Configurem el drag and drop per les tasques
            const targetes = document.querySelectorAll('.targetaTasca');
            targetes.forEach(targeta => {
                targeta.addEventListener('dragstart', dragStart);
            });
        }

        // Fem una funció per canviar els icones de regular a solid
        function canviarSolid(icon) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
        }

        // Altre que farà el mateix però al reves
        function canviarRegular(icon) {
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
        }

        // Funció per marcar una tasca com favorita i prioritzar-la 
        function marcarFavorita(icon, tascaId) {
            // Obtenim les tasques dins de localStorage
            let tasques = JSON.parse(localStorage.getItem('tasquesKanban')) || [];

            // Cerquem la tasca per el seu id
            const tasca = tasques.find(t => t.id == tascaId);

            // Si la tasca existeix la modifiquem
            if (tasca) {
                // Canvia l'estat com favorita
                tasca.favorita = !tasca.favorita;

                // Actualitzem l'estat l'icone depenent de si està marcada o no
                if (tasca.favorita) {
                    icon.classList.remove('fa-regular');
                    icon.classList.add('fa-solid'); // Posem l'icone en solid per donar senyal

                    tasca.favorita = true;  // Marca la tasca com Favorita és igual a true
                        
                    // Reorganitza les tasques per que puguin pujar
                    tasques.sort((a, b) => (b.favorita ? 1 : 0) - (a.favorita ? 1 : 0));

                    // Actualitzem inmediatament la pàgina i mostrem les tasques ordenades
                    mostrarTasques(tasques);
                } else {
                    icon.classList.remove('fa-solid');
                    icon.classList.add('fa-regular'); // Torna a regular 

                    tasca.favorita = false;  // Marca la tasca com Favorita és igual a false
                    
                    // Organitzem les tasques altre vegada
                    tasques.sort((a, b) => (b.favorita ? 1 : 0) - (a.favorita ? 1 : 0));

                    // Tornem a cridar la funció mostrarTasques
                    mostrarTasques(tasques);
                }

                // Emmagatzem els canvis en el localStorage
                localStorage.setItem('tasquesKanban', JSON.stringify(tasques));
            }
        }

        // Funció per modificar la tasca
        function modificarTasca(id) {
            // Obtindre les tasques del localStorage
            const tasques = JSON.parse(localStorage.getItem('tasquesKanban')) || [];
            
            // Cerquem la tasca per el seu id
            const tasca = tasques.find(t => t.id == id);

            // Si la tasca existeix mostrem els promts
            if (tasca) {
                // Pedir nuevo título y nueva descripción
                const nouTitol = prompt("Nou títol", tasca.titol);
                const novaDataFi = prompt("Nova data de finalització (DD/MM/AAAA):", tasca.dataFi);

                // Creem una variable booleana per validar la data
                let dataCorrecte = true;

                // Si la data està escrita incorrectament fem un alert
                if (!validarData(novaDataFi)) {
                    alert("Error en la data, té que tindre el format: DD/MM/AAAA.");
                    dataCorrecte = false;
                }

                else {
                    // Si l'usuari posa les dades modificades
                    const novaDescripcio = prompt("Nova descripció", tasca.descripcio);
                    const nouResponsable = prompt("Nou responsable:", tasca.responsable);

                    if (nouTitol && novaDescripcio && novaDataFi && nouResponsable) {
                        // Assignem els nous valors
                        tasca.titol = nouTitol;
                        tasca.descripcio = novaDescripcio;
                        tasca.dataFi = novaDataFi;
                        tasca.responsable = nouResponsable;;

                        // Emmagatzem les tasques en el localStorage
                        localStorage.setItem('tasquesKanban', JSON.stringify(tasques));

                        // Mostrem altre vegada les tasques
                        mostrarTasques(tasques);
                    }
                }
            }
        }

        // Altre funció per esborrar la tasca
        function esborrarTasca(tascaId) {
            // Mostrem el missatge de confirmació
            const confirmacio = confirm('Vols esborrar aquesta tasca?');

            // Si hi ha confirmació per part de l'usuari, esborrem la tasca
            if (confirmacio) {
                let tasques = JSON.parse(localStorage.getItem('tasquesKanban')) || [];
                tasques = tasques.filter(tasca => tasca.id != tascaId);
                localStorage.setItem('tasquesKanban', JSON.stringify(tasques));
                mostrarTasques(tasques);
            }
        }

        // Funció per iniciar l'arrossegament de la tasca
        function dragStart(e) {
            e.dataTransfer.setData('text', e.target.getAttribute('data-id')); // Emmagatzem l'ID de la tasca
        }

        // Permet que faci el Drop de les columnes
        function dragOver(e) {
            e.preventDefault(); // Això es necesari per fer el drop (inf. en el manual)
        }

        // Al deixar la tasca s'actualitza el seu estat
        function drop(e) {
            e.preventDefault();
            const tascaId = e.dataTransfer.getData('text');
            const tasques = JSON.parse(localStorage.getItem('tasquesKanban')) || [];
            const tasca = tasques.find(t => t.id == tascaId);
            
            // Actualitzem l'estat de la tasca segons la columna on esta ubicada
            if (e.target == columnaToDo || e.target.closest('.todo-column')) {
                tasca.estat = 'todo';
            } else if (e.target == columnaDoing || e.target.closest('.doing-column')) {
                tasca.estat = 'doing';
            } else if (e.target == columnaDone || e.target.closest('.done-column')) {
                tasca.estat = 'done';
            }

            // Emmagatzem la tasca actualitzada en el localStorage
            localStorage.setItem('tasquesKanban', JSON.stringify(tasques));
            mostrarTasques(tasques);
        }

        // Última funció per carregar les tasques
        bCarregarTasques.addEventListener('click', function() {
            carregarTasques();
        });
