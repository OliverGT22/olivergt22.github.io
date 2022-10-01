function showPopup()
    {
        var data = document.getElementById("value").value;
        //check empty data field
        if(data == "")
        {
           alert("Ingresa un valor..");
        }
        else
        {
            alert("El valor ingresado es: "+data); //display variable along with the string
        }
    }
	
function estado(){	
	if(navigator.onLine) {
		goOnline();
	} else {
		goOffile();
	}
}

window.addEventListener('offline', goOffline());
window.addEventListener('online', goOnline());

function goOnline() {
	document.getElementById("conexion").innerHTML = 'Online';
	document.getElementById("conexion").style.color = "green";
}

function goOffline() {
	document.getElementById("conexion").innerHTML = 'Offline';
	document.getElementById("conexion").style.color = "red";
}