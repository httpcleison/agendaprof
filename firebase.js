import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getDatabase, ref as dbRef, update, onValue, get, set, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"; // Adicionando o módulo de autenticação

const firebaseConfig = {
    apiKey: "AIzaSyB0HWlY4a7HFNT6qT54CRH7QStdBr5z7F4",
    authDomain: "agendaprof-654ad.firebaseapp.com",
    projectId: "agendaprof-654ad",
    storageBucket: "agendaprof-654ad.appspot.com",
    messagingSenderId: "553346861287",
    appId: "1:553346861287:web:89375da083ff4f0c9ffa42",
    measurementId: "G-WG3L5KBNNW"
}

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app)

let login_dados = []
let eqps_dispos = []
// let equipamentos= ["projetor01", "projetor02", "projetor03"]
let day_of_week_selected

function renderEqpsDispos(day){
    let eqpSelect
    document.querySelector(".modals div .eqps_dispo").innerHTML = ""
    eqps_dispos = []
    day_of_week_selected = document.querySelector(".container .week .controls .day_of_week span").textContent.trim().toLowerCase().split("-")[0]

    day = day_of_week_selected

    onValue(dbRef(database, "semana/"+day), async (snapshot) => {
        let equipamentos_do_dia = snapshot.val()

        for(let chave in equipamentos_do_dia){
            if(equipamentos_do_dia.hasOwnProperty(chave)){
                let el = equipamentos_do_dia[chave]
                if(el.dispo == true){
                    eqps_dispos.push(el.nome)
                }
            }
        }

        for(let i = 0; i < eqps_dispos.length; i++){
            document.querySelector(".modals div .eqps_dispo").innerHTML += '<div class="eqp"><span><span class="'+equipamentos_do_dia[eqps_dispos[i]].icone+'"></span>'+eqps_dispos[i]+'</span></div>'
        }

        document.querySelectorAll(".modals div .eqps_dispo .eqp").forEach((eqp)=>{
            eqp.addEventListener("click", ()=>{
                eqpSelect = eqp.querySelector('span').textContent.trim()
                eqp.style.color = "white"
                console.log(eqpSelect)
            })
        })

        //enviar agendamento
        document.querySelector(".modals div .control .btn_agendar").addEventListener("click", ()=>{
            // console.log("semana/"+day+"/"+eqpSelect)
            get(dbRef(database, "semana/"+day+"/"+eqpSelect)).then((snapshot)=>{
                if(snapshot.val().dispo !== false){
                    let icon_type_txt
                    if(eqpSelect.includes("projetor")){
                        icon_type_txt = "fas fa-laptop"
                    }else if(eqpSelect.includes("televisao")){
                        icon_type_txt = "fas fa-tv"
                    }else if(eqpSelect.includes("caixadesom")){
                        icon_type_txt = "fas fa-stop"
                    }
                    let date_agenda = {"professor": login_dados[0], "turma": "teste", "dispo": false, "aula": "aula01", "nome": eqpSelect, "icone": icon_type_txt}
                    set(dbRef(database, "semana/"+day+"/"+eqpSelect), date_agenda)
                    location.reload()
                }
            })
        })
        
    })

    // document.querySelector(".modals .btn_close_modal").addEventListener("click", ()=>{
    //     destroyModals()
    // })
}

//mostrar equipamentos que estão agendados
function renderSquareMainEqps(day){
    get(dbRef(database, "semana/"+day)).then((snapshot)=>{
        let equipamentos = snapshot.val()

        // console.log(equipamentos)
        // let equipamentos = snapshot.val()
        document.querySelector(".container .week .eqps").innerHTML = ""

        Object.keys(equipamentos).forEach(chave => {
            const equipamento = equipamentos[chave];
            if(equipamento.dispo == false){
                document.querySelector(".container .week .eqps").innerHTML += '<div class="eqp"><span><span class="'+equipamento.icone+'"></span>'+ equipamento.nome +'-'+ equipamento.professor +'-'+ equipamento.turma +'-'+ equipamento.aula+'</span></div>'
            }
        });
    })
}

document.querySelector(".modal-login div button").addEventListener("click", ()=>{
    get(dbRef(database, "acessos/"+document.querySelector(".modal-login .setUsername").value)).then((snapshot)=>{
        if(snapshot.exists()){
            onValue(dbRef(database, "acessos/"+document.querySelector(".modal-login .setUsername").value), async (snapshot)=>{
                if(document.querySelector(".modal-login .setPassword").value === snapshot.val().password){
                    login_dados[0] = snapshot.val().username
                    login_dados[1] = snapshot.val().password
                    login_dados[2] = snapshot.val().cargo
                    login_dados[3] = snapshot.val().desde
                    document.querySelector(".modal-login").style.display = "none"
                    renderSquareMainEqps("segunda")
                }
            })
        }else{
        }
    })
})

function callFunctionsAddAgenda(){
    newModal("disponiveis")
    day_of_week_selected = document.querySelector(".container .week .controls .day_of_week span").textContent.trim()
    // console.log(day_of_week_selected.toLowerCase().split("-")[0])
    renderEqpsDispos(day_of_week_selected.toLowerCase().split("-")[0])
}

function selectDayOfWeek(){
    document.querySelectorAll(".modals .dias-popup .select_week span").forEach((day)=>{
        day.addEventListener("click", (event)=>{
            destroyModals()
            renderSquareMainEqps(event.target.innerText.toLowerCase().split("-")[0])
            day_of_week_selected = event.target.innerText
            document.querySelector(".container .week .controls .day_of_week").innerHTML = ""
            document.querySelector(".container .week .controls .day_of_week").innerHTML = '<span><span class="fas fa-ellipsis-v"></span> '+day_of_week_selected+'</span>'
        })
    })
}

document.addEventListener("click", function(event) {
    if (event.target.matches(".fa-plus-square")) {
        callFunctionsAddAgenda();
    }else if(event.target.matches(".fa-user-circle")){
        newModal("conta")
        document.querySelector(".modals .conta-popup .dates").innerHTML += '<h3>'+login_dados[0]+'</h3><p>cargo: '+login_dados[2]+' | desde de: '+login_dados[3]+'</p>'
    }else if(event.target.matches(".day_of_week span")){
        newModal("dias_da_semana")
        selectDayOfWeek()
    }
});