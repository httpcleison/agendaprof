// // function newModal(type){
// //         // document.querySelector("body").innerHTML += "<div class='modals'><div><div class='eqps_dispo'></div><div class='control'><buton>agendar</button></div></div></div>"
// //         document.querySelector("body").innerHTML += '<div class="modals"><div class="btn_close_modal"><span class="fas fa-times"></span></div><div class="modal_agendar"><div class="eqps_dispo"></div><div class="control"><button class="btn_agendar">agendar</button></div></div></div>'
// // }

// function destroyModals(){
//     if(document.querySelector(".modals")){
//         document.querySelector(".modals").innerHTML = ""
//         document.querySelector(".modals").remove()
//     }
// }

// function newModal(type){
//     document.querySelector("body").innerHTML += '<div class="modals"><div class="btn_close_modal"><span class="fas fa-times"></span></div><div class="modal_agendar"><div class="eqps_dispo"></div><div class="control"><button class="btn_agendar">agendar</button></div></div></div>';
// }

function destroyModals(){
    if(document.querySelector(".modals")){
        document.querySelector(".modals").innerHTML = ""
        document.querySelector(".modals").remove()
    }
}

function newModal(type){
    if(type==="disponiveis"){
        document.querySelector("body").innerHTML += '<div class="modals"><div class="btn_close_modal"><span class="fas fa-times"></span></div><div class="modal_agendar"><div class="eqps_dispo"></div><div class="control"><button class="btn_agendar">agendar</button></div></div></div>';
    }else if(type==="conta"){
        document.querySelector("body").innerHTML += '<div class="modals"><div class="btn_close_modal"><span class="fas fa-times"></span></div><div class="conta-popup"><span><span class="fas fa-info-circle"></span>Informaçoes</span><div class="infos"><div class="profile"></div><div class="dates"></div></div></div></div>'
    }

    document.querySelector(".modals .btn_close_modal").addEventListener("click", ()=>{
        destroyModals()
    })
}